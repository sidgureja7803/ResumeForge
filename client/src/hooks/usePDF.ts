/**
 * React Hook for PDF Generation
 */

import { useState, useCallback } from 'react';
import { pdfGenerationAPI } from '../services/api';
import type { PDFGenerationRequest, PDFGenerationResponse } from '../services/api';

interface UsePDFState {
  loading: boolean;
  data: PDFGenerationResponse | null;
  error: string | null;
}

interface UsePDFReturn extends UsePDFState {
  generatePDF: (request: PDFGenerationRequest) => Promise<string | null>;
  generateAndDownload: (html: string, fileName?: string) => Promise<string | null>;
  generateAndOpen: (html: string, fileName?: string) => Promise<string | null>;
  reset: () => void;
}

export const usePDF = (): UsePDFReturn => {
  const [state, setState] = useState<UsePDFState>({
    loading: false,
    data: null,
    error: null,
  });

  const generatePDF = useCallback(async (request: PDFGenerationRequest): Promise<string | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await pdfGenerationAPI.generatePDF(request);
      setState({
        loading: false,
        data: response,
        error: null,
      });
      return response.url;
    } catch (error) {
      setState({
        loading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return null;
    }
  }, []);

  const generateAndDownload = useCallback(async (
    html: string, 
    fileName: string = 'resume'
  ): Promise<string | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const url = await pdfGenerationAPI.generateAndDownload(html, fileName);
      setState(prev => ({ ...prev, loading: false }));
      return url;
    } catch (error) {
      setState({
        loading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return null;
    }
  }, []);

  const generateAndOpen = useCallback(async (
    html: string, 
    fileName: string = 'resume'
  ): Promise<string | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const url = await pdfGenerationAPI.generateAndOpen(html, fileName);
      setState(prev => ({ ...prev, loading: false }));
      return url;
    } catch (error) {
      setState({
        loading: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return null;
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
    generatePDF,
    generateAndDownload,
    generateAndOpen,
    reset,
  };
}; 