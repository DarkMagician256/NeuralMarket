'use client';

import dynamic from 'next/dynamic';

const NeuralMesh = dynamic(() => import('@/components/ui/NeuralMesh'), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-[#05050A]" />
});

export default function NeuralMeshWrapper() {
    return <NeuralMesh />;
}
