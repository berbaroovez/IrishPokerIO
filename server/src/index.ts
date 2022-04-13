// src/server.ts

import { Server } from "socket.io";
import { cards } from "./Cards";
import { Player, Game, Card } from "./util/types";
const clone = require("rfdc")();
// const initListeners = require("./listeners/connected");
var connections = [] as Game[];

const io = new Server(
	parseInt(process.env.PORT) || 3000,
	{
		cors: {
			origin: ["https://irish-poker-io.vercel.app", "http://localhost:3001"],
			// origin: "http://localhost:3001",
			methods: ["GET", "POST"],
		},
	},
);

// initListeners(io);

io.on(
	"connection",
	(socket) => {
		//new player joins
		socket.on(
			"joinRoom",
			({ name, room }) => {
				console.log("Someone is joining the room");
				//user joines room

				//check if game exists
				const game = doesGameExist(room);
				if (game) {
					console.log("joinRoom -- game exists");
					//game exists

					// we cut the limit at 13 because of the deck size
					if (
						connections[connections.findIndex((game) => game.roomId === room)].players.length === 13
					) {
						console.log("joinRoom -- game is full");
						io.to(socket.id).emit("roomFull");
					} else {
						console.log("joinRoom -- game is not full");
						socket.join(room);
						const player = {
							name,
							yourTurn: false,
							cards: [] as Card[],
							clientId: socket.id,
							host: false,
							drinksGiven: 0,
							drinksTaken: 0,
						};
						//find the game wit the room id and push player onto array
						connections.find((game) => game.roomId === room).players.push(
							player,
						);
						socket.in(room).emit(
							"notification",
							{ title: "Someones HEEEEEERE", players: connections },
						);
					}
				} else {
					//game does not exist
					console.log("joinRoom -- creating game");
					createGame(room, name, socket.id);
					socket.join(room);
				}

				//send back the game state
				io.in(room).emit(
					"gameState",
					{ gameState: connections.find((game) => game.roomId === room) },
				);
			},
		);

		//update if a player is giving a drink or not

		socket.on(
			"updateIsSomeoneGivingOutDrinks",
			({ givingOutDrinks, room }) => {
				var gameIndex = -1;
				const game = connections.find(
					(game, index) => {
						if (game.roomId === room) {
							gameIndex = index;
						}
						return game.roomId === room;
					},
				);

				game.isSomeoneGivingDrinks = givingOutDrinks;

				io.in(room).emit(
					"gameState",
					{ gameState: connections.find((game) => game.roomId === room) },
				);
			},
		);
		socket.on(
			"updateHideButtons",
			({ givingOutDrinks, room }) => {
				var gameIndex = -1;
				const game = connections.find(
					(game, index) => {
						if (game.roomId === room) {
							gameIndex = index;
						}
						return game.roomId === room;
					},
				);

				game.hideButtons = givingOutDrinks;

				io.in(room).emit(
					"gameState",
					{ gameState: connections.find((game) => game.roomId === room) },
				);
			},
		);

		socket.on(
			"printConnections",
			(callback) => {
				// console.log(connections);
				const clients = io.sockets.adapter.rooms.get("party");
				console.log(clients);
				callback(connections);
			},
		);

		// socket.on("testOne", ({ room }) => {
		//   console.log(room);

		//   io.in(room).emit("thisIsTest", {
		//     testState: { test: "Hello World" },
		//   });
		// });
		// socket.on("testTwo", ({ room }) => {
		//   console.log(room);

		//   io.in(room).emit("thisIsTest", {
		//     testState: { test: "Goodbye World" },
		//   });
		// });

		//player starts game
		socket.on(
			"startGame",
			({ room }) => {
				//check if the game has more then one player
				const game = connections.find((game) => game.roomId === room);
				if (game.players.length === 1) {
					io.in(room).emit("notification", { title: "Not enough players" });
				} else {
					connections.find((game) => game.roomId === room).status = "started";
					//shuffle the deck and then give each player 4 cards

					const tempDeck = clone(cards);

					const GameDeck = [...tempDeck].sort(() => Math.random() - 0.5);
					const players = connections.find((game) => game.roomId === room).players;
					players.forEach((player) => {
						player.cards = GameDeck.splice(0, 4);
					});

					connections.find((game) => game.roomId === room).players = players;
					connections.find((game) => game.roomId === room).players[0].yourTurn =
						true;

					//send gamestate to everyone
					io.in(room).emit(
						"startGame",
						{ gameState: connections.find((game) => game.roomId === room) },
					);
				}
			},
		);

		//player disconnected
		socket.on(
			"disconnect",
			function () {
				console.log("user disconnected");
			},
		);

		//we use disconnecting here because it stores the socket data before the disconnet actually happens
		//This allows us to get the socketid and rooms that the socketid is n
		socket.on(
			"disconnecting",
			() => {
				console.log("user is disconnecting");
				var rooms = io.sockets.adapter.sids.get(socket.id);
				//convert from a Set to an array
				var roomsArray = Array.from(rooms);
				roomsArray = roomsArray.filter((room) => room.indexOf(socket.id) === -1);

				//if the user was in a room lets update gamestate when they disconnect
				if (roomsArray.length > 0) {
					const roomId = roomsArray[0];

					// go to the roomId and remove the player
					const GameSnapShot = connections.find(
						(game, index) => {
							return game.roomId === roomId;
						},
					);

					if (GameSnapShot !== undefined) {
						GameSnapShot.players =
							GameSnapShot.players.filter(
								(player) => player.clientId !== socket.id,
							);

						//if there are no players left, remove the game
						if (GameSnapShot.players.length === 0) {
							console.log("NO PLAYERS LEFT REMOVING GAME");
							connections = connections.filter((game) => game.roomId !== roomId);
							console.log("connections", connections);
						}

						//check to see if a host is still in the lobby if not find a new host
						var isThereAHost = GameSnapShot.players.find(
							(player) => player.host === true,
						);
						// console.log("Is There A host", isThereAHost);
						if (GameSnapShot.players.length > 0 && !isThereAHost) {
							GameSnapShot.players[0].host = true;
							// connections[gameIndex].players = GameSnapShot.players;
						}

						//if there is only player left and the game is started remove the game
						if (
							GameSnapShot.players.length === 1 && GameSnapShot.status === "started"
						) {
							console.log(
								"only one player left and game is started we are ending it",
							);
							connections = connections.filter((game) => game.roomId !== roomId);
							io.in(roomId).emit("NotEnoughPlayers");
							io.in(roomId).disconnectSockets();
						}
					} else {
						console.log("------------------GameSnapeShot is undefined");
					}

					//send gameState back to everyone but the host
					io.in(roomId).emit(
						"gameState",
						{ gameState: connections.find((game) => game.roomId === roomId) },
					);
				}
				//------------------------NEED TO GIVE ANOTHER PLAYER A TURN IF THE DISCONENCTED PLAYER HAD THE TURN
			},
		);

		socket.on(
			"playerLeft",
			() => {
				console.log("player left");
			},
		);

		socket.on(
			"update_whose_turn_it_is",
			({ room }) => {
				// //correctly update the players turn
				var playerIndex = -1;

				const game = connections.find(
					(game, index) => {
						// if (game.roomId === room) {
						//   gameIndex = index;
						// }
						return game.roomId === room;
					},
				);

				//find the index for whose turn it is
				game.players.find(
					(player, index) => {
						if (player.yourTurn === true) {
							playerIndex = index;
							player.yourTurn = false;
						}
					},
				);

				if ((game.players.length - 1) === playerIndex) {
					game.players[0].yourTurn = true;
				} else {
					game.players[playerIndex + 1].yourTurn = true;
				}

				game.hideButtons = false;
				io.in(room).emit("gameState", { gameState: game });
			},
		);

		//player flips card
		socket.on(
			"guess",
			({ userState, room }) => {
				// take userstate and update gamestate

				//find the game and update the players cards to the new cards

				var gameIndex = -1;
				var playerIndex = -1;
				const game = connections.find(
					(game, index) => {
						if (game.roomId === room) {
							gameIndex = index;
						}
						return game.roomId === room;
					},
				);

				//find the player and update their cards
				const player = game.players.find(
					(player, index) => {
						//storing index to use later
						if (player.clientId === userState.clientId) {
							playerIndex = index;
						}
						return player.clientId === userState.clientId;
					},
				);
				player.cards = userState.cards;

				connections[gameIndex].players[playerIndex] = player;

				// if the last player has flipped there fourth card the game is now OVER! and The fourth player is not giving out drinks then we can end game
				if (
					connections[gameIndex].players[connections[gameIndex].players.length - 1].cards[3].Flipped === true && connections[gameIndex].isSomeoneGivingDrinks === false
				) {
					//set a timer so the page doesnt automatically close
					console.log("GAME OVER _______________");
					// setTimeout(
					// 	() => {
					// 		console.log("GAME OVER tiemout pre");
					// 		connections[gameIndex].status = "finished";
					// 		console.log("GAME OVER tiemout post");
					// 	},
					// 	5000,
					// );
					connections[gameIndex].status = "finished";
					console.log("GAME OVER tiemout after");
				}

				io.in(room).emit(
					"gameState",
					{ gameState: connections.find((game) => game.roomId === room) },
				);
			},
		);

		//player guessed correctly and is now giving out a dirnk
		socket.on(
			"giveOutDrink",
			({ player, room, giverInfo }) => {
				var gameIndex = -1;
				var playerIndex = -1;
				const game = connections.find(
					(game, index) => {
						if (game.roomId === room) {
							gameIndex = index;
						}
						return game.roomId === room;
					},
				);

				//now we must find the player that gaveout drinks
				//find the player and update their cards
				const playerThatGaveOutDrinks = game.players.find(
					(player, index) => {
						//storing index to use later
						if (player.clientId === giverInfo.clientId) {
							playerIndex = index;
						}
						return player.clientId === giverInfo.clientId;
					},
				);

				playerThatGaveOutDrinks.drinksGiven += 2;
				//now we must find the player that gaveout drinks
				//find the player and update their cards
				const playerThatHadToDrink = game.players.find(
					(searchingPlayer, index) => {
						//storing index to use later
						if (searchingPlayer.clientId === player.clientId) {
							playerIndex = index;
						}
						return searchingPlayer.clientId === player.clientId;
					},
				);
				playerThatHadToDrink.drinksTaken += 2;

				//player sends drink to front end
				io.in(room).emit(
					"takeADrink",
					{ player: player.name, toastType: "playerGivingDrink" },
				);

				//this is checking for a end game state again we check once when they guess and then also after a drink is giving out
				if (
					connections[gameIndex].players[connections[gameIndex].players.length - 1].cards[3].Flipped === true
				) {
					//set a timer so the page doesnt automatically close
					setTimeout(
						() => {
							connections[gameIndex].status = "finished";
						},
						1000,
					);

					io.in(room).emit("gameState", { gameState: connections[gameIndex] });
				}
			},
		);

		//debug function to flip the first three cards for everyone
		socket.on(
			"flipCards",
			({ room }) => {
				var gameIndex = -1;
				var playerIndex = -1;
				const game = connections.find(
					(game, index) => {
						if (game.roomId === room) {
							gameIndex = index;
						}
						return game.roomId === room;
					},
				);

				for (var i = 0; i < connections[gameIndex].players.length; i++) {
					for (var c = 0; c < 3; c++) {
						connections[gameIndex].players[i].cards[c].Flipped = true;
					}
				}
				io.in(room).emit("gameState", { gameState: connections[gameIndex] });
			},
		);

		//the player guessed wrong and now they must drink
		socket.on(
			"guessIsWrong",
			({ room, playerName }) => {
				io.in(room).emit(
					"takeADrink",
					{ player: playerName, toastType: "playerTakingDrink" },
				);
			},
		);
	},
);

const doesGameExist = (roomId: string) => {
	return connections.find((game) => game.roomId === roomId);
};

const createGame = (roomId: string, playerName: string, socketId: string) => {
	connections.push({
		roomId: roomId,
		isSomeoneGivingDrinks: false,
		hideButtons: false,
		status: "lobby",
		players: [
			{
				name: playerName,
				cards: [],
				yourTurn: false,
				clientId: socketId,
				host: true,
				drinksGiven: 0,
				drinksTaken: 0,
			},
		],
	});
};
