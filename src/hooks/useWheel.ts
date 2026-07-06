import { useState, useCallback } from 'react';
import type { Archetype, AssignedResult, WheelPhase } from '../types';
import { shuffleItems } from '../utils/randomBag';
import { haptics } from '../native/haptics';

interface WheelState {
  totalPlayers: number;
  remainingArchetypes: Archetype[];
  assignedResults: AssignedResult[];
  phase: WheelPhase;
  lastWinner: Archetype | null;
  allowDuplicates: boolean;
}

export function useWheel() {
  const [state, setState] = useState<WheelState>({
    totalPlayers: 0,
    remainingArchetypes: [],
    assignedResults: [],
    phase: 'setup',
    lastWinner: null,
    allowDuplicates: false,
  });

  const startSession = useCallback((playerCount: number, selectedArchetypes: Archetype[], allowDuplicates: boolean) => {
    setState({
      totalPlayers: playerCount,
      remainingArchetypes: shuffleItems(selectedArchetypes),
      assignedResults: [],
      phase: 'spinning',
      lastWinner: null,
      allowDuplicates,
    });
  }, []);

  const resolveSpinResult = useCallback((winnerIndex: number) => {
    // The wheel has landed — celebratory success haptic on the reveal.
    haptics.land();
    setState((prev) => {
      if (prev.remainingArchetypes.length === 0) return prev;
      const winner = prev.remainingArchetypes[winnerIndex % prev.remainingArchetypes.length];
      // When duplicates are allowed, keep the same pool; otherwise remove the winner
      const newRemaining = prev.allowDuplicates
        ? prev.remainingArchetypes
        : prev.remainingArchetypes.filter((a) => a.id !== winner.id);
      const newResults: AssignedResult[] = [
        ...prev.assignedResults,
        { playerNumber: prev.assignedResults.length + 1, archetype: winner },
      ];
      // Always go to reveal — the last player sees the same card as everyone else
      return {
        ...prev,
        remainingArchetypes: newRemaining,
        assignedResults: newResults,
        lastWinner: winner,
        phase: 'reveal',
      };
    });
  }, []);

  const nextPlayer = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'reveal') return prev;
      return { ...prev, phase: 'spinning', lastWinner: null };
    });
  }, []);

  // Undo last spin — put the archetype back (if no duplicates) and re-spin for the same player
  const reroll = useCallback(() => {
    setState((prev) => {
      if (!prev.lastWinner) return prev;
      // When duplicates allowed, pool didn't change (winner was not removed)
      const restoredArchetypes = prev.allowDuplicates
        ? prev.remainingArchetypes
        : [...prev.remainingArchetypes, prev.lastWinner];
      const restoredResults = prev.assignedResults.slice(0, -1);
      return {
        ...prev,
        remainingArchetypes: restoredArchetypes,
        assignedResults: restoredResults,
        lastWinner: null,
        phase: 'spinning',
      };
    });
  }, []);

  // Show the results leaderboard (accessible from reveal or spinning)
  const showResults = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'done' }));
  }, []);

  // Go back from leaderboard to spinning/reveal
  const backFromResults = useCallback(() => {
    setState((prev) => {
      const allAssigned = prev.assignedResults.length >= prev.totalPlayers;
      return { ...prev, phase: allAssigned ? 'reveal' : 'spinning' };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      totalPlayers: 0,
      remainingArchetypes: [],
      assignedResults: [],
      phase: 'setup',
      lastWinner: null,
      allowDuplicates: false,
    });
  }, []);

  return {
    ...state,
    startSession,
    resolveSpinResult,
    nextPlayer,
    reroll,
    showResults,
    backFromResults,
    reset,
  };
}
