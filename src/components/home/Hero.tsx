
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-acdn-blue via-acdn-blue to-acdn-green text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Comprendre et Maîtriser le Droit Numérique au Congo
          </h1>
          <p className="text-xl mb-8 text-white/90">
            Des formations gratuites pour vous aider à naviguer dans les aspects juridiques 
            du monde numérique, adaptées au contexte congolais.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/cours">
              <Button className="bg-white text-acdn-blue hover:bg-white/90 text-base px-6 py-5 font-semibold">
                Découvrir nos cours
              </Button>
            </Link>
            <Link to="/inscription">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 text-base px-6 py-5 font-semibold">
                S'inscrire gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
