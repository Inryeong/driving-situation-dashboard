import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Vehicle3D } from './Vehicle3D';
import { TrajectoryPath } from './TrajectoryPath';

interface Scene3DProps {
  viewMode: 'simulator' | 'ar';
}

export const Scene3D: React.FC<Scene3DProps> = ({ viewMode }) => {
  return (
    <div style={{ width: '100%', height: '500px', background: '#0a0a0a' }}>
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
        
        {/* 카메라 컨트롤 - AR 모드에서는 제한적, 시뮬레이터 모드에서는 자유롭게 */}
        <OrbitControls 
          enablePan={viewMode === 'simulator'}
          enableZoom={true}
          enableRotate={viewMode === 'simulator'}
          maxDistance={viewMode === 'ar' ? 20 : 50}
          minDistance={viewMode === 'ar' ? 3 : 5}
          target={viewMode === 'ar' ? [0, 0, 0] : undefined}
        />
      </Canvas>
    </div>
  );
};

