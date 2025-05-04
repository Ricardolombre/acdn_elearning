
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface CourseFilterProps {
  onFilterChange: (filters: { 
    search: string; 
    category: string; 
    level: string;
    duration: string;
  }) => void;
}

const CourseFilter = ({ onFilterChange }: CourseFilterProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ search: e.target.value, category, level, duration });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value === "all" ? "" : value);
    onFilterChange({ search, category: value === "all" ? "" : value, level, duration });
  };

  const handleLevelChange = (value: string) => {
    setLevel(value === "all" ? "" : value);
    onFilterChange({ search, category, level: value === "all" ? "" : value, duration });
  };

  const handleDurationChange = (value: string) => {
    setDuration(value === "all" ? "" : value);
    onFilterChange({ search, category, level, duration: value === "all" ? "" : value });
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setLevel("");
    setDuration("");
    onFilterChange({ search: "", category: "", level: "", duration: "" });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
      <h2 className="text-xl font-semibold mb-4">Filtrer les cours</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Input
            placeholder="Rechercher un cours..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
        
        <Select value={category === "" ? "all" : category} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="fondamentaux">Fondamentaux</SelectItem>
            <SelectItem value="conformite">Conformité</SelectItem>
            <SelectItem value="securite">Sécurité</SelectItem>
            <SelectItem value="propriete">Propriété Intellectuelle</SelectItem>
            <SelectItem value="commerce">Commerce Électronique</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={level === "" ? "all" : level} onValueChange={handleLevelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            <SelectItem value="debutant">Débutant</SelectItem>
            <SelectItem value="intermediaire">Intermédiaire</SelectItem>
            <SelectItem value="avance">Avancé</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={duration === "" ? "all" : duration} onValueChange={handleDurationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Durée" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les durées</SelectItem>
            <SelectItem value="court">Court (&lt; 4 semaines)</SelectItem>
            <SelectItem value="moyen">Moyen (4-8 semaines)</SelectItem>
            <SelectItem value="long">Long (&gt; 8 semaines)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button variant="outline" onClick={resetFilters} className="text-sm">
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
};

export default CourseFilter;
