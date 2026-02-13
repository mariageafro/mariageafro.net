import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickSearchBar } from "@/components/home/QuickSearchBar";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { WhySection } from "@/components/home/WhySection";
import { InspirationSection } from "@/components/home/InspirationSection";
import { ProSection } from "@/components/home/ProSection";
import { DevenirPrestatairePopup } from "@/components/home/DevenirPrestatairePopup";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <QuickSearchBar />
      <CategoriesSection />
      <WhySection />
      <InspirationSection />
      <ProSection />
      <DevenirPrestatairePopup />
    </Layout>
  );
};

export default Index;
