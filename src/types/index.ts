// 자율주행 차량의 위치 정보
export interface VehiclePosition {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

// 궤적 데이터 (차량이 이동한 경로)
export interface TrajectoryPoint {
  position: VehiclePosition;
  speed: number;
  heading: number; // 방향 (라디안)
}

// 재생 상태
export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
}

// 전체 실험 데이터
export interface ExperimentData {
  id: string;
  name: string;
  trajectory: TrajectoryPoint[];
  startTime: number;
  endTime: number;
}

