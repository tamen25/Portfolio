import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Developer from "@/components/Developer";
import Photographer from "@/components/Photographer";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Hero />
        <Developer />
        <Photographer />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
