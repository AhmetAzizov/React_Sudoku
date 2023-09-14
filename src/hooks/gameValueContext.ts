import { createContext, useContext } from 'react'

export const GameValueContext = createContext<GameValues | undefined>(undefined);

export function useGameValueContext() {
    const value = useContext(GameValueContext);

    if (value === undefined) throw new Error('useGameValueContext must be used with GameValueContext!')
    
    return value;
}

interface GameValues {
    format: number,
    setFormat: React.Dispatch<React.SetStateAction<number>>
  }