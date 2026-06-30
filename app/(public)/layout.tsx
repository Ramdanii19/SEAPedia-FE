import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { BuyerOrGuestGuard } from "@/features/auth/components/BuyerOrGuestGuard";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BuyerOrGuestGuard>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BottomNav />
    </BuyerOrGuestGuard>
  );
}
