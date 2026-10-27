import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import type { CameraPreset } from '../../types';

interface CameraRigProps {
  preset: CameraPreset;
  autoRotate?: boolean;
  onControlsReady?: (controls: OrbitControlsImpl) => void;
}

// Camera coordinate targets for each preset
const PRESET_COORDINATES: Record<CameraPreset, { position: [number, number, number]; target: [number, number, number] }> = {
  threeQuarter: { position: [2.5, 1.3, 3.2], target: [0, -0.1, 0] },
  hero: { position: [2.2, 0.9, 2.6], target: [0, -0.15, 0] },
  side: { position: [0, 0.4, 4.2], target: [0, 0, 0] },
  front: { position: [4.2, 0.5, 0], target: [0, 0, 0] },
  rear: { position: [-4.2, 0.5, 0], target: [0, 0, 0] },
  top: { position: [0.1, 4.5, 0.1], target: [0, 0, 0] },
};

export function CameraRig({ preset }: CameraRigProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const targetCamPos = useRef(new THREE.Vector3(...PRESET_COORDINATES[preset].position));
  const targetLookAt = useRef(new THREE.Vector3(...PRESET_COORDINATES[preset].target));
  const isTransitioning = useRef(true);

  useEffect(() => {
    const coords = PRESET_COORDINATES[preset] || PRESET_COORDINATES.threeQuarter;
    targetCamPos.current.set(...coords.position);
    targetLookAt.current.set(...coords.target);
    isTransitioning.current = true;
  }, [preset]);

  useFrame((_, delta) => {
    if (controlsRef.current && isTransitioning.current) {
      // Smooth lerp to target preset position
      camera.position.lerp(targetCamPos.current, Math.min(delta * 4, 0.2));
      controlsRef.current.target.lerp(targetLookAt.current, Math.min(delta * 4, 0.2));
      controlsRef.current.update();

      if (camera.position.distanceTo(targetCamPos.current) < 0.05) {
        isTransitioning.current = false;
      }
    }
  });

  return null;
}
