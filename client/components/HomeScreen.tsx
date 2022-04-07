import styled from "styled-components";
//import * as React from "react";
interface HomeScreenProps {
  username: string;
  room: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  JoinRoom: (event: React.FormEvent<HTMLFormElement>) => void;
}

const HomeScreen = ({
  username,
  room,
  handleChange,
  JoinRoom,
}: HomeScreenProps) => {
  return (
    <HomeScreenZone>
      <JoinRoomForm onSubmit={JoinRoom}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          value={username}
          onChange={handleChange}
          name="username"
        />
        <label htmlFor="room">Room Code </label>
        <input type="text" value={room} onChange={handleChange} name="room" />
        <button type="submit">Join Room</button>
      </JoinRoomForm>
    </HomeScreenZone>
  );
};

export default HomeScreen;

const HomeScreenZone = styled.div`
  width: 100%;
  height: 100vh;
  background: #e7e7e7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const JoinRoomForm = styled.form`
  display: flex;
  flex-direction: column;
`;
