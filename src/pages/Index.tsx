import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Contact } from "@/components/Contact";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BrowserRouter } from "react-router-dom";

const Index = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Hero />
        <Services />
        <Portfolio />
        <Contact />
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default Index;