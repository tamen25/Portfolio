import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top">
      <Nav />
      <main>
        <section id="hero" className="flex min-h-screen items-center justify-center">
          <h1 className="font-display text-5xl">Tamen Dutta</h1>
        </section>
        <section id="developer" className="min-h-screen" />
        <section id="photographer" className="min-h-screen" />
        <section id="about" />
        <section id="contact" />
      </main>
      <Footer />
    </div>
  );
}
