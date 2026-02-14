import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, MapPin } from 'lucide-react';

interface NavbarProps {
  onOpenStoryPanel: () => void;
}

function Navbar({ onOpenStoryPanel }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Background colors (RED first, YELLOW second)
  const colors = ['#E82335', '#F7C150'];
  const [bgIndex, setBgIndex] = useState(0);

  // AUTO CHANGE BG
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((i) => (i + 1) % colors.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // AUTO TEXT COLOR (RED BG → WHITE TEXT, YELLOW BG → BLACK TEXT)
  const textColor = bgIndex === 0 ? "text-white" : "text-black";
  const iconColor = bgIndex === 0 ? "white" : "black";

  // Pick the correct logo based on background color
  const logoSrc = bgIndex === 1 ? "/foodzip2.png" : "/foodzip1.png";

  return (
    <nav
      className="sticky top-0 z-50 transition-colors duration-500"
      style={{ backgroundColor: colors[bgIndex] }}
    >
      <div className="max-w-8xl mx-auto px-6 sm:px-7 lg:px-9">
        <div className="flex justify-between items-center h-24 py-2">

          {/* LOGO */}
          <div className="flex-shrink-0">
            <img
              src={logoSrc}
              alt="Foodzippy logo"
              className="h-28 sm:h-32 md:h-40 w-auto object-contain transition-all duration-300"
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.onerror = null;
                el.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48" viewBox="0 0 160 48"><rect width="100%" height="100%" fill="%23F59E0B" rx="8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="white">Foodzippy</text></svg>'
                );
              }}
            />
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">

            <button
              onClick={onOpenStoryPanel}
              className={`${textColor} hover:${textColor} font-montserrat font-medium hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-300`}
            >
              Our Story
            </button>

            <button
              onClick={() => navigate('/service-registration')}
              className={`${textColor} hover:${textColor} font-montserrat hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-300 font-medium`}
            >
              Vendor Registration
            </button>

            <a
              href="#restaurants"
              className={`${textColor} hover:${textColor} font-montserrat hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-300 font-medium`}
            >
              Restaurants
            </a>
            <button
              onClick={() => navigate('/franchise-inquiry')}
              className={`${textColor} hover:${textColor} font-montserrat hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-300 font-medium`}
            >
              Franchises
            </button>

            <a
              href="#how-it-works"
              className={`${textColor} hover:${textColor} font-montserrat hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-300 font-medium`}
            >
              How It Works
            </a>

            <button
              className={`${textColor} hover:${textColor} font-montserrat hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-200 font-medium flex items-center gap-2`}
            >
              <MapPin size={20} color={iconColor} />
              Choose your city
            </button>

            <button
              className={`${textColor} hover:${textColor} font-montserrat hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-200 font-medium`}
            >
              Order Soon
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={textColor}
            >
              {isMobileMenuOpen ? <X size={24} color={iconColor} /> : <Menu size={24} color={iconColor} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-yellow-200 to-orange-500 border-t border-yellow-500">
          <div className="px-4 pt-2 pb-3 space-y-1">

            <button
              onClick={() => {
                onOpenStoryPanel();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-white hover:bg-yellow-500 rounded-md font-medium"
            >
              Our Story
            </button>

            <button
              onClick={() => {
                navigate('/service-registration');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-white hover:bg-yellow-500 rounded-md font-medium"
            >
              Vendor Register
            </button>

            <a href="#restaurants" className="block px-3 py-2 text-white hover:bg-yellow-500 rounded-md font-medium">
              Restaurants
            </a>

            <button
              onClick={() => {
                navigate('/franchise-inquiry');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-white hover:bg-yellow-500 rounded-md font-medium"
            >
              Franchises
            </button>
            <a href="#how-it-works" className="block px-3 py-2 text-white hover:bg-yellow-500 rounded-md font-medium">
              How It Works
            </a>

            <button className="w-full px-3 py-2 text-white hover:bg-yellow-500 rounded-md font-medium flex items-center gap-2">
              <MapPin size={20} color="white" />
              Choose your city
            </button>

            <button className="w-full bg-white text-orange-500 px-6 py-2 rounded-full hover:bg-yellow-100 transition-colors font-medium active:bg-white focus:bg-white">
              Order soon
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
