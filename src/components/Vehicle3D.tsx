import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { usePlaybackStore } from '../stores/playbackStore';
import type { TrajectoryPoint } from '../types';

interface Vehicle3DProps {
  scale?: number;
  viewMode?: 'simulator' | 'ar';
}

export const Vehicle3D: React.FC<Vehicle3DProps> = ({ scale = 1, viewMode = 'simulator' }) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const directionGroupRef = useRef<THREE.Group | null>(null);
  const { currentExperiment, currentTime } = usePlaybackStore();
  const { camera } = useThree();

  // 현재 시간에 해당하는 궤적 포인트 찾기
  const getCurrentPosition = (): TrajectoryPoint | null => {
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
  };

  // 매 프레임마다 차량 위치 업데이트
  useFrame(() => {
    if (!meshRef.current) return;

    const currentPoint = getCurrentPosition();
    if (currentPoint) {
      const { x, y, z } = currentPoint.position;
      meshRef.current.position.set(x, y, z);
      // 기본 회전 +90도 + 경로 방향 회전
      meshRef.current.rotation.y = Math.PI / 2 + currentPoint.heading;
      
      // AR 모드에서 방향 표시기도 함께 움직이도록
      if (viewMode === 'ar' && directionGroupRef.current) {
        directionGroupRef.current.position.set(x, y, z);
        directionGroupRef.current.rotation.y = Math.PI / 2 + currentPoint.heading;
      }

      // AR 모드에서 카메라를 차량의 자식으로 설정
      if (viewMode === 'ar') {
        // 차량 안쪽에서 정면을 바라보는 FPS 시점
        const cameraOffsetX = Math.sin(currentPoint.heading) * 0.5; // 차량 안쪽으로
        const cameraOffsetZ = Math.cos(currentPoint.heading) * 0.5; // 차량 안쪽으로
        
        camera.position.set(
          x + cameraOffsetX,
          y + 0.5, // 차량 높이의 중간
          z + cameraOffsetZ
        );
        
        // 차량이 향하는 정면 방향을 바라보도록 카메라 회전
        const lookAheadX = x + Math.sin(currentPoint.heading) * 20;
        const lookAheadZ = z + Math.cos(currentPoint.heading) * 20;
        camera.lookAt(lookAheadX, y + 0.5, lookAheadZ);
      }
    }
  });

  if (!currentExperiment) {
    return null;
  }

  return (
    <>
      {/* 메인 차량 바디 */}
      <Box
        ref={meshRef}
        args={[2 * scale, 1 * scale, 3 * scale]} // 길이, 높이, 너비
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color={viewMode === 'ar' ? "#FF6B35" : "#2563eb"} 
          emissive={viewMode === 'ar' ? "#FF4500" : "#1e40af"}
          emissiveIntensity={viewMode === 'ar' ? 0.2 : 0}
        />
      </Box>
      
      {/* AR 모드에서 방향 표시기 */}
      {viewMode === 'ar' && (
        <group ref={directionGroupRef}>
          {/* 앞쪽 방향 표시기 */}
          <Box
            args={[0.1 * scale, 0.1 * scale, 0.5 * scale]}
            position={[0, 0.6 * scale, 1.5 * scale]}
          >
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.8} />
          </Box>
          
          {/* 측면 방향 표시기 */}
          <Box
            args={[0.5 * scale, 0.1 * scale, 0.1 * scale]}
            position={[1.1 * scale, 0.6 * scale, 0]}
          >
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.8} />
          </Box>
        </group>
      )}
    </>
  );
};
