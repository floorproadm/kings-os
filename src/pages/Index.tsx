import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import ServicesSection from "@/components/home/ServicesSection";
import DifferentialsSection from "@/components/home/DifferentialsSection";
import AboutSection from "@/components/home/AboutSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import ContactCTA from "@/components/home/ContactCTA";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <StatsBar />
      <ServicesSection />
      <DifferentialsSection />
      <AboutSection />
      <TestimonialsSection />
      <GalleryPreview />
      <ContactCTA />
    </Layout>
  );
}
