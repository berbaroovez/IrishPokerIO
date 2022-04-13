//import * as React from "react";
import { Socket } from "socket.io-client";
import styled from "styled-components";
import { Player } from "../../util/types";
import { motion, AnimatePresence } from "framer-motion";
interface Props {
  socketState: Socket;
  playerList: Player[];
  room: string;
  giverInfo: Player
}

const GiveDrinkModal = ({ socketState, playerList, room, giverInfo }: Props) => {
  const giveOutDrink = (player: Player) => {
    socketState.emit("giveOutDrink", { player, room, giverInfo });
    setTimeout(() => {
      socketState?.emit("update_whose_turn_it_is", { room: room });
      //emit that we are no longer giving out drinks
      socketState?.emit("updateIsSomeoneGivingOutDrinks", {
        givingOutDrinks: false,
        room,
      });
    }, 4000);
  };

  return (
    <DrinkZone
      initial={{
        scale: 0.8,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{ duration: 0.4, ease: "linear" }}
    >
      Click A player to make them drink!
      {playerList.map((player, index) => {
        return (
          <PlayerName
            onClick={() => {
              giveOutDrink(player);
            }}
          >
            {player.name}
          </PlayerName>
        );
      })}
    </DrinkZone>
  );
};

const DrinkZone = styled(motion.div)`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #a02121;
  color: white;
  padding: 10px;
  border-radius: 10px;
`;

const PlayerName = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  &:hover {
    background-color: #a04141;
    cursor: pointer;
  }
`;
export default GiveDrinkModal;
