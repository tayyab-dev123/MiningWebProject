import React from "react";
import HeroSection from "./HeroSection";
import ServicesSection from "./Service";
import SolutionCard from "../SolarSolutions";
import ModernAboutSegments from "./Segments";

function LandingHome() {
  return (
    <div className="overflow-hidden bg-[#101010]">
      <HeroSection />
      <SolutionCard/>
      <ModernAboutSegments/>
    </div>
  );
}

export default LandingHome;
