import { Game, Player } from "../util/types";
//import * as React from "react";
import styled from "styled-components";
interface LobbyProps {
  startGame: () => void;
  gameState: Game;
  userState: Player;
}

//THis is the waiting room screen
const Lobby = ({ startGame, gameState, userState }: LobbyProps) => {
  return (
    <LobbyZone>
      <div>
        <h1>{gameState.roomId} Waiting Room</h1>

        {
          gameState.players.length > 1 ? userState?.host && <button onClick={startGame}>Start Game</button> :"Waiting for more players to join"
        }
      

        <PlayerZone>
          {gameState.players.map((player) => {
            return (
              <PlayerInfo key={player.clientId}>
                {player.name}
                {player.host ? <HostDot /> : null}
              </PlayerInfo>
            );
          })}
        </PlayerZone>
      </div>
    </LobbyZone>
  );
};

const LobbyZone = styled.div`
  width: 100%;
  height: 100vh;
  background: #e7e7e7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PlayerZone = styled.div`
  font-family: "Roboto", sans-serif;
  padding: 8px;
  background: #48456b;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PlayerInfo = styled.div`
  background: #6d67ab;
  border-radius: 8px;
  padding: 5px;
  font-size: 20px;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HostDot = styled.span`
  align-self: center;
  display: inline-block;
  background: red;
  border-radius: 50%;
  height: 10px;
  width: 10px;
  margin-left: 5px;
`;
export default Lobby;
