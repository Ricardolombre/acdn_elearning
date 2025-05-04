
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CoursesHighlight from "@/components/home/CoursesHighlight";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <CoursesHighlight />
      <Testimonials />
      <CTA />
    </Layout>
  );
};

export default HomePage;
