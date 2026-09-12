import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CelestialParticles({ count = 300 }) {
  const meshRef = useRef();
  const lightRef = useRef();

  // Generate random positions, scales, and rotational speeds
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 12 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = radius * Math.cos(phi) - 10;

      sc[i] = Math.random() * 0.8 + 0.2;
    }
    return [pos, sc];
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.035;
    meshRef.current.rotation.x += delta * 0.015;

    // Gentle camera tracking to mouse
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 1.5, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.mouse.y * 1.2, 0.03);
    state.camera.lookAt(0, 0, -10);
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#F5C518"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function AmbientGlowRing() {
  const ringRef = useRef();

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -15]} rotation={[Math.PI / 4, 0, 0]}>
      <torusGeometry args={[8, 0.03, 16, 100]} />
      <meshBasicMaterial color="#4B006E" transparent opacity={0.3} />
    </mesh>
  );
}

export default function ParticleScene({ className = '' }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
      >
        <fog attach="fog" args={['#000000', 10, 35]} />
        <ambientLight intensity={0.4} />
        <CelestialParticles count={isMobile ? 120 : 320} />
        <AmbientGlowRing />
      </Canvas>
    </div>
  );
}
