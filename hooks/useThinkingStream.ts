/**
 * useThinkingStream Hook
 *
 * Handles SSE (Server-Sent Events) streaming for real-time page generation
 * Matches the pattern used in dynamic_website
 *
 * Usage:
 * ```typescript
 * const { stream, isStreaming, error } = useThinkingStream();
 * await stream(message, (stage) => console.log(stage));
 * ```
 */

import { useCallback, useRef, useReducer } from 'react';

export interface StreamStage {
  stageId: string;
  status: 'active' | 'complete';
  stageName: string;
  progress: number;
}

export interface StreamPageEvent {
  page: any;
}

export interface StreamCompleteEvent {
  success: boolean;
  message: string;
  session: {
    sessionId: string;
    persona: any;
    messageCount: number;
  };
  signals: string[];
  generationMode: 'fresh' | 'returning' | 'data_connected';
  generatedPage?: {
    page: any;
    intent: string;
    intentConfidence: number;
  };
}

export interface StreamState {
  isStreaming: boolean;
  error: string | null;
  stages: StreamStage[];
  currentPage: any | null;
  response: StreamCompleteEvent | null;
}

type StreamAction =
  | { type: 'START' }
  | { type: 'STAGE'; payload: StreamStage }
  | { type: 'PAGE'; payload: StreamPageEvent }
  | { type: 'COMPLETE'; payload: StreamCompleteEvent }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' };

function streamReducer(state: StreamState, action: StreamAction): StreamState {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        isStreaming: true,
        error: null,
        stages: [],
        currentPage: null,
        response: null,
      };

    case 'STAGE':
      return {
        ...state,
        stages: [
          ...state.stages.filter((s) => s.stageId !== action.payload.stageId),
          action.payload,
        ],
      };

    case 'PAGE':
      return {
        ...state,
        currentPage: action.payload.page,
      };

    case 'COMPLETE':
      return {
        ...state,
        isStreaming: false,
        response: action.payload,
      };

    case 'ERROR':
      return {
        ...state,
        isStreaming: false,
        error: action.payload,
      };

    case 'RESET':
      return {
        isStreaming: false,
        error: null,
        stages: [],
        currentPage: null,
        response: null,
      };

    default:
      return state;
  }
}

export function useThinkingStream() {
  const [state, dispatch] = useReducer(streamReducer, {
    isStreaming: false,
    error: null,
    stages: [],
    currentPage: null,
    response: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const stream = useCallback(
    async (
      message: string,
      onStage?: (stage: StreamStage) => void,
      onPage?: (page: any) => void,
      onComplete?: (response: StreamCompleteEvent) => void
    ): Promise<StreamCompleteEvent | null> => {
      try {
        dispatch({ type: 'START' });

        abortControllerRef.current = new AbortController();

        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error || 'Failed to stream response';
          dispatch({ type: 'ERROR', payload: errorMessage });
          return null;
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          dispatch({ type: 'ERROR', payload: 'Failed to read stream' });
          return null;
        }

        let buffer = '';
        let completeResponse: StreamCompleteEvent | null = null;

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Parse SSE messages - split by double newlines (empty line separates events)
          const events = buffer.split('\n\n');

          // Keep the last incomplete event in buffer
          buffer = events[events.length - 1];

          // Process all complete events
          for (let i = 0; i < events.length - 1; i++) {
            const eventBlock = events[i].trim();
            if (!eventBlock) continue;

            const lines = eventBlock.split('\n');
            let eventType = '';
            let dataStr = '';

            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventType = line.substring(6).trim();
              } else if (line.startsWith('data:')) {
                dataStr = line.substring(5).trim();
              }
            }

            if (eventType && dataStr) {
              try {
                const data = JSON.parse(dataStr);
                console.log(`[SSE] Received ${eventType}:`, data);

                if (eventType === 'stage') {
                  const stage = data as StreamStage;
                  dispatch({ type: 'STAGE', payload: stage });
                  onStage?.(stage);
                } else if (eventType === 'page') {
                  const pageEvent = data as StreamPageEvent;
                  dispatch({ type: 'PAGE', payload: pageEvent });
                  onPage?.(pageEvent.page);
                } else if (eventType === 'complete') {
                  const complete = data as StreamCompleteEvent;
                  dispatch({ type: 'COMPLETE', payload: complete });
                  completeResponse = complete;
                  onComplete?.(complete);
                } else if (eventType === 'error') {
                  const error = data as { error: string };
                  dispatch({ type: 'ERROR', payload: error.error });
                }
              } catch (e) {
                console.error('Failed to parse SSE data:', dataStr, e);
              }
            }
          }
        }

        return completeResponse;
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            dispatch({ type: 'ERROR', payload: 'Stream cancelled' });
          } else {
            dispatch({ type: 'ERROR', payload: error.message });
          }
        } else {
          dispatch({ type: 'ERROR', payload: 'Unknown error during stream' });
        }
        return null;
      }
    },
    []
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      dispatch({ type: 'RESET' });
    }
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    stream,
    cancel,
    reset,
  };
}
