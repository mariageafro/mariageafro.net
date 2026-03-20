import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { WhySection } from "@/components/home/WhySection";
import { ProSection } from "@/components/home/ProSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <WhySection />
      <ProSection />
    </Layout>
  );
};

export default Index;
