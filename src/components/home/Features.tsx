
import { Shield, BookOpen, Users, Globe } from "lucide-react";

const features = [
  {
    icon: <BookOpen className="w-10 h-10 text-acdn-blue" />,
    title: "Cours spécialisés",
    description: "Des formations adaptées aux réalités juridiques numériques congolaises, créées par des experts."
  },
  {
    icon: <Shield className="w-10 h-10 text-acdn-blue" />,
    title: "Conformité légale",
    description: "Comprenez les lois et réglementations qui régissent l'espace numérique au Congo."
  },
  {
    icon: <Users className="w-10 h-10 text-acdn-blue" />,
    title: "Communauté active",
    description: "Échangez avec d'autres apprenants et experts pour enrichir votre compréhension."
  },
  {
    icon: <Globe className="w-10 h-10 text-acdn-blue" />,
    title: "Ressources gratuites",
    description: "Accédez à une bibliothèque complète de documents juridiques et de cas pratiques."
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi choisir notre plateforme ?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 card-hover"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
