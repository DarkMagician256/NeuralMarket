import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import LiveTicker from "@/components/landing/LiveTicker";
import BentoGrid from "@/components/landing/BentoGrid";
import GlobalFooter from "@/components/layout/GlobalFooter";
import NeuralMesh from "@/components/ui/NeuralMesh";
import NeuralMeshWrapper from "../components/ui/NeuralMeshWrapper";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05050A] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <NeuralMeshWrapper />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <HeroSection />
        <LiveTicker />
        <BentoGrid />
        <GlobalFooter />
      </div>
    </main>
  );
}
