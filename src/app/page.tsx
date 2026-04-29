import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/marketing/Hero";
import { Offerings } from "@/components/marketing/Offerings";
import { PortfolioGrid } from "@/components/marketing/PortfolioGrid";
import { Backends } from "@/components/marketing/Backends";
import { About } from "@/components/marketing/About";
import { Contact } from "@/components/marketing/Contact";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Offerings />
        <PortfolioGrid />
        <Backends />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
