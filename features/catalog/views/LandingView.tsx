import { HeroSection } from "../sections/HeroSection";
import { FeaturedProductsSection } from "../sections/FeaturedProductsSection";
import { HowItWorksSection } from "../sections/HowItWorksSection";

export function LandingView() {
  return (
    <>
      <HeroSection />
      <FeaturedProductsSection />
      <HowItWorksSection />
      {/* Slot: AppReviewSection — diisi di Branch 4 */}
    </>
  );
}
