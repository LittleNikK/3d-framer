import { useEffect, useRef, useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { MATERIAL_PRESETS } from '../../config/materials';
import type { PartId, MeshInspectionInfo } from '../../types';
import { ORDERED_PARTS } from '../../config/meshMappings';

interface SneakerModelProps {
  modelPath: string;
}

export function SneakerModel({ modelPath }: SneakerModelProps) {
  const gltf = useGLTF(modelPath, '/draco/') as any;
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredPart, setHoveredPart] = useState<PartId | null>(null);

  const configuration = useConfiguratorStore(state => state.configuration);
  const selectedPartId = useConfiguratorStore(state => state.selectedPartId);
  const selectPart = useConfiguratorStore(state => state.selectPart);
  const setModelStatus = useConfiguratorStore(state => state.setModelStatus);
  const setModelInspection = useConfiguratorStore(state => state.setModelInspection);

  // Clone materials on load so modifications are completely isolated
  const clonedMaterials = useMemo(() => {
    const map: Record<string, THREE.MeshStandardMaterial> = {};
    if (gltf.materials) {
      for (const [key, mat] of Object.entries(gltf.materials)) {
        if (mat instanceof THREE.Material) {
          const cloned = (mat as THREE.MeshStandardMaterial).clone();
          // Ensure environment map reflections look rich
          cloned.envMapIntensity = 1.0;
          map[key] = cloned;
        }
      }
    }
    return map;
  }, [gltf]);

  // Inspect meshes and materials for developer diagnostics report
  useEffect(() => {
    try {
      const materialList: MeshInspectionInfo['materials'] = [];
      const meshList: MeshInspectionInfo['meshes'] = [];

      let idx = 0;
      for (const [name, mat] of Object.entries(clonedMaterials)) {
        materialList.push({
          index: idx++,
          name,
          roughness: mat.roughness,
          metalness: mat.metalness,
          color: '#' + mat.color.getHexString(),
        });
      }

      if (gltf.nodes) {
        for (const [name, node] of Object.entries(gltf.nodes)) {
          if ((node as any).isMesh) {
            const mesh = node as THREE.Mesh;
            const mats: string[] = [];
            if (Array.isArray(mesh.material)) {
              mats.push(...mesh.material.map(m => m.name));
            } else if (mesh.material) {
              mats.push(mesh.material.name);
            }
            meshList.push({ name, materialNames: mats });
          }
        }
      }

      setModelInspection({
        meshCount: meshList.length,
        materials: materialList,
        meshes: meshList,
      });

      setModelStatus('ready');
    } catch (e: any) {
      console.error('Model inspection failed:', e);
      setModelStatus('ready');
    }
  }, [clonedMaterials, gltf, setModelInspection, setModelStatus]);

  // Synchronize configuration (colors, roughness, metalness) to cloned materials
  useEffect(() => {
    for (const partId of ORDERED_PARTS) {
      const custom = configuration[partId];
      const mat = clonedMaterials[partId];

      if (mat && custom) {
        // Apply color safely
        mat.color.set(custom.color);

        // Apply physical PBR material preset
        const preset = MATERIAL_PRESETS[custom.materialPresetId];
        if (preset) {
          mat.roughness = preset.roughness;
          mat.metalness = preset.metalness;
        }

        // Apply selected / hovered feedback
        const isSelected = selectedPartId === partId;
        const isHovered = hoveredPart === partId;

        if (isSelected) {
          mat.emissive.set(custom.color);
          mat.emissiveIntensity = 0.12;
        } else if (isHovered) {
          mat.emissive.set('#ffffff');
          mat.emissiveIntensity = 0.08;
        } else {
          mat.emissive.set('#000000');
          mat.emissiveIntensity = 0;
        }

        mat.needsUpdate = true;
      }
    }
  }, [configuration, selectedPartId, hoveredPart, clonedMaterials]);

  // Pointer interactions for direct 3D part picking
  const handlePointerDown = (partId: PartId, e: any) => {
    e.stopPropagation();
    selectPart(partId);
  };

  const handlePointerOver = (partId: PartId, e: any) => {
    e.stopPropagation();
    setHoveredPart(partId);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredPart(null);
    document.body.style.cursor = 'default';
  };

  // Find geometries from nodes.
  // In the Draco shoe model:
  // nodes.shoe is a Mesh or group containing the shoe geometry primitives:
  // shoe: laces, shoe_1: mesh, shoe_2: caps, shoe_3: inner, shoe_4: sole, shoe_5: stripes, shoe_6: band, shoe_7: patch
  const geometries = useMemo(() => {
    const nds = gltf.nodes || {};
    return {
      laces: nds.shoe?.geometry,
      mesh: nds.shoe_1?.geometry,
      caps: nds.shoe_2?.geometry,
      inner: nds.shoe_3?.geometry,
      sole: nds.shoe_4?.geometry,
      stripes: nds.shoe_5?.geometry,
      band: nds.shoe_6?.geometry,
      patch: nds.shoe_7?.geometry,
    };
  }, [gltf]);

  return (
    <group
      ref={groupRef}
      dispose={null}
      position={[0, -0.65, 0]}
      rotation={[0, -Math.PI / 4, 0]}
      scale={2.4}
    >
      {geometries.laces && (
        <mesh
          castShadow
          receiveShadow
          geometry={geometries.laces}
          material={clonedMaterials.laces || gltf.materials?.laces}
          onPointerDown={e => handlePointerDown('laces', e)}
          onPointerOver={e => handlePointerOver('laces', e)}
          onPointerOut={handlePointerOut}
        />
      )}
      {geometries.mesh && (
        <mesh
          castShadow
          receiveShadow
          geometry={geometries.mesh}
          material={clonedMaterials.mesh || gltf.materials?.mesh}
          onPointerDown={e => handlePointerDown('mesh', e)}
          onPointerOver={e => handlePointerOver('mesh', e)}
          onPointerOut={handlePointerOut}
        />
      )}
      {geometries.caps && (
        <mesh
          castShadow
          receiveShadow
          geometry={geometries.caps}
          material={clonedMaterials.caps || gltf.materials?.caps}
          onPointerDown={e => handlePointerDown('caps', e)}
          onPointerOver={e => handlePointerOver('caps', e)}
          onPointerOut={handlePointerOut}
        />
      )}
      {geometries.inner && (
        <mesh
          castShadow
          receiveShadow
          geometry={geometries.inner}
          material={clonedMaterials.inner || gltf.materials?.inner}
          onPointerDown={e => handlePointerDown('inner', e)}
          onPointerOver={e => handlePointerOver('inner', e)}
          onPointerOut={handlePointerOut}
        />
      )}
      {geometries.sole && (
        <mesh
          castShadow
          receiveShadow
          geometry={geometries.sole}
          material={clonedMaterials.sole || gltf.materials?.sole}
          onPointerDown={e => handlePointerDown('sole', e)}
          onPointerOver={e => handlePointerOver('sole', e)}
          onPointerOut={handlePointerOut}
        />
      )}
      {geometries.stripes && (
        <mesh
          castShadow
          receiveShadow
          geometry={geometries.stripes}
          material={clonedMaterials.stripes || gltf.materials?.stripes}
          onPointerDown={e => handlePointerDown('stripes', e)}
          onPointerOver={e => handlePointerOver('stripes', e)}
          onPointerOut={handlePointerOut}
        />
      )}
      {geometries.band && (
        <mesh
          castShadow
          receiveShadow
          geometry={geometries.band}
          material={clonedMaterials.band || gltf.materials?.band}
          onPointerDown={e => handlePointerDown('band', e)}
          onPointerOver={e => handlePointerOver('band', e)}
          onPointerOut={handlePointerOut}
        />
      )}
      {geometries.patch && (
        <mesh
          castShadow
          receiveShadow
          geometry={geometries.patch}
          material={clonedMaterials.patch || gltf.materials?.patch}
          onPointerDown={e => handlePointerDown('patch', e)}
          onPointerOver={e => handlePointerOver('patch', e)}
          onPointerOut={handlePointerOut}
        />
      )}
    </group>
  );
}

// Preload model asset for immediate responsive interaction
useGLTF.preload('/models/sneaker-pro.glb', '/draco/');
