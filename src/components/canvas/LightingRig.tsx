import { ContactShadows } from '@react-three/drei';

export function LightingRig() {
  return (
    <>
      {/* Base ambient studio bounce */}
      <ambientLight intensity={0.8} />

      {/* Main warm key light */}
      <directionalLight
        position={[6, 8, 5]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Soft secondary fill light */}
      <directionalLight
        position={[-6, 4, 3]}
        intensity={0.7}
        color="#e0e7ff"
      />

      {/* Dramatic rim/back light for crisp silhouette edges */}
      <directionalLight
        position={[0, 5, -6]}
        intensity={1.2}
        color="#bae6fd"
      />

      {/* Subtle floor bounce light */}
      <directionalLight
        position={[0, -4, 0]}
        intensity={0.3}
        color="#fde047"
      />

      {/* Soft studio contact shadows beneath the sneaker */}
      <ContactShadows
        position={[0, -0.78, 0]}
        opacity={0.65}
        scale={6}
        blur={1.8}
        far={2}
        resolution={1024}
        color="#000000"
      />
    </>
  );
}
