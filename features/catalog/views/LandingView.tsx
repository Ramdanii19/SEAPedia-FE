import { HeroSection } from "../sections/HeroSection";
import { FeaturedProductsSection } from "../sections/FeaturedProductsSection";
import { HowItWorksSection } from "../sections/HowItWorksSection";
import { ReviewSection } from "@/features/review";

export function LandingView() {
  return (
    <>
      <HeroSection />
      <FeaturedProductsSection />
      <HowItWorksSection />
      <ReviewSection />
    </>
  );
}
