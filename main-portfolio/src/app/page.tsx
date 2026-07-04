import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Developer from "@/components/Developer";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top">
      <Nav />
      <main>
        <Hero />
        <Developer />
        <section id="photographer" className="min-h-screen" />
        <section id="about" />
        <section id="contact" />
      </main>
      <Footer />
    </div>
  );
}
