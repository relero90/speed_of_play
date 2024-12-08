'use client'
import { useDeckContext } from "@/contexts/DeckContext";
import { Image } from "antd";
import EmptyCardView from "./components/EmptyCardView";

export default function Home() {
  const { cardPulls } = useDeckContext();
  
  return (
    <div className="flex justify-between m-4">
      {cardPulls ? 
        cardPulls.map((card) => <Image key={card.code} src={card.image} width={110} />) : 
        <EmptyCardView />
      }
    </div>
  );
}
