import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { MATERIAL_PRESETS } from '../../config/materials';
import type { PartId } from '../../types';

export function FallbackSneakerModel() {
  const configuration = useConfiguratorStore(state => state.configuration);
  const selectedPartId = useConfiguratorStore(state => state.selectedPartId);
  const selectPart = useConfiguratorStore(state => state.selectPart);

  const getMatProps = (partId: PartId) => {
    const custom = configuration[partId] || { color: '#ffffff', materialPresetId: 'leather' };
    const preset = MATERIAL_PRESETS[custom.materialPresetId] || MATERIAL_PRESETS.leather;
    const isSelected = selectedPartId === partId;

    return {
      color: custom.color,
      roughness: preset.roughness,
      metalness: preset.metalness,
      emissive: isSelected ? custom.color : '#000000',
      emissiveIntensity: isSelected ? 0.2 : 0,
    };
  };

  return (
    <group position={[0, -0.4, 0]} rotation={[0, -Math.PI / 4, 0]} scale={1.2}>
      {/* Midsole / Outsole */}
      <mesh
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); selectPart('sole'); }}
      >
        <boxGeometry args={[3.2, 0.45, 1.4]} />
        <meshStandardMaterial {...getMatProps('sole')} />
      </mesh>

      {/* Main Upper Body */}
      <mesh
        position={[-0.2, 0.6, 0]}
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); selectPart('mesh'); }}
      >
        <boxGeometry args={[2.6, 0.75, 1.3]} />
        <meshStandardMaterial {...getMatProps('mesh')} />
      </mesh>

      {/* Toe Overlay / Cap */}
      <mesh
        position={[1.1, 0.45, 0]}
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); selectPart('caps'); }}
      >
        <boxGeometry args={[0.9, 0.5, 1.32]} />
        <meshStandardMaterial {...getMatProps('caps')} />
      </mesh>

      {/* Heel Counter Band */}
      <mesh
        position={[-1.3, 0.55, 0]}
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); selectPart('band'); }}
      >
        <boxGeometry args={[0.5, 0.7, 1.32]} />
        <meshStandardMaterial {...getMatProps('band')} />
      </mesh>

      {/* Collar & Inner Lining */}
      <mesh
        position={[-0.6, 1.05, 0]}
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); selectPart('inner'); }}
      >
        <cylinderGeometry args={[0.55, 0.6, 0.35, 16]} />
        <meshStandardMaterial {...getMatProps('inner')} />
      </mesh>

      {/* Tongue Patch */}
      <mesh
        position={[0.2, 1.15, 0]}
        rotation={[0, 0, -Math.PI / 6]}
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); selectPart('patch'); }}
      >
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial {...getMatProps('patch')} />
      </mesh>

      {/* Laces */}
      {[0, 0.25, 0.5].map((xOffset, i) => (
        <mesh
          key={i}
          position={[0.1 + xOffset, 1.02 - i * 0.08, 0]}
          rotation={[0, 0, -Math.PI / 12]}
          castShadow
          onClick={(e) => { e.stopPropagation(); selectPart('laces'); }}
        >
          <boxGeometry args={[0.1, 0.05, 0.9]} />
          <meshStandardMaterial {...getMatProps('laces')} />
        </mesh>
      ))}

      {/* Side Stripes */}
      <mesh
        position={[-0.1, 0.65, 0.67]}
        rotation={[0, 0, Math.PI / 8]}
        castShadow
        onClick={(e) => { e.stopPropagation(); selectPart('stripes'); }}
      >
        <boxGeometry args={[1.2, 0.15, 0.05]} />
        <meshStandardMaterial {...getMatProps('stripes')} />
      </mesh>
      <mesh
        position={[-0.1, 0.65, -0.67]}
        rotation={[0, 0, -Math.PI / 8]}
        castShadow
        onClick={(e) => { e.stopPropagation(); selectPart('stripes'); }}
      >
        <boxGeometry args={[1.2, 0.15, 0.05]} />
        <meshStandardMaterial {...getMatProps('stripes')} />
      </mesh>
    </group>
  );
}
