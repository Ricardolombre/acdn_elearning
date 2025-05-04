
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ResourceList from "@/components/resources/ResourceList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Ressources Juridiques</h1>
            <p className="text-gray-600">
              Accédez à notre bibliothèque de ressources sur le droit numérique au Congo : 
              textes de loi, articles, études de cas et guides pratiques.
            </p>
            
            <div className="relative mt-8 max-w-md mx-auto">
              <Input
                placeholder="Rechercher une ressource..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-4 mb-8">
              <TabsTrigger value="all">Tout</TabsTrigger>
              <TabsTrigger value="laws">Lois</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="cases">Jurisprudence</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ResourceList />
            </TabsContent>
            <TabsContent value="laws">
              <div className="text-center py-12">
                <p className="text-gray-600">Contenu des lois à implémenter</p>
              </div>
            </TabsContent>
            <TabsContent value="guides">
              <div className="text-center py-12">
                <p className="text-gray-600">Contenu des guides à implémenter</p>
              </div>
            </TabsContent>
            <TabsContent value="cases">
              <div className="text-center py-12">
                <p className="text-gray-600">Contenu de jurisprudence à implémenter</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;
