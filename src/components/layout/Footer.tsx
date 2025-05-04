
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-acdn-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ACDN</h3>
            <p className="text-white/80 mb-4">
              Association Congolaise du Droit Numérique, dédiée à la formation et à la sensibilisation 
              au droit numérique au Congo.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white hover:text-acdn-lightBlue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-white hover:text-acdn-lightBlue transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" className="text-white hover:text-acdn-lightBlue transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:contact@acdn.org" className="text-white hover:text-acdn-lightBlue transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Liens Utiles</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cours" className="text-white/80 hover:text-white transition-colors">
                  Nos Cours
                </Link>
              </li>
              <li>
                <Link to="/ressources" className="text-white/80 hover:text-white transition-colors">
                  Ressources Juridiques
                </Link>
              </li>
              <li>
                <Link to="/communaute" className="text-white/80 hover:text-white transition-colors">
                  Communauté
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-white/80 hover:text-white transition-colors">
                  À propos de nous
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-white/80 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/politique-de-confidentialite" className="text-white/80 hover:text-white transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/conditions-utilisation" className="text-white/80 hover:text-white transition-colors">
                  Conditions d'Utilisation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contactez-nous</h3>
            <address className="text-white/80 not-italic">
              <p>Brazzaville, République du Congo</p>
              <p className="mt-2">
                <a href="mailto:contact@acdn.org" className="hover:text-white transition-colors">
                  contact@acdn.org
                </a>
              </p>
              <p className="mt-2">
                <a href="tel:+242064000000" className="hover:text-white transition-colors">
                  +242 06 400 00 00
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; {currentYear} Association Congolaise du Droit Numérique. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
