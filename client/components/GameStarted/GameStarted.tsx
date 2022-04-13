import { AnimatePresence, motion } from "framer-motion";
// //import * as React from "react";
import styled from "styled-components";
import { Game, Player } from "../../util/types";
import GuessButtons from "../ButtonGroups";
import GiveDrinkModal from "../GiveDrinkModal";
import RoomModal from "../PeekAtCards/PeekAtCards";
import PlayingCard from "../PlayingCard";
import { Socket } from "socket.io-client";
interface props {
  gameState: Game;
  turnIndex: number;
  userState: Player | null;
  turnNumber: number;

  socketState: Socket | null;
  room: string;
  handleGuess: (guess: string) => void;
}
const GameStarted = ({
  gameState,
  turnIndex,
  userState,
  turnNumber,

  socketState,
  room,
  handleGuess,
}: props) => {
  return (
    <GameZone
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
      }}
      transition={{
        duration: 0.5,
        ease: "easeIn",
      }}
    >
      <RoomModal listOfPlayers={gameState.players} />
      <PlayerInfoZone>
        <AnimatePresence initial={false} exitBeforeEnter>
          <PlayerInfo
            className="players"
            //this works for animate presence because we are changing the key every time its a different players turn
            key={turnIndex}
            initial={{ opacity: 0, x: 1000 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -1000 }}
          >
            <PlayerName>{gameState.players[turnIndex].name}</PlayerName>
            <CardZone>
              {gameState.players[turnIndex].cards.map((card) => {
                return <PlayingCard key={card.Value + card.Suit} card={card} />;
              })}
            </CardZone>
          </PlayerInfo>
        </AnimatePresence>
        <AnimatePresence>
          
          {userState?.yourTurn && gameState.isSomeoneGivingDrinks === false && gameState.hideButtons===false &&(
            <GuessButtons turnNumber={turnNumber} whichGuess={handleGuess} />
          )}
        </AnimatePresence>
      </PlayerInfoZone>
      {userState?.yourTurn && gameState.isSomeoneGivingDrinks && (
        <GiveDrinkModal
          //playerlist is all player expect the one that matches userState.id
          giverInfo={userState}
          playerList={gameState.players.filter(
            (player) => player.clientId !== userState.clientId
          )}
          socketState={socketState!}
          room={room}
        />
      )}
    </GameZone>
  );
};

const GameZone = styled(motion.div)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
  position: relative;
`;
const PlayerInfoZone = styled.div`
  position: relative;

  width: 550px;
`;

const CardZone = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const PlayerName = styled.h4`
  font-size: 1.5rem;
  font-weight: bold;
  font-family: "Roboto", sans-serif;
  background: #f5f5f5;
  text-align: center;
`;
const PlayerInfo = styled(motion.div)``;
export default GameStarted;
