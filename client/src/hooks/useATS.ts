/**
 * React Hook for ATS Scoring
 */

import { useState, useCallback } from 'react';
import { atsScoreAPI } from '../services/api';
import type { ATSScoreRequest, ATSScoreResponse } from '../services/api';

interface UseATSState {
  loading: boolean;
  data: ATSScoreResponse | null;
  error: string | null;
}

interface UseATSReturn extends UseATSState {
  calculateScore: (request: ATSScoreRequest) => Promise<void>;
  reset: () => void;
}

export const useATS = (): UseATSReturn => {
  const [state, setState] = useState<UseATSState>({
    loading: false,
    data: null,
    error: null,
  });

  const calculateScore = useCallback(async (request: ATSScoreRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await atsScoreAPI.calculateScore(request);
      setState({
        loading: false,
        data: response,
        error: null,
      });
    } catch (error) {
      setState({
        loading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      loading: false,
      data: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    calculateScore,
    reset,
  };
}; 