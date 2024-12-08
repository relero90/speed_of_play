'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Deck = {
    success: boolean;
    deck_id: string;
    remaining: number;
    shuffled: boolean;
}

type CardPull = {
    code: string;
    image: string;
    images: {
        svg: string;
        png: string;
    };
    suit: string;
    value: string;
}

type DeckContextTypes = {
    deck: Deck | null; setDeck: (deck: Deck) => void;
    cardPulls: CardPull[] | null; setCardPulls: (cards: CardPull[] | null) => void;
}

const DeckContext = createContext<DeckContextTypes>({
    deck: null, setDeck: () => {},
    cardPulls: null, setCardPulls: () => {}
});

export const DeckContextProvider = ({ children }: { children: ReactNode }) => {
    const [deck, setDeck] = useState<Deck | null>(null);
    const [cardPulls, setCardPulls] = useState<CardPull[] | null>(null);
    const [cardsPulled, setCardsPulled] = useState<boolean>(false);

    // https://deckofcardsapi.com/
    const fetchDeck = async () => {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1&jokers_enabled=true');
        const data = await response.json();
        if (data) {
            setDeck(data);
        }
    }

    const pullCards = async (deckId: string, cardCount: number) => {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${cardCount}`);
        const data = await response.json();
        if (data && deck) {
            console.log('cards pulled: ', data);
            setCardPulls(data.cards);
            const newDeck: Deck = {...deck};
            newDeck.remaining = data.remaining;
            setDeck(newDeck);
            setCardsPulled(true);
        }
    }

    useEffect(() => {
        if (!deck) fetchDeck()
    }, [])
    
    useEffect(() => {
        if (deck && !cardsPulled) {
            console.log('deck', deck);
            pullCards(deck.deck_id, 3);
        }
    }, [deck])

    const deckValues = {
        deck, setDeck,
        cardPulls, setCardPulls
    };

    return (
        <DeckContext.Provider value={deckValues}>
            {children}
        </DeckContext.Provider>
    );
};

export const useDeckContext = () => {
    return useContext(DeckContext);
};