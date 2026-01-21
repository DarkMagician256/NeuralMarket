'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function MeshParticles() {
    const count = 2000;
    const mesh = useRef<THREE.Points>(null!);

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return positions;
    }, [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.rotation.y = time * 0.05;
            mesh.current.rotation.x = time * 0.02;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particlesPosition, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#88ccff"
                sizeAttenuation
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function NeuralMesh() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#05050A]">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <fog attach="fog" args={['#05050A', 2, 8]} />
                <MeshParticles />
            </Canvas>
        </div>
    );
}
