// //import * as React from "react";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { io, Socket } from "socket.io-client";
import Lobby from "../components/Lobby";
import { Player, Game } from "../util/types";

import HomeScreen from "../components/HomeScreen";
import { isGuessCorrect, WhichButtonsToShow } from "../util/functions";
import { AnimatePresence, motion } from "framer-motion";

import PostGame from "../components/PostGame/PostGame";
import GameStarted from "../components/GameStarted";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import DebugMenu from "../components/DebugMenu";
const App = () => {
  const [socketState, setSocketState] = useState<Socket | null>(null);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [gameState, setGameState] = useState<Game | null>(null);
  const [userState, setUserState] = useState<Player | null>(null);
  const [turnNumber, setTurnNumber] = useState(1);

  //whoevers turn it is we set their index number
  const [turnIndex, setTurnIndex] = useState(0);

  const ConnectToIo = () => {
    console.log("Connecting to socket.io");
    //connect to socket.io
    // const socket = io("https://irish-test.herokuapp.com/", {});
    const socket = io("https://protected-brook-41170.herokuapp.com/");
    // const socket = io("http://localhost:3000");

    console.log("socket", socket);
    // console.log("socket2", socket2);

    setSocketState(socket);

    socket.on("connect", () => {
      console.log("Connected to server");
    });
  };
  //event is a form
  const JoinRoom = (e: FormEvent) => {
    e.preventDefault();
    socketState?.emit("joinRoom", { name: username, room: room });
  };

  useEffect(() => {
    ConnectToIo();
  }, []);
  useEffect(() => {
    console.log("gameState====================", gameState);
  }, [gameState]);

  useEffect(() => {
    console.log("Socket State", socketState);
    if (socketState !== null) {
      //
      socketState.on("notification", (data) => {
        console.log("notifcation", data);
      });

      socketState.on("thisIsTest", (data) => {
        console.log("This was the test ", data.testState);
      });

      //owner has started the game
      socketState.on("startGame", (data) => {
        setTurnIndex(0);
        setGameState(data.gameState);
        const player = data.gameState.players.find(
          (player: Player) => player.clientId === socketState.id
        );
        setUserState(player as Player);
      });

      //update game state for players
      interface socketData {
        gameState: Game;
        connections?: Game[];
      }
      socketState.on("gameState", (data: socketData) => {
        console.log("A message receieved to update gamestate", data.gameState);

        //get the update state for the player
        const player = data.gameState.players.find(
          (player: Player) => player.clientId === socketState.id
        );
        setUserState(player as Player);

        //set local turn number might move this to server
        if (data.gameState.status === "started") {
          if (player) {
            setTurnNumber(WhichButtonsToShow(player.cards));
          }
        }

        //get index of player who's turn it is
        const whoseTurn = data.gameState.players.findIndex((player: Player) => {
          console.log(`looking for turn--- ${player.name} ${player.yourTurn}`);
          return player.yourTurn === true;
        });
        console.log("WHOOOSE TURN IT IS", whoseTurn);
        setTurnIndex(whoseTurn);

        //set game state
        setGameState(data.gameState);
      });

      //disconnect

      socketState.on("disconnect", () => {
        socketState?.emit("playerLeft", {});
      });

      //There is only one player left in the game after it started
      socketState.on("NotEnoughPlayers", () => {
        setGameState(null);
        setUserState(null);
      });

      socketState.onAny((event) => {
        console.log("THe event name is ", event);
      });

      socketState.on("takeADrink", (data) => {
        console.log("take a drink 🍻🍺🍻🍺🍻🍺🍻🍺🍻🍺🍻🍺", data.player);

        if(data.toastType==="playerGivingDrink"){
          toast(`🍻 Take a drink ${data.player}`, {
          position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          
        }
        else{
          toast(`⛔ ${data.player} guessed wrong! They must drink!`, {
          position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          
        }
      });
    }
  }, [socketState]);

  //handleChange function
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "room") {
      setRoom(value);
    }
  };

  const startGame = () => {
    socketState?.emit("startGame", { room: room });
  };

  //3/21/2022
  // this is where we left off we need to have state for if the user should give or take drinks
  // we might run into some edgecase in the logic in isGuessCorrect because the default for correct is false so i dont think we update it everywhere

  const updateDrinkOrGiveDrinks = (wasCorrect: boolean) => {
    if (wasCorrect) {
      //emit that we are in give state
      socketState?.emit("updateIsSomeoneGivingOutDrinks", {
        givingOutDrinks: true,
        room,
      });
    } else {
      //You go it wrong time to drink
      toast.error(`🍻 Take a drink`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      socketState?.emit("guessIsWrong",{
        room:room,
        playerName:userState?.name
      })

      setTimeout(() => {
        socketState?.emit("update_whose_turn_it_is", { room: room });
      }, 3000);
    }
  };

  //once a button is clicked lets check what turn number it is and then decide on how to deal with the guess

  const handleGuess = (guess: string) => {
    if (userState !== null) {
      socketState?.emit("updateHideButtons", {
        hideButtons: true,
        room,
      });
      const data = isGuessCorrect(guess, turnNumber, userState);
      if (data !== undefined) {
        updateDrinkOrGiveDrinks(data.userGuessCorrect);
        setUserState(data.tempUserState);
        socketState?.emit("guess", {
          userState: data.tempUserState,
          room: room,
        });
      }
    }
  };

  //home screen
  if (gameState === null) {
    return (
      <>
        <HomeScreen
          username={username}
          handleChange={handleChange}
          JoinRoom={JoinRoom}
          room={room}
        />
      </>
    );
  }

  if (gameState.status === "lobby" && userState) {
    return (
      <>
      {/* <DebugMenu gameState={gameState}/> */}
      <Lobby
        startGame={startGame}
        userState={userState}
        gameState={gameState}
      />
      </>
    );
  }

  return (
    <GameArena>
      {/* <DebugMenu gameState={gameState} socketState={socketState} room={room}/> */}
      <ToastButton
        onClick={() => {
          toast(`🍻 Take a drink `, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }}
      >
        Test Toast
      </ToastButton>
      <AnimatePresence exitBeforeEnter>
        {gameState.status === "started" && (
          <GameStarted
            room={room}
            gameState={gameState}
            turnIndex={turnIndex}
            userState={userState}
            turnNumber={turnNumber}
            socketState={socketState}
            handleGuess={handleGuess}
          />
        )}
      </AnimatePresence>
      {gameState.status === "finished" && (
        <PostGame players={gameState.players} />
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </GameArena>
  );
};

const GameArena = styled.div`
  position: relative;
`;

const ToastButton = styled.button`
  position: absolute;
  right: 0;
  top: 40px;
  z-index: 40;
`;

export default App;
