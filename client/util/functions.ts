import { Card, Player } from "./types";
const WhichButtonsToShow = (cards: Card[]) => {
  if (cards[0].Flipped === false) {
    return 1;
  } else if (cards[1].Flipped === false) {
    return 2;
  } else if (cards[2].Flipped === false) {
    return 3;
  } else return 4;
};
const isGuessCorrect = (
  guess: string,
  turnNumber: number,
  userState: Player
) => {
  if (userState !== null) {
    const tempUserState = { ...userState };
    var userGuessCorrect = false;
    //if they guessed red and the card is red then they are correct

    if (turnNumber === 1) {
      if (
        guess === "red" &&
        (tempUserState.cards[0].Suit === "Diamonds" ||
          tempUserState.cards[0].Suit === "Hearts")
      ) {
        tempUserState.cards[0].Correct = true;
        tempUserState.cards[0].Flipped = true;
        userGuessCorrect = true;
      } else if (
        guess === "black" &&
        (tempUserState.cards[0].Suit === "Spades" ||
          tempUserState.cards[0].Suit === "Clubs")
      ) {
        tempUserState.cards[0].Correct = true;
        tempUserState.cards[0].Flipped = true;
        userGuessCorrect = true;
      } else {
        tempUserState.cards[0].Correct = false;
        tempUserState.cards[0].Flipped = true;
        userGuessCorrect = false;
      }
    } // end of turn 1
    else if (turnNumber === 2) {
      if (guess === "lower") {
        if (
          tempUserState.cards[0].NumericalValue >
          tempUserState.cards[1].NumericalValue
        ) {
          tempUserState.cards[1].Correct = true;
          tempUserState.cards[1].Flipped = true;
          userGuessCorrect = true;
        } else {
          tempUserState.cards[1].Correct = false;
          tempUserState.cards[1].Flipped = true;
          userGuessCorrect = false;
        }
      }
      if (guess === "higher") {
        if (
          tempUserState.cards[0].NumericalValue <
          tempUserState.cards[1].NumericalValue
        ) {
          tempUserState.cards[1].Correct = true;
          tempUserState.cards[1].Flipped = true;
          userGuessCorrect = true;
        } else {
          tempUserState.cards[1].Correct = false;
          tempUserState.cards[1].Flipped = true;
          userGuessCorrect = false;
        }
      }
      if (guess === "same") {
        if (
          tempUserState.cards[0].NumericalValue ===
          tempUserState.cards[1].NumericalValue
        ) {
          tempUserState.cards[1].Correct = true;
          tempUserState.cards[1].Flipped = true;
          userGuessCorrect = true;
        } else {
          tempUserState.cards[1].Correct = false;
          tempUserState.cards[1].Flipped = true;
          userGuessCorrect = false;
        }
      }
    }
    //end of turn 2
    else if (turnNumber === 3) {
      var lower = 0;
      var higher = 0;

      if (
        tempUserState.cards[0].NumericalValue <
        tempUserState.cards[1].NumericalValue
      ) {
        lower = tempUserState.cards[0].NumericalValue;
        higher = tempUserState.cards[1].NumericalValue;
      } else {
        lower = tempUserState.cards[1].NumericalValue;
        higher = tempUserState.cards[0].NumericalValue;
      }

      console.log("lower: " + lower);
      console.log("higher: " + higher);

      if (guess === "outside") {
        console.log("outside");
        //if the cards numerical value is not between card 0 and card 1 then they are correct
        if (
          tempUserState.cards[2].NumericalValue < lower ||
          tempUserState.cards[2].NumericalValue > higher
        ) {
          console.log(
            `${tempUserState.cards[2].NumericalValue} < ${lower} && ${tempUserState.cards[2].NumericalValue} > ${higher}`
          );
          tempUserState.cards[2].Correct = true;
          tempUserState.cards[2].Flipped = true;
          userGuessCorrect = true;
        } else {
          tempUserState.cards[2].Correct = false;
          tempUserState.cards[2].Flipped = true;
          userGuessCorrect = false;
        }
      } else if (guess === "inside") {
        console.log("INSIDE!");
        if (
          tempUserState.cards[2].NumericalValue > lower &&
          tempUserState.cards[2].NumericalValue < higher
        ) {
          console.log(
            `${tempUserState.cards[2].NumericalValue} > ${lower} && ${tempUserState.cards[2].NumericalValue} < ${higher}`
          );
          tempUserState.cards[2].Correct = true;
          tempUserState.cards[2].Flipped = true;
          userGuessCorrect = true;
        } else {
          tempUserState.cards[2].Correct = false;
          tempUserState.cards[2].Flipped = true;
          userGuessCorrect = false;
        }
      } else if (guess === "same") {
        console.log("SAME!");
        if (
          tempUserState.cards[2].NumericalValue === lower ||
          tempUserState.cards[2].NumericalValue === higher
        ) {
          tempUserState.cards[2].Correct = true;
          tempUserState.cards[2].Flipped = true;
          userGuessCorrect = true;
        } else {
          tempUserState.cards[2].Correct = false;
          tempUserState.cards[2].Flipped = true;
          userGuessCorrect = false;
        }
      }
    } //end of turn 3
    else if (turnNumber === 4) {
      if (guess === "diamond") {
        if (tempUserState.cards[3].Suit === "Diamonds") {
          tempUserState.cards[3].Correct = true;
          tempUserState.cards[3].Flipped = true;
          userGuessCorrect = true;
        } else {
          tempUserState.cards[3].Correct = false;
          tempUserState.cards[3].Flipped = true;
          userGuessCorrect = false;
        }
      } else if (guess === "heart") {
        if (tempUserState.cards[3].Suit === "Hearts") {
          tempUserState.cards[3].Correct = true;
          tempUserState.cards[3].Flipped = true;
          userGuessCorrect = true;
        } else {
          tempUserState.cards[3].Correct = false;
          tempUserState.cards[3].Flipped = true;
          userGuessCorrect = false;
        }
      } else if (guess === "spade") {
        if (tempUserState.cards[3].Suit === "Spades") {
          tempUserState.cards[3].Correct = true;
          tempUserState.cards[3].Flipped = true;
          userGuessCorrect = true;
        } else {
          tempUserState.cards[3].Correct = false;
          tempUserState.cards[3].Flipped = true;
          userGuessCorrect = false;
        }
      } else if (guess === "club") {
        if (tempUserState.cards[3].Suit === "Clubs") {
          tempUserState.cards[3].Correct = true;
          tempUserState.cards[3].Flipped = true;
          userGuessCorrect = true;
        } else {
          tempUserState.cards[3].Correct = false;
          tempUserState.cards[3].Flipped = true;
          userGuessCorrect = false;
        }
      }
    }

    return {
      userGuessCorrect: userGuessCorrect,
      tempUserState: tempUserState,
    };
    // socketState?.emit("guess", { userState: tempUserState, room: room });
  }
  return {
    userGuessCorrect: false,
    tempUserState: userState,
  };
};
export { WhichButtonsToShow, isGuessCorrect };
