import { AnimatePresence, motion } from "framer-motion";
//import * as React from "react";
import { Card } from "../util/types";
interface Props {
  card: Card;
}
const PlayingCard = ({ card }: Props) => {
  return (
    <AnimatePresence exitBeforeEnter>
      {card.Flipped ? (
        <motion.img
          key={card.Value + card.Suit}
          src={`/cards/${card.Suit}${card.Value}.svg`}
          alt="card"
          width={120}
          height={150}
          initial={{
            rotateY: 90,
            opacity: 0,

            // transition: { ease: "easeIn", duration: 0.7 },
          }}
          animate={{
            rotateY: 0,
            opacity: 1,
            transition: { ease: "easeIn", duration: 0.7 },
            // transition: { ease: "easeIn", duration: 0.7 },
          }}
        />
      ) : (
        <motion.img
          exit={{
            rotateY: 90,
            opacity: 0,
            transition: { ease: "easeIn", duration: 0.7 },
          }}
          initial={false}
          key={card.Value + card.Suit + "backofcard"}
          src="/cards/BackOfCard.svg"
          alt="card"
          width={120}
          height={150}
        />
      )}
    </AnimatePresence>
  );
};

export default PlayingCard;
