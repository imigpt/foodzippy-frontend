import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection: yellow at top, red when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Yellow (#F7C150) at top, Red (#E82335) when scrolled
  const bgColor = isScrolled ? '#E82335' : '#F7C150';
  const textColor = isScrolled ? "text-white" : "text-black";
  const iconColor = isScrolled ? "white" : "black";
  const logoSrc = isScrolled ? "/foodzip1.png" : "/foodzip2.png";

  return (
    <nav
      className="sticky top-0 z-50 transition-colors duration-500"
      style={{ backgroundColor: bgColor }}
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
                  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48" viewBox="0 0 160 48"><rect width="100%" height="100%" fill="%23F59E0B" rx="8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="\"Century Gothic\",CenturyGothic,AppleGothic,sans-serif" font-size="18" fill="white">Foodzippy</text></svg>'
                );
              }}
            />
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">

            <button
              onClick={() => navigate('/')}
              className={`${textColor} hover:${textColor} font-century gothic hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-300 font-medium`}
            >
              Home
            </button>

            <button
              onClick={() => navigate('/our-story')}
              className={`${textColor} hover:${textColor} font-century gothic font-medium hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-300`}
            >
              Our Story
            </button>

            <button
              onClick={() => navigate('/service-registration')}
              className={`${textColor} hover:${textColor} font-century gothic hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-300 font-medium`}
            >
              Vendor Registration
            </button>

            <button
              onClick={() => {
                if (window.location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => {
                    const el = document.getElementById('restaurants');
                    if (el) window.scrollTo({ top: el.offsetTop, left: 0, behavior: 'auto' });
                    else window.location.hash = '#restaurants';
                  }, 50);
                } else {
                  const el = document.getElementById('restaurants');
                  if (el) window.scrollTo({ top: el.offsetTop, left: 0, behavior: 'auto' });
                  else window.location.hash = '#restaurants';
                }
                setIsMobileMenuOpen(false);
              }}
              className={`${textColor} hover:${textColor} font-century gothic hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-300 font-medium`}
            >
              Restaurants
            </button>
            <button
              onClick={() => navigate('/franchise-inquiry')}
              className={`${textColor} hover:${textColor} font-century gothic hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-300 font-medium`}
            >
              Franchises
            </button>

            <button
              onClick={() => navigate('/investor-inquiry')}
              className={`${textColor} hover:${textColor} font-century gothic hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-300 font-medium`}
            >
              Investors
            </button>

            <button
              onClick={() => navigate('/student-cashback')}
              className={`${textColor} hover:${textColor} font-century gothic hover:bg-white/20 px-5 py-2 rounded-full transition-all duration-200 font-medium`}
            >
              Student Cashback
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
                navigate('/');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-white hover:bg-yellow-500 rounded-md font-medium"
            >
              Home
            </button>

            <button
              onClick={() => {
                navigate('/our-story');
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

            <button
              onClick={() => {
                if (window.location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => {
                    const el = document.getElementById('restaurants');
                    if (el) window.scrollTo({ top: el.offsetTop, left: 0, behavior: 'auto' });
                    else window.location.hash = '#restaurants';
                  }, 50);
                } else {
                  const el = document.getElementById('restaurants');
                  if (el) window.scrollTo({ top: el.offsetTop, left: 0, behavior: 'auto' });
                  else window.location.hash = '#restaurants';
                }
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-white hover:bg-yellow-500 rounded-md font-medium"
            >
              Restaurants
            </button>

            <button
              onClick={() => {
                navigate('/franchise-inquiry');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-white hover:bg-yellow-500 rounded-md font-medium"
            >
              Franchises
            </button>
            <button
              onClick={() => {
                navigate('/investor-inquiry');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-white hover:bg-yellow-500 rounded-md font-medium"
            >
              Investor
            </button>

            {/* <button className="w-full px-3 py-2 text-white hover:bg-yellow-500 rounded-md font-medium flex items-center gap-2">
              <MapPin size={20} color="white" />
              Choose your city
            </button> */}

            <button
              onClick={() => {
                navigate('/careers');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-white hover:bg-yellow-500 rounded-md font-medium"
            >
              Careers
            </button>

            <button
              onClick={() => {
                navigate('/student-cashback');
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-white text-orange-500 px-6 py-2 rounded-full hover:bg-yellow-100 transition-colors font-medium active:bg-white focus:bg-white"
            >
              Student Cashback
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
