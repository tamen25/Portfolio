import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Developer from "@/components/Developer";
import Photographer from "@/components/Photographer";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Hero />
        <Developer />
        <Photographer />
        <section id="about" />
        <section id="contact" />
      </main>
      <Footer />
    </div>
  );
}
