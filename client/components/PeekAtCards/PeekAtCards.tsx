import styled from "styled-components";
// //import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Player } from "../../util/types";

interface props {
  listOfPlayers: Player[];
}
const users = [
  "user1",
  "user2",
  "user3",
  "user4",
  "user5",
  "user6",
  "user7",
  "user8",
  "user9",
  "user10",
  "user11",
  "user12",
];

const RoomModal = ({ listOfPlayers }: props) => {
  const [openDialog, setOpen] = useState(false);
  return (
    <Dialog.Root open={openDialog} onOpenChange={setOpen}>
      <DialogTrigger>
        <svg
          width="32"
          height="32"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          ></path>
        </svg>
      </DialogTrigger>
      <AnimatePresence>
        {openDialog && (
          <Dialog.Portal forceMount>
            <DialogOverlay asChild forceMount />

            <Dialog.Content asChild forceMount>
              <UserNames
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.4, ease: "linear" }}
              >
                {/* {users.map((user, index) => {
                  return (
                    <UserInfo>
                      <div>{user}</div>
                      <Cards>
                        <Card src="/cards/ClubsKing.svg" />
                        <Card src="/cards/ClubsKing.svg" />
                        <Card src="/cards/ClubsKing.svg" />
                        <Card src="/cards/ClubsKing.svg" />
                      </Cards>
                    </UserInfo>
                  );
                })} */}
                {listOfPlayers.map((user) => {
                  return (
                    <UserInfo key={user.clientId}>
                      <div>{user.name}</div>
                      <Cards>
                        {user.cards.map((card) => {
                          return (
                            <Card
                              key={`${card.Suit}${card.Value}`}
                              src={
                                card.Flipped
                                  ? `/cards/${card.Suit}${card.Value}.svg`
                                  : `/cards/BackOfCard.svg`
                              }
                            />
                          );
                        })}
                      </Cards>
                    </UserInfo>
                  );
                })}
              </UserNames>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default RoomModal;
const DialogOverlay = styled(Dialog.Overlay)`
  position: fixed;
  background-color: #5e885e60;
  inset: 0;
`;
const DialogRoot = styled(Dialog.Root)``;
const DialogTrigger = styled(Dialog.Trigger)`
  position: fixed;
  top: 0;
  right: 0;

  border: none;
  background: green;

  border-radius: 8px;
  width: 48px;
  height: 32px;
  color: white;
`;

const UserInfo = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  font-family: "Roboto", sans-serif;
`;

const Cards = styled.div`
  display: flex;
  flex-direction: row;
`;

const Card = styled.img`
  width: 80px;
  height: 100px;
`;

const UserNames = styled(motion.div)`
  display: flex;
  padding: 20px;
  flex-direction: column;
  /* align-items: center;
  justify-content: center; */
  align-items: flex-start;
  gap: 20px;
  height: 100vh;
  width: 400px;
  background-color: #2695a3;
  position: fixed;
  top: 0;
  right: 0;
  overflow-y: scroll;
`;
