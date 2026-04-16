/**
 * @copyright 2026 hentertrabelsi
 * @contact Email: hentertrabelsi@gmail.com
 * @discord #susuxo
 * 
 * All rights reserved. This software is proprietary and confidential.
 * You may not use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software without explicit permission.
 */
import { CHARACTERS } from './constants/characters';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

declare global {
  interface Window {
    CrazyGames?: {
      SDK?: {
        init?: () => Promise<void>;
        data?: {
          getItem: (key: string) => string | null | Promise<string | null>;
          setItem: (key: string, value: string) => void | Promise<void>;
          removeItem: (key: string) => void | Promise<void>;
        }
      }
    }
  }
}

const isCrazyGamesDataAvailable = (): boolean => {
  if (typeof window === 'undefined' || !window.CrazyGames || !window.CrazyGames.SDK) {
    return false;
  }
  const sdk = window.CrazyGames.SDK as unknown as Record<string, string>;
  if (sdk.code === 'sdkNotInitialized' || sdk.code === 'sdkDisabled') {
    return false;
  }
  try {
    const origError = console.error;
    console.error = () => {};
    const hasData = !!(sdk as unknown as { data: unknown }).data;
    console.error = origError;
    return hasData;
  } catch {
    return false;
  }
};

let sdkInitPromise: Promise<void> | null = null;
const ensureCrazyGamesInit = async () => {
  if (isCrazyGamesDataAvailable()) {
    if (!sdkInitPromise) {
      if (typeof window.CrazyGames!.SDK!.init === 'function') {
        sdkInitPromise = window.CrazyGames!.SDK!.init();
      } else {
        sdkInitPromise = Promise.resolve();
      }
    }
    await sdkInitPromise;
  }
};

const crazyGamesStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      if (isCrazyGamesDataAvailable() && window.CrazyGames?.SDK?.data) {
        await ensureCrazyGamesInit();
        const value = await window.CrazyGames.SDK.data.getItem(name);
        if (value !== null && value !== undefined) {
          return value;
        }
      }
    } catch (e) {
      console.warn('CrazyGames Data SDK getItem failed', e);
    }
    return localStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      if (isCrazyGamesDataAvailable() && window.CrazyGames?.SDK?.data) {
        await ensureCrazyGamesInit();
        await window.CrazyGames.SDK.data.setItem(name, value);
        return;
      }
    } catch (e) {
      console.warn('CrazyGames Data SDK setItem failed', e);
    }
    localStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      if (isCrazyGamesDataAvailable() && window.CrazyGames?.SDK?.data) {
        await ensureCrazyGamesInit();
        await window.CrazyGames.SDK.data.removeItem(name);
        return;
      }
    } catch (e) {
      console.warn('CrazyGames Data SDK removeItem failed', e);
    }
    localStorage.removeItem(name);
  },
};



export interface PlayerState {
  id: string;
  name: string;
  position: [number, number, number];
  velocity: [number, number, number];
  rotation: [number, number, number, number];
  color: string;
  team: 'red' | 'blue';
  score: number;
  lastKickTime: number;
  lastJumpTime: number;
  character: string;
  goals: number;
  assists: number;
  kicks: number;
  worldCupCountry?: string;
}

export interface GameState {
  players: Record<string, PlayerState>;
  ball: {
    position: [number, number, number];
    velocity: [number, number, number];
    rotation: [number, number, number, number];
  };
  score: { red: number; blue: number };
  matchState: 'waiting' | 'playing' | 'goal' | 'gameover' | 'freeplay' | 'countdown';
  timer: number;
  message: string;
  isOvertime: boolean;
  isWorldCup: boolean;
  worldCupTeams?: { red: string; blue: string };
  lastScorer?: {
    name: string;
    team: 'red' | 'blue';
    country?: string;
  };
}

interface StoreState {
  gameState: GameState;
  myId: string | null;
  roomId: string | null;
  isPrivate: boolean;
  cameraAngle: number;
  inLobby: boolean;
  joinMode: 'queue' | 'create' | 'join' | 'training' | null;
  trainingDifficulty: 'easy' | 'medium' | 'hard' | 'pro' | null;
  roomCodeToJoin: string | null;
  isWorldCup: boolean;
  playerName: string;
  selectedCharacter: 'robot' | 'fox' | 'cristiano ronaldo' | 'kobe' | 'lamin yamal';
  selectedWorldCupCountry: string | null;
  selectedTeam: 'red' | 'blue';
  coins: number;
  exp: number;
  unlockedCharacters: string[];
  unlockCharacter: (character: string) => void;
  addCoins: (amount: number) => void;
  addExp: (amount: number) => void;
  settings: {
    server: 'europe' | 'usa';
    volume: number;
    keyBindings: {
      forward: string;
      backward: string;
      left: string;
      right: string;
      jump: string;
      kick: string;
    };
    forceMobileControls: boolean;
  };
  setGameState: (state: GameState) => void;
  setMyId: (id: string) => void;
  setRoomId: (id: string | null, isPrivate?: boolean) => void;
  setCameraAngle: (angle: number) => void;
  setInLobby: (inLobby: boolean) => void;
  setIsWorldCup: (isWorldCup: boolean) => void;
  setJoinMode: (mode: 'queue' | 'create' | 'join' | 'training' | null, code?: string, difficulty?: 'easy' | 'medium' | 'hard' | 'pro') => void;
  setPlayerName: (name: string) => void;
  setSelectedCharacter: (character: 'robot' | 'fox' | 'cristiano ronaldo' | 'kobe' | 'lamin yamal') => void;
  setSelectedWorldCupCountry: (country: string | null) => void;
  setSelectedTeam: (team: 'red' | 'blue') => void;
  setSettings: (settings: Partial<StoreState['settings']>) => void;
  updatePlayer: (id: string, player: PlayerState) => void;
  removePlayer: (id: string) => void;
}

export const useGameStore = create<StoreState>()(
  persist(
    (set) => ({
      gameState: {
        players: {},
        ball: { position: [0, 5, 0], velocity: [0, 0, 0], rotation: [0, 0, 0, 1] },
        score: { red: 0, blue: 0 },
        matchState: 'waiting',
        timer: 0,
        message: 'Waiting for players...',
        isOvertime: false,
        isWorldCup: false,
      },
      myId: null,
      roomId: null,
      isPrivate: false,
      cameraAngle: 0,
      inLobby: true,
      joinMode: null,
      trainingDifficulty: null,
      roomCodeToJoin: null,
      isWorldCup: false,
      playerName: 'Player' + Math.floor(Math.random() * 1000),
      selectedCharacter: 'robot',
      selectedWorldCupCountry: null,
      selectedTeam: 'blue',
      coins: 100,
      exp: 0,
      unlockedCharacters: ['robot'],
      unlockCharacter: (character) => set((state) => ({
        unlockedCharacters: [...state.unlockedCharacters, character]
      })),
      addCoins: (amount) => set((state) => ({
        coins: state.coins + amount
      })),
      addExp: (amount) => set((state) => ({
        exp: state.exp + amount
      })),
      settings: {
        server: 'europe',
        volume: 0.5,
        keyBindings: {
          forward: 'w',
          backward: 's',
          left: 'a',
          right: 'd',
          jump: ' ',
          kick: 'f',
        },
        forceMobileControls: false,
      },
      setGameState: (state) => set({ gameState: state }),
      setMyId: (id) => set({ myId: id }),
      setRoomId: (id, isPrivate = false) => set({ roomId: id, isPrivate }),
      setCameraAngle: (angle) => set({ cameraAngle: angle }),
      setInLobby: (inLobby) => set({ inLobby }),
      setIsWorldCup: (isWorldCup) => set({ isWorldCup }),
      setJoinMode: (mode, code, difficulty) => set({ 
        joinMode: mode, 
        roomCodeToJoin: code || null, 
        trainingDifficulty: difficulty || null 
      }),
      setPlayerName: (name) => set({ playerName: name }),
      setSelectedCharacter: (character) => set({ selectedCharacter: character }),
      setSelectedWorldCupCountry: (country) => set({ selectedWorldCupCountry: country }),
      setSelectedTeam: (team) => set({ selectedTeam: team }),
      setSettings: (newSettings) => set((state) => ({ 
        settings: { ...state.settings, ...newSettings } 
      })),
      updatePlayer: (id, player) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            players: { ...state.gameState.players, [id]: player },
          },
        })),
      removePlayer: (id) =>
        set((state) => {
          const newPlayers = { ...state.gameState.players };
          delete newPlayers[id];
          return { gameState: { ...state.gameState, players: newPlayers } };
        }),
    }),
    {
      name: 'soccer-rivals-storage',
      storage: createJSONStorage(() => crazyGamesStorage),
      partialize: (state) => ({
        playerName: state.playerName,
        selectedWorldCupCountry: state.selectedWorldCupCountry,
        coins: state.coins,
        exp: state.exp,
        settings: state.settings,
        unlockedCharacters: state.unlockedCharacters.filter(c => CHARACTERS[c]?.unlockType !== 'ads'),
        selectedCharacter: CHARACTERS[state.selectedCharacter]?.unlockType === 'ads' ? 'robot' : state.selectedCharacter,
      }),
    }
  )
);


/**
 * @copyright 2026 hentertrabelsi - All Rights Reserved
 */
