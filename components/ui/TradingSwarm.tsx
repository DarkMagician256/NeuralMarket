'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

function AgentNode({ position, color, size, speed }: { position: [number, number, number], color: string, size: number, speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime() * speed;
    mesh.current.position.y = position[1] + Math.sin(t) * 0.2;
    mesh.current.position.x = position[0] + Math.cos(t * 0.5) * 0.1;
  });

  return (
    <mesh position={position} ref={mesh}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={2} 
        roughness={0}
        metalness={1}
      />
    </mesh>
  );
}

function SwarmConnection({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  return (
    <Line
      points={[new THREE.Vector3(...start), new THREE.Vector3(...end)]}
      color="#06b6d4"
      lineWidth={0.5}
      transparent
      opacity={0.3}
    />
  );
}

function Particles({ count = 100 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  return (
    <Points positions={points}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Scene() {
  const nodes = useMemo(() => [
    { pos: [0, 0, 0] as [number, number, number], color: '#22d3ee', size: 0.15, speed: 1 },
    { pos: [1.2, 0.8, -0.5] as [number, number, number], color: '#818cf8', size: 0.1, speed: 1.2 },
    { pos: [-1.5, -0.5, 0.2] as [number, number, number], color: '#c084fc', size: 0.1, speed: 0.8 },
    { pos: [0.5, -1.2, -0.8] as [number, number, number], color: '#22d3ee', size: 0.08, speed: 1.5 },
    { pos: [-0.8, 1.5, 0.3] as [number, number, number], color: '#818cf8', size: 0.12, speed: 0.9 },
  ], []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      
      <group>
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            <AgentNode position={node.pos} color={node.color} size={node.size} speed={node.speed} />
            {i > 0 && <SwarmConnection start={nodes[0].pos} end={node.pos} />}
          </React.Fragment>
        ))}
        <Particles count={200} />
      </group>
      
      <Sphere args={[1, 64, 64]} scale={2}>
        <MeshDistortMaterial
          color="#1e1b4b"
          roughness={0}
          distort={0.4}
          speed={2}
          transparent
          opacity={0.1}
        />
      </Sphere>
    </>
  );
}

export default function TradingSwarm() {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene />
      </Canvas>
      <div className="absolute inset-0 pointer-events-none border border-cyan-500/10 rounded-full" />
    </div>
  );
}
