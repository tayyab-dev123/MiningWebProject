import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeroSection from "../components/home/HeroSection";
import Navbar from "@/components/NavBar";
import SolutionCard from "@/components/SolarSolutions";
import Team from "./about/page";
import Competitive from "@/components/home/Service";
import LandingLayout from "@/components/Layouts/LandingLayout";
import LandingHome from "@/components/home/landingHome";
import { Poppins } from '@next/font/google';
import "@/css/style.css";
import 'leaflet/dist/leaflet.css';



export default function Home() {
  return (
    <>
    
       <LandingLayout>
        <LandingHome/>
      </LandingLayout> 
    {/* <DefaultLayout>
        <ECommerce />
       </DefaultLayout> */}
    </>
  );
}
