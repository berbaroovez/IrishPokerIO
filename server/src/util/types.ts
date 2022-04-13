interface Card {
	Value: string,
	Suit: string,
	Flipped: boolean,
	Correct: boolean,
	NumericalValue: number,
}
interface Player {
	name: string,
	clientId: string,
	cards: Card[],
	yourTurn: boolean,
	host: boolean,
	drinksTaken: number,
	drinksGiven: number,
}
interface Game {
	roomId: string,
	status: "lobby" | "started" | "finished",
	players: Player[],
	isSomeoneGivingDrinks: boolean,
	hideButtons: boolean,
}

export type { Card, Player, Game };
