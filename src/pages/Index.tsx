import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import ServicesSection from "@/components/home/ServicesSection";
import DifferentialsSection from "@/components/home/DifferentialsSection";
import AboutSection from "@/components/home/AboutSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import ContactSection from "@/components/home/ContactSection";
import DualCTABar from "@/components/shared/DualCTABar";
import LeadCapturePopup from "@/components/shared/LeadCapturePopup";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <StatsBar />
      <DualCTABar label="Ready to transform your floors?" />
      <ServicesSection />
      <DifferentialsSection />
      <AboutSection />
      <TestimonialsSection />
      <DualCTABar variant="gold" />
      <GalleryPreview />
      <ContactSection />
      <LeadCapturePopup />
    </Layout>
  );
}
