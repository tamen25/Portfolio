import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Collections } from "@/components/Collections";
import { WideFrame } from "@/components/WideFrame";
import { Experiences } from "@/components/Experiences";
import { Testimonials } from "@/components/Testimonials";
import { Instagram } from "@/components/Instagram";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Collections />
        <WideFrame />
        <Experiences />
        <Testimonials />
        <Instagram />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
