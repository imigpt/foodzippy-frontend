import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isActive = (path: string) => location.pathname === path;
  const navButtonClass = (active: boolean) =>
    `${textColor} font-century gothic px-5 py-2 rounded-full transition-all duration-300 font-medium ${
      active
        ? isScrolled
          ? 'bg-white/20 ring-1 ring-white/30'
          : 'bg-black/10 ring-1 ring-black/20'
        : 'hover:bg-white/20'
    }`;
  const mobileButtonClass = (active: boolean) =>
    `block w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${
      active ? 'bg-yellow-600 text-white' : 'text-white hover:bg-yellow-500'
    }`;

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
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-8">

            <button
              onClick={() => navigate('/')}
              className={navButtonClass(isActive('/'))}
            >
              Home
            </button>

            <button
              onClick={() => navigate('/our-story')}
              className={navButtonClass(isActive('/our-story'))}
            >
              Our Story
            </button>

            <button
              onClick={() => navigate('/service-registration')}
              className={navButtonClass(isActive('/service-registration'))}
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
              className={navButtonClass(isActive('/') && location.hash === '#restaurants')}
            >
              Restaurants
            </button>
            <button
              onClick={() => navigate('/franchise-inquiry')}
              className={navButtonClass(isActive('/franchise-inquiry'))}
            >
              Franchises
            </button>

            <button
              onClick={() => navigate('/investor-inquiry')}
              className={navButtonClass(isActive('/investor-inquiry'))}
            >
              Investors
            </button>

            <button
              onClick={() => navigate('/student-cashback')}
              className={navButtonClass(isActive('/student-cashback'))}
            >
              Student Cashback
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden">
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
        <div className="lg:hidden bg-gradient-to-r from-yellow-200 to-orange-500 border-t border-yellow-500">
          <div className="px-4 pt-2 pb-3 space-y-1">

            <button
              onClick={() => {
                navigate('/');
                setIsMobileMenuOpen(false);
              }}
              className={mobileButtonClass(isActive('/'))}
            >
              Home
            </button>

            <button
              onClick={() => {
                navigate('/our-story');
                setIsMobileMenuOpen(false);
              }}
              className={mobileButtonClass(isActive('/our-story'))}
            >
              Our Story
            </button>

            <button
              onClick={() => {
                navigate('/service-registration');
                setIsMobileMenuOpen(false);
              }}
              className={mobileButtonClass(isActive('/service-registration'))}
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
              className={mobileButtonClass(isActive('/') && location.hash === '#restaurants')}
            >
              Restaurants
            </button>

            <button
              onClick={() => {
                navigate('/franchise-inquiry');
                setIsMobileMenuOpen(false);
              }}
              className={mobileButtonClass(isActive('/franchise-inquiry'))}
            >
              Franchises
            </button>
            <button
              onClick={() => {
                navigate('/investor-inquiry');
                setIsMobileMenuOpen(false);
              }}
              className={mobileButtonClass(isActive('/investor-inquiry'))}
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
              className={mobileButtonClass(isActive('/careers'))}
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
