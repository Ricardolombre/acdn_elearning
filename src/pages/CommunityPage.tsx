
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { MessageSquare, Users, CalendarDays, Award } from "lucide-react";

const CommunityPage = () => {
  // Données de démonstration pour les événements
  const events = [
    {
      id: 1,
      title: "Webinaire: La protection des données personnelles au Congo",
      date: "15 mai 2025",
      time: "14:00 - 16:00",
      location: "En ligne",
      description: "Rejoignez-nous pour un webinaire sur les enjeux de la protection des données personnelles au Congo et les obligations légales des entreprises.",
      speaker: "Dr. Marie Ndongo",
      registrations: 48
    },
    {
      id: 2,
      title: "Atelier pratique: Rédaction de contrats numériques",
      date: "22 mai 2025",
      time: "10:00 - 17:00",
      location: "Brazzaville, Centre de formation ACDN",
      description: "Un atelier d'une journée pour apprendre à rédiger des contrats numériques conformes à la législation congolaise.",
      speaker: "Me. Claire Moukoko",
      registrations: 23
    },
    {
      id: 3,
      title: "Conférence annuelle sur le droit numérique",
      date: "12-13 juin 2025",
      time: "9:00 - 18:00",
      location: "Brazzaville, Palais des Congrès",
      description: "La grande conférence annuelle de l'ACDN réunissant experts nationaux et internationaux du droit numérique.",
      speaker: "Divers intervenants",
      registrations: 156
    }
  ];

  // Données de démonstration pour les forums
  const forums = [
    {
      id: 1,
      title: "Protection des données et RGPD au Congo",
      posts: 87,
      lastActivity: "il y a 2 heures",
      participants: 34
    },
    {
      id: 2,
      title: "Conformité des sites web congolais",
      posts: 56,
      lastActivity: "il y a 5 heures",
      participants: 28
    },
    {
      id: 3,
      title: "Cybercriminalité et recours légaux",
      posts: 124,
      lastActivity: "hier",
      participants: 52
    },
    {
      id: 4,
      title: "E-commerce et fiscalité au Congo",
      posts: 43,
      lastActivity: "il y a 3 jours",
      participants: 19
    }
  ];

  // Données de démonstration pour les membres
  const members = [
    {
      id: 1,
      name: "Jean Bokamba",
      role: "Professeur de droit",
      avatar: "/placeholder.svg",
      contributions: 78,
      memberSince: "2020"
    },
    {
      id: 2,
      name: "Marie Ndongo",
      role: "Avocate spécialisée",
      avatar: "/placeholder.svg",
      contributions: 126,
      memberSince: "2019"
    },
    {
      id: 3,
      name: "Paul Okamba",
      role: "Consultant juridique",
      avatar: "/placeholder.svg",
      contributions: 52,
      memberSince: "2021"
    },
    {
      id: 4,
      name: "Suzanne Mwana",
      role: "Chercheuse",
      avatar: "/placeholder.svg",
      contributions: 94,
      memberSince: "2020"
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Notre Communauté</h1>
            <p className="text-gray-600">
              Rejoignez une communauté de professionnels, étudiants et passionnés 
              du droit numérique au Congo. Participez à nos événements, échangez sur nos 
              forums et contribuez à l'évolution du droit numérique dans notre pays.
            </p>
          </div>

          <Tabs defaultValue="events" className="mb-12">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="events">Événements</TabsTrigger>
              <TabsTrigger value="forums">Forums</TabsTrigger>
              <TabsTrigger value="members">Membres</TabsTrigger>
            </TabsList>

            {/* Onglet Événements */}
            <TabsContent value="events">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <Card key={event.id} className="h-full flex flex-col card-hover">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-acdn-lightBlue/20 text-acdn-blue border-acdn-lightBlue">
                          {event.location === "En ligne" ? "Webinaire" : "Présentiel"}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          <CalendarDays size={14} className="mr-1" />
                          {event.date}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription>
                        <span className="block">Par {event.speaker}</span>
                        <span className="block">{event.time} | {event.location}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600">{event.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t pt-4">
                      <div className="text-sm text-gray-500">
                        {event.registrations} inscrits
                      </div>
                      <Button>S'inscrire</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-10">
                <Button variant="outline">Voir tous les événements</Button>
              </div>
            </TabsContent>

            {/* Onglet Forums */}
            <TabsContent value="forums">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                {forums.map((forum, index) => (
                  <div 
                    key={forum.id} 
                    className={`p-6 ${index !== forums.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-acdn-blue transition-colors">
                          <a href="#">{forum.title}</a>
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 gap-4">
                          <span className="flex items-center">
                            <MessageSquare size={14} className="mr-1" />
                            {forum.posts} posts
                          </span>
                          <span className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {forum.participants} participants
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Dernière activité: {forum.lastActivity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <div className="bg-gray-100 rounded-lg p-8 max-w-xl mx-auto">
                  <h3 className="text-xl font-semibold mb-4">Rejoignez nos discussions</h3>
                  <p className="text-gray-600 mb-6">
                    Posez vos questions, partagez vos connaissances et échangez avec d'autres professionnels et étudiants en droit numérique au Congo.
                  </p>
                  <Button className="w-full md:w-auto">Accéder aux forums</Button>
                </div>
              </div>
            </TabsContent>

            {/* Onglet Membres */}
            <TabsContent value="members">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.map((member) => (
                  <Card key={member.id} className="text-center hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <Avatar className="w-20 h-20 mx-auto mb-2">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}{member.name.split(' ')[1].charAt(0)}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex justify-center gap-4 text-sm text-gray-500">
                        <div className="flex flex-col items-center">
                          <Badge className="mb-1">
                            <Award size={14} className="mr-1" />
                            {member.contributions}
                          </Badge>
                          <span>Contributions</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Badge variant="outline" className="mb-1">Depuis {member.memberSince}</Badge>
                          <span>Membre</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center pt-0">
                      <Button variant="outline" size="sm">Voir le profil</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-10">
                <div className="bg-gray-100 rounded-lg p-8 max-w-xl mx-auto">
                  <h3 className="text-xl font-semibold mb-4">Devenez membre de l'ACDN</h3>
                  <p className="text-gray-600 mb-6">
                    Rejoignez notre communauté de professionnels et d'étudiants passionnés par le droit numérique au Congo.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button>S'inscrire</Button>
                    <Button variant="outline">En savoir plus</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;
