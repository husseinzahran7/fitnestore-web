"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

function Dumbbell() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.35;
    const { x, y } = state.pointer;
    group.current.rotation.x += (y * 0.35 - group.current.rotation.x) * 0.06;
    group.current.rotation.z = x * 0.12;
  });

  const steel = { color: "#e2e8f0", metalness: 0.85, roughness: 0.28 } as const;
  const accent = { color: "#0080ff", metalness: 0.4, roughness: 0.3 } as const;

  const plates: Array<[number, number, number]> = [
    // [offset from center, radius, thickness]
    [0.62, 0.62, 0.16],
    [0.82, 0.5, 0.14],
    [0.99, 0.4, 0.12],
  ];

  return (
    <group ref={group} rotation={[0.15, 0, 0.28]}>
      {/* bar */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 2.5, 32]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {/* center collar */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.22, 32]} />
        <meshStandardMaterial {...accent} />
      </mesh>
      {([1, -1] as const).map((side) =>
        plates.map(([offset, radius, thick], i) => (
          <mesh
            key={`${side}-${i}`}
            position={[side * offset, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[radius, radius, thick, 48]} />
            <meshStandardMaterial {...(i === 0 ? accent : steel)} />
          </mesh>
        ))
      )}
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="h-[320px] w-full sm:h-[420px] lg:h-[520px]">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.4, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 4]} intensity={1.6} />
        <pointLight position={[-5, -2, 3]} intensity={12} color="#0080ff" />
        <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.9}>
          <Dumbbell />
        </Float>
        <ContactShadows
          position={[0, -1.7, 0]}
          opacity={0.55}
          scale={9}
          blur={2.4}
          color="#0080ff"
        />
      </Canvas>
    </div>
  );
}
