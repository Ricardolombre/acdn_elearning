
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink } from "lucide-react";

export interface ResourceType {
  id: number;
  title: string;
  description: string;
  type: "Article" | "Loi" | "Étude de cas" | "Guide" | "Document";
  category: string;
  download_url?: string;
  external_url?: string;
  date: string;
}

interface ResourceCardProps {
  resource: ResourceType;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const getTypeIcon = () => {
    return <FileText className="h-10 w-10 text-acdn-blue opacity-80" />;
  };

  const getResourceTypeColor = (type: string) => {
    const colors = {
      'Article': 'bg-blue-100 text-blue-800 border-blue-200',
      'Loi': 'bg-red-100 text-red-800 border-red-200',
      'Étude de cas': 'bg-green-100 text-green-800 border-green-200',
      'Guide': 'bg-purple-100 text-purple-800 border-purple-200',
      'Document': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className="h-full flex flex-col card-hover">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={getResourceTypeColor(resource.type)}>
            {resource.type}
          </Badge>
          <span className="text-sm text-gray-500">{resource.date}</span>
        </div>
        <div className="flex items-center space-x-3 mt-3">
          {getTypeIcon()}
          <CardTitle className="text-xl">{resource.title}</CardTitle>
        </div>
        <CardDescription className="mt-2">
          Catégorie: {resource.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{resource.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        {resource.download_url && (
          <Button variant="outline" className="flex items-center space-x-1">
            <Download size={16} />
            <span>Télécharger</span>
          </Button>
        )}
        {resource.external_url && (
          <Button variant="outline" className="flex items-center space-x-1 ml-auto" asChild>
            <a href={`https://${resource.external_url}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} />
              <span>Consulter</span>
            </a>
          </Button>        
        )}
        {!resource.download_url && !resource.external_url && (
          <Button variant="outline" className="w-full">Voir le détail</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
