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
    // 30-32초: 정지 신호에서 정지
    { start: 30, end: 32, x: 0, z: 0, speed: 0, heading: 0, type: 'stop' },
    // 32-40초: 직진
    { start: 32, end: 40, x: 0, z: 0, speed: 0, heading: 0, type: 'straight' },
    // 40-45초: 정지
    { start: 40, end: 45, x: 0, z: 0, speed: 0, heading: 0, type: 'stop' },
    // 45-50초: 직진
    { start: 45, end: 50, x: 0, z: 0, speed: 0, heading: 0, type: 'straight' },
    // 50-55초: 속도 감소 구간
    { start: 50, end: 55, x: 0, z: 0, speed: 0, heading: 0, type: 'speed_reduction' },
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
          
          // 0-11초 구간은 이동 거리를 더 줄임
          let distanceMultiplier = 0.05; // 기본 배율
          if (time >= 0 && time < 11) {
            distanceMultiplier = 0.02; // 0-11초 구간은 더 짧은 거리 (0.05 → 0.02)
          }
          
          currentX += Math.cos(currentHeading) * currentSpeed * distanceMultiplier;
          currentZ += Math.sin(currentHeading) * currentSpeed * distanceMultiplier;
          break;
          
        case 'turn_right':
          // 우회전: 속도 감소하면서 우회전, 회전 후 직진 방향으로 조정
          currentSpeed = Math.max(currentSpeed - 0.8, 8);
          
          // 회전 구간의 진행률 계산 (0~1)
          const turnProgress = (time - currentSegment.start) / (currentSegment.end - currentSegment.start);
          
          if (turnProgress <= 0.5) {
            // 회전의 전반부: 우회전
            currentHeading += 0.08; // 우회전
          } else {
            // 회전의 후반부: 핸들을 중앙으로 돌려서 직진 방향으로 조정
            const targetHeading = Math.PI / 2; // 90도 (오른쪽으로 직진)
            // 부드러운 전환을 위해 lerp 사용
            const lerpFactor = (turnProgress - 0.5) * 2; // 0~1
            currentHeading = currentHeading + (targetHeading - currentHeading) * lerpFactor;
          }
          
          currentX += Math.cos(currentHeading) * currentSpeed * 0.05; // 속도 감소: 0.1 → 0.05
          currentZ += Math.sin(currentHeading) * currentSpeed * 0.05; // 속도 감소: 0.1 → 0.05
          break;
          
        case 'turn_left':
          // 좌회전: 속도 감소하면서 좌회전, 회전 후 직진 방향으로 조정
          currentSpeed = Math.max(currentSpeed - 0.8, 8);
          
          // 회전 구간의 진행률 계산 (0~1)
          const leftTurnProgress = (time - currentSegment.start) / (currentSegment.end - currentSegment.start);
          
          if (leftTurnProgress <= 0.5) {
            // 회전의 전반부: 좌회전
            currentHeading -= 0.08; // 좌회전
          } else {
            // 회전의 후반부: 핸들을 중앙으로 돌려서 직진 방향으로 조정
            const targetHeading = -Math.PI / 2; // -90도 (왼쪽으로 직진)
            // 부드러운 전환을 위해 lerp 사용
            const leftLerpFactor = (leftTurnProgress - 0.5) * 2; // 0~1
            currentHeading = currentHeading + (targetHeading - currentHeading) * leftLerpFactor;
          }
          
          currentX += Math.cos(currentHeading) * currentSpeed * 0.05; // 속도 감소: 0.1 → 0.05
          currentZ += Math.sin(currentHeading) * currentSpeed * 0.05; // 속도 감소: 0.1 → 0.05
          break;
          
        case 'stop':
          // 정지 구간: 점진적 감속 후 완전 정지
          if (time >= 30 && time < 32) {
            // 30-32초: 정지 신호에서 완전 정지
            currentSpeed = 0;
            // 위치는 변경하지 않음 (완전 정지)
          } else {
            // 40-45초: 일반 정지 구간에서 점진적 감속
            currentSpeed = Math.max(currentSpeed - 1.5, 0);
            currentX += Math.cos(currentHeading) * currentSpeed * 0.05; // 속도 감소: 0.1 → 0.05
            currentZ += Math.sin(currentHeading) * currentSpeed * 0.05; // 속도 감소: 0.1 → 0.05
          }
          break;
          
        case 'speed_reduction':
          // 속도 감소 구간: 점진적 감속하면서 천천히 이동
          currentSpeed = Math.max(currentSpeed - 0.3, 5); // 천천히 감속 (최소 속도 5 유지)
          
          // 50-55초 구간은 이동 거리를 더 줄임 (천천히 이동)
          let speedReductionMultiplier = 0.03; // 속도 감소 구간용 배율 (0.05 → 0.03)
          
          currentX += Math.cos(currentHeading) * currentSpeed * speedReductionMultiplier;
          currentZ += Math.sin(currentHeading) * currentSpeed * speedReductionMultiplier;
          break;
      }
    }

    // 약간의 랜덤성 추가 (도로의 미세한 굴곡)
    const randomOffset = (Math.random() - 0.5) * 0.05; // 속도 감소에 맞춰 랜덤 오프셋도 감소: 0.1 → 0.05
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
