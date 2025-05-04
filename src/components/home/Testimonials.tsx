
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Jean Mbemba",
    role: "Étudiant en droit",
    testimonial: "Les cours de l'ACDN m'ont permis de comprendre les enjeux juridiques du numérique au Congo, un domaine peu enseigné dans mon université."
  },
  {
    id: 2,
    name: "Marie Loutala",
    role: "Entrepreneure Tech",
    testimonial: "Grâce à cette plateforme, j'ai pu mettre mon entreprise en conformité avec les réglementations numériques congolaises. Formation indispensable !"
  },
  {
    id: 3,
    name: "Patrick Mouanda",
    role: "Avocat",
    testimonial: "En tant que juriste, ces ressources m'ont aidé à me spécialiser dans le droit numérique, un domaine en pleine expansion au Congo."
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos étudiants</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les témoignages de personnes qui ont suivi nos formations
            et utilisent nos ressources juridiques.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <Card key={item.id} className="bg-gray-50 border-none">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <blockquote className="text-gray-700 italic mb-4 flex-grow">
                    "{item.testimonial}"
                  </blockquote>
                  <div className="mt-4">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600 text-sm">{item.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
