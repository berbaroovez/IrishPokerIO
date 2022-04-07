import { motion } from "framer-motion";
//import * as React from "react";
import styled from "styled-components";
import { Player } from "../../util/types";
import PlayingCard from "../PlayingCard";
interface props {
  players: Player[];
}
const PostGame = ({ players }: props) => {
  return (
    <PostGameZone>
      {players.map((player) => {
        return (
          <div key={player.clientId}>
            {player.name}
            <CardZone>
              {player.cards.map((card) => {
                return <PlayingCard key={card.Value + card.Suit} card={card} />;
              })}
            </CardZone>
            <StatZone>
              <div>Drinks taken: {player.drinksTaken}</div>
              <div>Drinks Given: {player.drinksGiven}</div>
            </StatZone>
          </div>
        );
      })}
    </PostGameZone>
  );
};

export default PostGame;

const PostGameZone = styled(motion.div)`
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

const CardZone = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const StatZone = styled.div`
  display: flex;
  justify-content: space-around;
`;
