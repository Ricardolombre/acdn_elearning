
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

// Définition du schéma de validation
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  subject: z.string().min(1, { message: "Veuillez sélectionner un sujet" }),
  message: z.string().min(10, { message: "Le message doit comporter au moins 10 caractères" })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialisation du formulaire avec React Hook Form et Zod
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  // Gestion de la soumission du formulaire
  const onSubmit = (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Simulation d'une requête API
    setTimeout(() => {
      console.log("Form data:", data);
      
      // Afficher une notification de succès
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      
      // Réinitialiser le formulaire
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-gray-600">
              Vous avez des questions sur l'ACDN ou nos activités? 
              N'hésitez pas à nous contacter, nous sommes là pour vous aider.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="votre.email@exemple.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sujet</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un sujet" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="adhesion">Adhésion à l'ACDN</SelectItem>
                            <SelectItem value="formation">Informations sur les formations</SelectItem>
                            <SelectItem value="evenement">Événements et conférences</SelectItem>
                            <SelectItem value="partenariat">Proposition de partenariat</SelectItem>
                            <SelectItem value="autre">Autre demande</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Votre message ici..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                  </Button>
                </form>
              </Form>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>
              
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-gray-100 rounded-full p-3 mr-4">
                      <MapPin className="text-acdn-blue h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-gray-600">
                        Avenue de la Paix<br />
                        Brazzaville, République du Congo
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-100 rounded-full p-3 mr-4">
                      <Phone className="text-acdn-blue h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <p className="text-gray-600">
                        <a href="tel:+242064000000" className="hover:text-acdn-blue transition-colors">
                          +242 06 400 00 00
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-100 rounded-full p-3 mr-4">
                      <Mail className="text-acdn-blue h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">
                        <a href="mailto:contact@acdn.org" className="hover:text-acdn-blue transition-colors">
                          contact@acdn.org
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-100 rounded-full p-3 mr-4">
                      <Clock className="text-acdn-blue h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Heures d'ouverture</h3>
                      <p className="text-gray-600">
                        Lundi - Vendredi: 8h30 - 17h00<br />
                        Samedi: 9h00 - 12h00<br />
                        Dimanche: Fermé
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-8">
                <h3 className="font-semibold mb-4">Carte</h3>
                <div className="bg-gray-300 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Carte interactive à intégrer ici</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-acdn-blue text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Rejoignez notre newsletter</h2>
            <p className="max-w-2xl mx-auto mb-6">
              Restez informé des dernières actualités du droit numérique au Congo, 
              de nos événements et de nos nouvelles formations.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
              <Input 
                type="email" 
                placeholder="Votre adresse email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button variant="secondary" className="bg-white text-acdn-blue hover:bg-gray-100">
                S'abonner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
