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
  timelineEvents: Array<{id: string, time: number, event: string, details: string, type: string}>; // 타임라인 이벤트들
  
  // 액션들
  setExperiment: (experiment: ExperimentData) => void;
  setTimelineEvents: (events: Array<{id: string, time: number, event: string, details: string, type: string}>) => void;
  play: () => void;
  pause: () => void;
  setCurrentTime: (time: number) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
  setSelectedEvent: (eventId: string | null) => void; // 선택된 이벤트 설정
  updateSelectedEventByTime: (time: number) => void; // 시간 기반으로 이벤트 자동 선택
}

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  // 초기 상태
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  speed: 1,
  currentExperiment: null,
  selectedEventId: null,
  timelineEvents: [],
  
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

  setTimelineEvents: (events) => {
    set({ timelineEvents: events });
  },
  
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  
  setCurrentTime: (time) => {
    const newTime = Math.max(0, Math.min(time, get().duration));
    set({ currentTime: newTime });
    // 시간 변경 시 자동으로 해당 시간에 맞는 이벤트 선택
    get().updateSelectedEventByTime(newTime);
  },

  setSpeed: (speed) => set({ speed: Math.max(0.1, Math.min(speed, 5)) }),
  
  reset: () => set({ currentTime: 0, isPlaying: false, selectedEventId: null }),
  
  setSelectedEvent: (eventId) => set({ selectedEventId: eventId }),
  
  updateSelectedEventByTime: (time) => {
    const { timelineEvents } = get();
    if (timelineEvents.length === 0) return;
    
    // 현재 시간에 가장 가까운 이벤트 찾기
    let closestEvent = timelineEvents[0];
    let minDistance = Math.abs(timelineEvents[0].time - time);
    
    for (const event of timelineEvents) {
      const distance = Math.abs(event.time - time);
      if (distance < minDistance) {
        minDistance = distance;
        closestEvent = event;
      }
    }
    
    // 가장 가까운 이벤트가 현재 선택된 이벤트와 다르면 업데이트
    if (closestEvent.id !== get().selectedEventId) {
      set({ selectedEventId: closestEvent.id });
    }
  },
}));
