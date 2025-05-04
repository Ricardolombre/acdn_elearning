
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ExternalLink, FileText, BookOpen, Scale, Award } from "lucide-react";

const AboutPage = () => {
  // Données de démonstration pour l'équipe
  const team = [
    {
      id: 1,
      name: "Dr. Jean-Pierre Makosso",
      role: "Président",
      bio: "Docteur en droit, spécialiste du droit numérique et professeur à l'Université Marien Ngouabi de Brazzaville. Auteur de nombreuses publications sur la réglementation du numérique en Afrique.",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Me. Sylvie Moukala",
      role: "Vice-Présidente",
      bio: "Avocate spécialisée en droit des nouvelles technologies, elle conseille de nombreuses entreprises congolaises sur leurs obligations légales en matière numérique.",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Prof. Robert Ibara",
      role: "Directeur Scientifique",
      bio: "Professeur de droit international et chercheur reconnu dans le domaine de la propriété intellectuelle et du droit numérique en Afrique centrale.",
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Claudine Moussa",
      role: "Secrétaire Générale",
      bio: "Juriste spécialisée en droit des télécommunications, elle coordonne les activités administratives et les projets de l'association.",
      avatar: "/placeholder.svg"
    }
  ];

  // Données de démonstration pour les partenaires
  const partners = [
    {
      id: 1,
      name: "Université Marien Ngouabi",
      type: "Académique",
      logo: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Barreau de Brazzaville",
      type: "Institutionnel",
      logo: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Ministère de l'Économie Numérique",
      type: "Gouvernemental",
      logo: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Africa Legal Tech",
      type: "ONG",
      logo: "/placeholder.svg"
    },
    {
      id: 5,
      name: "Internet Society Congo",
      type: "Association",
      logo: "/placeholder.svg"
    },
    {
      id: 6,
      name: "Congo Business Network",
      type: "Privé",
      logo: "/placeholder.svg"
    }
  ];

  // Données de démonstration pour les FAQ
  const faqs = [
    {
      question: "Quels sont les objectifs de l'ACDN?",
      answer: "L'ACDN a pour objectifs de promouvoir le droit numérique au Congo, former les professionnels et étudiants, sensibiliser le public aux enjeux juridiques du numérique, et contribuer à l'élaboration de politiques publiques adaptées aux défis numériques."
    },
    {
      question: "Comment devenir membre de l'ACDN?",
      answer: "Vous pouvez devenir membre en remplissant le formulaire d'adhésion disponible sur notre site web et en vous acquittant de la cotisation annuelle. L'adhésion est ouverte aux juristes, avocats, étudiants en droit, professionnels du numérique et toute personne intéressée par le droit numérique."
    },
    {
      question: "Les formations de l'ACDN sont-elles certifiantes?",
      answer: "Oui, les formations longues de l'ACDN sont sanctionnées par un certificat reconnu par nos partenaires académiques et institutionnels. Ces certificats attestent des compétences acquises en droit numérique et peuvent valoriser votre parcours professionnel."
    },
    {
      question: "L'ACDN propose-t-elle des services de conseil juridique?",
      answer: "L'ACDN n'offre pas directement de services de conseil juridique. Cependant, nous pouvons vous orienter vers des professionnels qualifiés parmi nos membres. Nous organisons également des permanences juridiques gratuites lors de certains événements."
    },
    {
      question: "Comment l'ACDN est-elle financée?",
      answer: "L'ACDN est financée par les cotisations de ses membres, des subventions publiques, des partenariats avec des organisations privées et publiques, ainsi que par des dons. Nous maintenons une transparence totale sur nos sources de financement."
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">À propos de l'ACDN</h1>
            <p className="text-gray-600">
              L'Association Congolaise du Droit Numérique (ACDN) est une organisation à but non lucratif 
              dédiée à la promotion et au développement du droit numérique au Congo.
            </p>
          </div>

          <div className="mb-16">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Notre Mission</h2>
                <p className="text-gray-600 mb-4">
                  Fondée en 2018, l'ACDN a pour mission de promouvoir la compréhension et l'application du droit numérique au Congo, 
                  en formant les professionnels, en sensibilisant le public et en contribuant à l'élaboration de politiques 
                  publiques adaptées à l'ère numérique.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                    <BookOpen size={36} className="text-acdn-blue mb-2" />
                    <h3 className="font-semibold mb-1">Formation</h3>
                    <p className="text-center text-gray-600 text-sm">Formation et sensibilisation au droit numérique</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                    <Scale size={36} className="text-acdn-blue mb-2" />
                    <h3 className="font-semibold mb-1">Expertise</h3>
                    <p className="text-center text-gray-600 text-sm">Expertise juridique et conseils aux institutions</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                    <FileText size={36} className="text-acdn-blue mb-2" />
                    <h3 className="font-semibold mb-1">Recherche</h3>
                    <p className="text-center text-gray-600 text-sm">Recherche et publications juridiques</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                    <Award size={36} className="text-acdn-blue mb-2" />
                    <h3 className="font-semibold mb-1">Promotion</h3>
                    <p className="text-center text-gray-600 text-sm">Promotion du droit numérique au Congo</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/placeholder.svg" 
                  alt="ACDN en action" 
                  className="rounded-lg shadow-md w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="team" className="mb-16">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="team">Notre Équipe</TabsTrigger>
              <TabsTrigger value="partners">Partenaires</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            {/* Onglet Équipe */}
            <TabsContent value="team">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member) => (
                  <Card key={member.id} className="text-center hover:shadow-md transition-shadow">
                    <CardHeader>
                      <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}{member.name.split(' ')[1].charAt(0)}</AvatarFallback>
                      </Avatar>
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription className="font-medium text-acdn-blue">
                        {member.role}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link to="/communaute">
                  <Button variant="outline">Voir tous les membres</Button>
                </Link>
              </div>
            </TabsContent>

            {/* Onglet Partenaires */}
            <TabsContent value="partners">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {partners.map((partner) => (
                  <div key={partner.id} className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="h-20 w-20 object-contain mx-auto mb-4"
                    />
                    <h3 className="font-semibold text-sm">{partner.name}</h3>
                    <span className="text-xs text-gray-500">{partner.type}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <p className="text-gray-600 max-w-2xl mx-auto mb-4">
                  Intéressé par un partenariat avec l'ACDN? Contactez-nous pour discuter des opportunités de collaboration.
                </p>
                <Button>Devenir partenaire</Button>
              </div>
            </TabsContent>

            {/* Onglet FAQ */}
            <TabsContent value="faq">
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="text-center mt-10">
                  <p className="text-gray-600 mb-4">
                    Vous avez d'autres questions? N'hésitez pas à nous contacter.
                  </p>
                  <Link to="/contact">
                    <Button>Nous contacter</Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Contactez-nous</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <MapPin size={24} className="text-acdn-blue" />
                </div>
                <h3 className="font-semibold mb-2">Adresse</h3>
                <p className="text-gray-600">
                  Avenue de la Paix<br />
                  Brazzaville, République du Congo
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <Phone size={24} className="text-acdn-blue" />
                </div>
                <h3 className="font-semibold mb-2">Téléphone</h3>
                <p className="text-gray-600">
                  <a href="tel:+242064000000" className="hover:text-acdn-blue transition-colors">
                    +242 06 400 00 00
                  </a>
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <Mail size={24} className="text-acdn-blue" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">
                  <a href="mailto:contact@acdn.org" className="hover:text-acdn-blue transition-colors">
                    contact@acdn.org
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-acdn-blue text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Rejoignez l'ACDN aujourd'hui</h2>
            <p className="max-w-2xl mx-auto mb-6">
              Devenez membre de notre association et contribuez au développement du droit numérique au Congo. 
              Accédez à des ressources exclusives, participez à nos événements et rejoignez notre réseau de professionnels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/inscription">
                <Button variant="secondary" className="bg-white text-acdn-blue hover:bg-gray-100">
                  Devenir membre
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
