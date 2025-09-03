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

export const Vehicle3D: React.FC<Vehicle3DProps> = ({ scale = 1.6, viewMode = 'simulator' }) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const directionGroupRef = useRef<THREE.Group | null>(null);
  const { currentExperiment, currentTime } = usePlaybackStore();
  const { camera } = useThree();

  // 현재 시간에 해당하는 궤적 포인트와 다음 포인트를 찾아 진행 방향 계산
  const getCurrentPositionAndDirection = (): { current: TrajectoryPoint | null; direction: THREE.Vector3 | null } => {
    if (!currentExperiment || currentExperiment.trajectory.length === 0) {
      return { current: null, direction: null };
    }

    const trajectory = currentExperiment.trajectory;
    const targetTime = currentTime;

    // 이진 탐색으로 가장 가까운 포인트 찾기
    let left = 0;
    let right = trajectory.length - 1;
    let closestIndex = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midTime = trajectory[mid].position.timestamp;
      
      if (Math.abs(midTime - targetTime) < Math.abs(trajectory[closestIndex].position.timestamp - targetTime)) {
        closestIndex = mid;
      }
      
      if (midTime < targetTime) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    const currentPoint = trajectory[closestIndex];
    
    // 다음 포인트가 있으면 진행 방향 계산
    let direction: THREE.Vector3 | null = null;
    if (closestIndex < trajectory.length - 1) {
      const nextPoint = trajectory[closestIndex + 1];
      direction = new THREE.Vector3(
        nextPoint.position.x - currentPoint.position.x,
        0, // Y축은 고려하지 않음
        nextPoint.position.z - currentPoint.position.z
      ).normalize();
    } else if (closestIndex > 0) {
      // 마지막 포인트인 경우 이전 포인트와의 방향 사용
      const prevPoint = trajectory[closestIndex - 1];
      direction = new THREE.Vector3(
        currentPoint.position.x - prevPoint.position.x,
        0,
        currentPoint.position.z - prevPoint.position.z
      ).normalize();
    }

    return { current: currentPoint, direction };
  };

  // 진행 방향에 따른 차량 회전 각도 계산
  const calculateVehicleRotation = (direction: THREE.Vector3): number => {
    // Z축(앞쪽)을 기준으로 회전 각도 계산
    const angle = Math.atan2(direction.x, direction.z);
    return angle;
  };

  // 매 프레임마다 차량 위치와 회전 업데이트
  useFrame(() => {
    if (!meshRef.current) return;

    const { current: currentPoint, direction } = getCurrentPositionAndDirection();
    if (currentPoint && direction) {
      const { x, y, z } = currentPoint.position;
      meshRef.current.position.set(x, y, z);
      
      // 진행 방향에 따른 자연스러운 차량 회전
      const rotationY = calculateVehicleRotation(direction);
      meshRef.current.rotation.y = rotationY;
      
      // AR 모드에서 방향 표시기도 함께 움직이도록
      if (viewMode === 'ar' && directionGroupRef.current) {
        directionGroupRef.current.position.set(x, y, z);
        directionGroupRef.current.rotation.y = rotationY;
      }

      // AR 모드에서 카메라를 차량의 자식으로 설정
      if (viewMode === 'ar') {
        // 차량 안쪽에서 정면을 바라보는 FPS 시점
        const cameraOffsetX = Math.sin(rotationY) * 0.5;
        const cameraOffsetZ = Math.cos(rotationY) * 0.5;
        
        camera.position.set(
          x + cameraOffsetX,
          y + 0.5,
          z + cameraOffsetZ
        );
        
        // 차량이 향하는 정면 방향을 바라보도록 카메라 회전
        const lookAheadX = x + Math.sin(rotationY) * 20;
        const lookAheadZ = z + Math.cos(rotationY) * 20;
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
        
        {/* 차량의 앞쪽을 명확하게 표시하는 화살표 (투명하게 설정) */}
        <Box
          args={[0.1 * scale, 0.1 * scale, 0.8 * scale]}
          position={[0, 0.6 * scale, -1.4 * scale]}
        >
          <meshStandardMaterial 
            color="#FFFFFF" 
            emissive="#FFFFFF" 
            emissiveIntensity={0.8}
            transparent={true}
            opacity={0}
          />
        </Box>
        
        {/* 차량의 측면 방향 표시기 (투명하게 설정) */}
        <Box
          args={[0.8 * scale, 0.1 * scale, 0.1 * scale]}
          position={[0.9 * scale, 0.6 * scale, 0]}
        >
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={0.5}
            transparent={true}
            opacity={0}
          />
        </Box>
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
