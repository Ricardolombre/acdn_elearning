
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-16 bg-acdn-green text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Prêt à vous former au droit numérique congolais ?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
          Rejoignez notre communauté d'apprenants et accédez gratuitement à toutes nos ressources 
          juridiques et formations.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/inscription">
            <Button className="bg-white text-acdn-green hover:bg-white/90 font-semibold px-6 py-5">
              S'inscrire Gratuitement
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-6 py-5">
              Contactez-nous
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
