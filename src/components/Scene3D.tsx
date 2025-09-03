import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Vehicle3D } from './Vehicle3D';
import { TrajectoryPath } from './TrajectoryPath';
import { usePlaybackStore } from '../stores/playbackStore';
import * as THREE from 'three';

interface Scene3DProps {
  viewMode: 'simulator' | 'ar';
  cameraMode: 'follow' | 'free';
}







export const Scene3D: React.FC<Scene3DProps> = ({ viewMode, cameraMode }) => {
  

  
  // Manual 모드에서 카메라를 큐브 위치로 이동하는 컴포넌트
  const ManualCameraMover: React.FC = () => {
    const { currentTime, currentExperiment } = usePlaybackStore();
    
    useFrame((state) => {
      // Manual 모드에서 큐브 위치로 카메라 이동
      if (currentExperiment && currentExperiment.trajectory.length > 0) {
        const trajectory = currentExperiment.trajectory;
        let targetPoint = trajectory[0];
        let minDistance = Math.abs(trajectory[0].position.timestamp - currentTime);
        
        // 이진 탐색으로 가장 가까운 포인트 찾기
        let left = 0;
        let right = trajectory.length - 1;
        
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          const midTime = trajectory[mid].position.timestamp;
          const distance = Math.abs(midTime - currentTime);
          
          if (distance < minDistance) {
            minDistance = distance;
            targetPoint = trajectory[mid];
          }
          
          if (midTime < currentTime) {
            left = mid + 1;
          } else {
            right = mid - 1;
          }
        }
        
        // 큐브 뒤쪽에서 바라보는 카메라 위치 (회전 고정)
        const offset = { x: 0, y: 2, z: -3 }; // 큐브 뒤쪽 3m, 위쪽 2m
        const cameraX = targetPoint.position.x + offset.x;
        const cameraY = targetPoint.position.y + offset.y;
        const cameraZ = targetPoint.position.z + offset.z;
        
        // Manual 모드일 때 즉시 카메라 이동
        state.camera.position.set(cameraX, cameraY, cameraZ);
        
        // 큐브를 바라보도록 설정 (회전 고정된 큐브의 정면을 바라봄)
        // 큐브가 회전하지 않으므로 항상 정면을 바라봄
        state.camera.lookAt(targetPoint.position.x, targetPoint.position.y, targetPoint.position.z);
      }
    });
    
    return null;
  };

  return (
    <div style={{ width: '100%', height: '500px', background: '#0a0a0a', position: 'relative' }}>


      <Canvas
        camera={{ 
          position: viewMode === 'ar' ? [0, 2, 5] : [15, 15, 15], 
          fov: viewMode === 'ar' ? 75 : 60,
          near: 0.1,
          far: 1000
        }}
        style={{ background: '#0a0a0a' }}
      >
        {/* 조명 */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* 그리드 */}
        <Grid 
          args={[50, 50]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#444444" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#666666" 
          fadeDistance={25} 
          fadeStrength={1} 
          followCamera={false} 
          infiniteGrid={true} 
        />
        
        {/* 3D 컴포넌트들 */}
        <Vehicle3D viewMode={viewMode} />
        <TrajectoryPath viewMode={viewMode} />
        
        {/* Follow 모드일 때만 카메라를 큐브 위치로 이동하는 시스템 */}
        {cameraMode === 'follow' && <ManualCameraMover />}
        
        {/* 카메라 컨트롤 - Free 모드일 때만 활성화 */}
        <OrbitControls 
          enablePan={viewMode === 'simulator' && cameraMode === 'free'}
          enableZoom={true}
          enableRotate={viewMode === 'simulator' && cameraMode === 'free'}
          maxDistance={viewMode === 'ar' ? 20 : 50}
          minDistance={viewMode === 'ar' ? 3 : 5}
          target={viewMode === 'ar' ? [0, 0, 0] : undefined}
        />
      </Canvas>
    </div>
  );
};

