import { motion } from "framer-motion";
////import * as React from "react";
import styled from "styled-components";

const container = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: 100,
  },
};

interface ButtonProps {
  whichGuess: (guess: string) => void;
  turnNumber: number;
}

interface FunctionProps {
  whichGuess: (guess: string) => void;
}

const GuessButtons = ({ whichGuess, turnNumber }: ButtonProps) => {
  switch (turnNumber) {
    case 1:
      return <TurnOneButtons whichGuess={whichGuess} />;
    case 2:
      return <TurnTwoButtons whichGuess={whichGuess} />;
    case 3:
      return <TurnThreeButtons whichGuess={whichGuess} />;
    case 4:
      return <TurnFourButtons whichGuess={whichGuess} />;
    default:
      return <div> </div>;
  }
};

const TurnOneButtons = ({ whichGuess }: FunctionProps) => {
  return (
    <ButtonZone
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Button onClick={() => whichGuess("red")}> Red </Button>
      <Button onClick={() => whichGuess("black")}>Black</Button>
    </ButtonZone>
  );
};

const TurnTwoButtons = ({ whichGuess }: FunctionProps) => {
  return (
    <ButtonZone
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Button onClick={() => whichGuess("lower")}>Lower</Button>
      <Button onClick={() => whichGuess("same")}>Same</Button>
      <Button onClick={() => whichGuess("higher")}>Higher</Button>
    </ButtonZone>
  );
};
const TurnThreeButtons = ({ whichGuess }: FunctionProps) => {
  return (
    <ButtonZone
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Button onClick={() => whichGuess("outside")}>Outside</Button>
      <Button onClick={() => whichGuess("same")}>Same</Button>
      <Button onClick={() => whichGuess("inside")}>Inside</Button>
    </ButtonZone>
  );
};
const TurnFourButtons = ({ whichGuess }: FunctionProps) => {
  return (
    <ButtonZone
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Button onClick={() => whichGuess("diamond")}>Diamond</Button>
      <Button onClick={() => whichGuess("heart")}>Heart</Button>
      <Button onClick={() => whichGuess("spade")}>Spade</Button>
      <Button onClick={() => whichGuess("club")}>Club </Button>
    </ButtonZone>
  );
};

const ButtonZone = styled(motion.div)`
  position: absolute;
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  bottom: -70px;
`;
const Button = styled.button`
  width: 100px;
  height: 50px;
  background-color: #f0f0f0;
  border: 1px solid #cfcccc;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: bold;

  :hover {
    background-color: #e0e0e0;
    cursor: pointer;
  }
`;

export default GuessButtons;
