import { create } from 'zustand';
import { ExperimentData } from '../types';

interface PlaybackState {
  // 재생 상태
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  currentExperiment: ExperimentData | null;
  selectedEventId: string | null; // 선택된 타임라인 이벤트 ID
  
  // 액션들
  setExperiment: (experiment: ExperimentData) => void;
  play: () => void;
  pause: () => void;
  setCurrentTime: (time: number) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
  setSelectedEvent: (eventId: string | null) => void; // 선택된 이벤트 설정
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  // 초기 상태
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  speed: 1,
  currentExperiment: null,
  selectedEventId: null,
  
  // 액션들
  setExperiment: (experiment) => {
    set({
      currentExperiment: experiment,
      duration: experiment.trajectory.length > 0 
        ? experiment.trajectory[experiment.trajectory.length - 1].position.timestamp - experiment.trajectory[0].position.timestamp
        : 0,
      currentTime: 0,
      isPlaying: false,
      selectedEventId: null
    });
  },
  
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  
  setCurrentTime: (time) => set({ 
    currentTime: Math.max(0, Math.min(time, get().duration)),
    selectedEventId: null // 시간 변경 시 선택 상태 초기화
  }),
  setSpeed: (speed) => set({ speed: Math.max(0.1, Math.min(speed, 5)) }),
  
  reset: () => set({ currentTime: 0, isPlaying: false, selectedEventId: null }),
  setSelectedEvent: (eventId) => set({ selectedEventId: eventId }),
}));
