import React, { useMemo } from 'react';
import { Line, Sphere } from '@react-three/drei';
import { usePlaybackStore } from '../stores/playbackStore';

interface TrajectoryPathProps {
  viewMode?: 'simulator' | 'ar';
}

export const TrajectoryPath: React.FC<TrajectoryPathProps> = ({ viewMode = 'simulator' }) => {
  const { currentExperiment, currentTime } = usePlaybackStore();

  // 궤적 경로의 포인트들을 3D 좌표로 변환
  const pathPoints = useMemo(() => {
    if (!currentExperiment || currentExperiment.trajectory.length === 0) {
      return [];
    }

    return currentExperiment.trajectory.map(point => [
      point.position.x,
      point.position.y,
      point.position.z
    ] as [number, number, number]);
  }, [currentExperiment]);

  // 현재 위치에 해당하는 포인트 찾기
  const currentPoint = useMemo(() => {
    if (!currentExperiment || currentExperiment.trajectory.length === 0) {
      return null;
    }

    const trajectory = currentExperiment.trajectory;
    const startTime = trajectory[0].position.timestamp;
    const targetTime = startTime + currentTime;

    // 이진 탐색으로 가장 가까운 포인트 찾기
    let left = 0;
    let right = trajectory.length - 1;
    let closest = trajectory[0];

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midTime = trajectory[mid].position.timestamp;
      
      if (Math.abs(midTime - targetTime) < Math.abs(closest.position.timestamp - targetTime)) {
        closest = trajectory[mid];
      }
      
      if (midTime < targetTime) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return closest;
  }, [currentExperiment, currentTime]);

  if (!currentExperiment || pathPoints.length === 0) {
    return null;
  }

  return (
    <>
      {/* 전체 경로 */}
      <Line
        points={pathPoints}
        color={viewMode === 'ar' ? "#00FF88" : "#0099FF"}
        lineWidth={viewMode === 'ar' ? 5 : 3}
        transparent
        opacity={viewMode === 'ar' ? 0.9 : 0.7}
        dashed={false}
      />
      
      {/* AR 모드에서 현재 위치 표시 */}
      {viewMode === 'ar' && currentPoint && (
        <>
          {/* 현재 위치 마커 */}
          <Sphere
            position={[currentPoint.position.x, currentPoint.position.y + 0.5, currentPoint.position.z]}
            args={[0.3, 16, 16]}
          >
            <meshStandardMaterial color="#FF4444" emissive="#FF0000" emissiveIntensity={0.3} />
          </Sphere>
          
          {/* 진행 방향 화살표 */}
          <mesh
            position={[currentPoint.position.x, currentPoint.position.y + 0.5, currentPoint.position.z]}
            rotation={[0, currentPoint.heading, 0]}
          >
            <coneGeometry args={[0.2, 1, 8]} />
            <meshStandardMaterial color="#FFAA00" emissive="#FF8800" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}
    </>
  );
};
