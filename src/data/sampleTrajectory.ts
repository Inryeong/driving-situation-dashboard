import type { ExperimentData, TrajectoryPoint } from '../types';

// 현실적인 차량 주행 경로를 생성하는 함수
export const createSampleTrajectory = (): ExperimentData => {
  const trajectory: TrajectoryPoint[] = [];
  const totalTime = 60000; // 60초
  const interval = 100; // 100ms 간격
  const points = totalTime / interval;

  // 경로 세그먼트 정의 (x, z, 속도, 방향)
  const segments = [
    // 0-10초: 직진 가속
    { start: 0, end: 10, x: 0, z: 0, speed: 0, heading: 0, type: 'straight' },
    // 10-15초: 우회전
    { start: 10, end: 15, x: 0, z: 0, speed: 0, heading: 0, type: 'turn_right' },
    // 15-25초: 직진
    { start: 15, end: 25, x: 0, z: 0, speed: 0, heading: 0, type: 'straight' },
    // 25-30초: 좌회전
    { start: 25, end: 30, x: 0, z: 0, speed: 0, heading: 0, type: 'turn_left' },
    // 30-40초: 직진
    { start: 30, end: 40, x: 0, z: 0, speed: 0, heading: 0, type: 'straight' },
    // 40-45초: 정지
    { start: 40, end: 45, x: 0, z: 0, speed: 0, heading: 0, type: 'stop' },
    // 45-55초: 직진
    { start: 45, end: 55, x: 0, z: 0, speed: 0, heading: 0, type: 'straight' },
    // 55-60초: 우회전
    { start: 55, end: 60, x: 0, z: 0, speed: 0, heading: 0, type: 'turn_right' }
  ];

  let currentX = 0;
  let currentZ = 0;
  let currentHeading = 0;
  let currentSpeed = 0;

  for (let i = 0; i <= points; i++) {
    const time = i * interval / 1000; // 초 단위
    const timestamp = i * interval;
    
    // 현재 시간에 해당하는 세그먼트 찾기
    const currentSegment = segments.find(seg => time >= seg.start && time < seg.end);
    
    if (currentSegment) {
      switch (currentSegment.type) {
        case 'straight':
          // 직진 구간: 일정한 속도로 직진
          currentSpeed = Math.min(currentSpeed + 0.5, 15); // 점진적 가속
          currentX += Math.cos(currentHeading) * currentSpeed * 0.1;
          currentZ += Math.sin(currentHeading) * currentSpeed * 0.1;
          break;
          
        case 'turn_right':
          // 우회전: 속도 감소하면서 우회전
          currentSpeed = Math.max(currentSpeed - 0.8, 8);
          currentHeading += 0.05; // 우회전
          currentX += Math.cos(currentHeading) * currentSpeed * 0.1;
          currentZ += Math.sin(currentHeading) * currentSpeed * 0.1;
          break;
          
        case 'turn_left':
          // 좌회전: 속도 감소하면서 좌회전
          currentSpeed = Math.max(currentSpeed - 0.8, 8);
          currentHeading -= 0.05; // 좌회전
          currentX += Math.cos(currentHeading) * currentSpeed * 0.1;
          currentZ += Math.sin(currentHeading) * currentSpeed * 0.1;
          break;
          
        case 'stop':
          // 정지 구간: 점진적 감속
          currentSpeed = Math.max(currentSpeed - 1.5, 0);
          currentX += Math.cos(currentHeading) * currentSpeed * 0.1;
          currentZ += Math.sin(currentHeading) * currentSpeed * 0.1;
          break;
      }
    }

    // 약간의 랜덤성 추가 (도로의 미세한 굴곡)
    const randomOffset = (Math.random() - 0.5) * 0.1;
    currentX += randomOffset;
    currentZ += randomOffset;

    trajectory.push({
      position: {
        x: currentX,
        y: 0, // 지면 높이
        z: currentZ,
        timestamp
      },
      speed: currentSpeed,
      heading: currentHeading
    });
  }

  return {
    id: 'realistic-driving-test-1',
    name: '현실적 주행 경로 테스트',
    trajectory,
    startTime: trajectory[0].position.timestamp,
    endTime: trajectory[trajectory.length - 1].position.timestamp
  };
};

export const sampleExperiment = createSampleTrajectory();
