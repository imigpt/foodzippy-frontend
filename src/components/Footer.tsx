import { useNavigate } from 'react-router-dom';
import { Facebook, Instagram, LinkedinIcon, Mail } from 'lucide-react';
import { useState } from 'react';
import { API_BASE_URL } from '../utils/api';

const Footer = () => {
  const navigate = useNavigate();
  const [subEmail, setSubEmail] = useState('');
  const [subMsg, setSubMsg] = useState('');
  const [subError, setSubError] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  const handleSubscribe = async () => {
    setSubMsg('');
    setSubError(false);
    if (!subEmail || !/^\S+@\S+\.\S+$/.test(subEmail)) {
      setSubMsg('Please enter a valid email');
      setSubError(true);
      return;
    }
    setSubLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/subscribers/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: subEmail }),
        }
      );
      const data = await res.json();
      if (res.status === 409) {
        setSubMsg('Already subscribed');
        setSubError(false);
      } else if (data.success) {
        setSubMsg('Subscribed successfully');
        setSubError(false);
        setSubEmail('');
      } else {
        setSubMsg(data.message || 'Something went wrong');
        setSubError(true);
      }
    } catch {
      setSubMsg('Failed to subscribe. Try again.');
      setSubError(true);
    } finally {
      setSubLoading(false);
    }
  };

  const goToWhatWeOffer = () => {
    const scrollToSection = () => {
      const el = document.getElementById('what-we-offer');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (window.location.pathname !== '/') {
      navigate('/');
      // allow route change + render
      setTimeout(scrollToSection, 80);
    } else {
      scrollToSection();
    }
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 pt-6">

          {/* Logo + About */}
          <div className="flex flex-col justify-start">
            <div className="mb-4">
              <img
                src="/foodzippy-logo.png"
                alt="Foodzippy logo"
                className="h-28 sm:h-36 md:h-48 w-auto object-contain"
                loading="lazy"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  el.onerror = null;
                  el.src =
                      'data:image/svg+xml;utf8,' +
                      encodeURIComponent(
                        '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48" viewBox="0 0 160 48"><rect width="100%" height="100%" fill="%23F59E0B" rx="8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="\"Century Gothic\",CenturyGothic,AppleGothic,sans-serif" font-size="18" fill="white">Foodzippy</text></svg>'
                      );
                }}
              />
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              {/* Delivering love to students in Agra & Noida. Built for students. */}
            </p>

            {/* UPDATED SOCIAL ICONS */}
            {/* <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook size={20} className="text-black" />
              </a>

              <a
                href="#"
                className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-black" />
              </a>

              <a
                href="#"
                className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-200"
                aria-label="X (Twitter)"
              >
                <XIcon size={20} className="text-black" />
              </a>
            </div> */}
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-yellow-500 transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/our-story')}
                  className="text-gray-400 hover:text-yellow-500 transition-colors text-left"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/careers')}
                  className="text-gray-400 hover:text-yellow-500 transition-colors text-left"
                >
                  Careers
                </button>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={goToWhatWeOffer} className="text-gray-400 hover:text-yellow-500 transition-colors text-left">Food Delivery</button>
              </li>
              <li>
                <button onClick={goToWhatWeOffer} className="text-gray-400 hover:text-yellow-500 transition-colors text-left">Subscription</button>
              </li>
              <li>
                <button onClick={goToWhatWeOffer} className="text-gray-400 hover:text-yellow-500 transition-colors text-left">Take Away</button>
              </li>
              <li>
                <button onClick={goToWhatWeOffer} className="text-gray-400 hover:text-yellow-500 transition-colors text-left">Drive Through</button>
              </li>
              <li>
                <button onClick={goToWhatWeOffer} className="text-gray-400 hover:text-yellow-500 transition-colors text-left">Dine In</button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-gray-400 mb-4 text-sm">Subscribe to get updates and offers</p>
            <div className="flex gap-2">
              <input
  type="email"
  aria-label="Subscribe email"
  placeholder="Your email"
  value={subEmail}
  onChange={(e) => { setSubEmail(e.target.value); setSubMsg(''); }}
  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
  className="
    flex-1 px-4 py-3 
    bg-white 
    text-black 
    placeholder-gray-500 
    rounded-full 
    border border-gray-200
    shadow-sm
    focus:outline-none 
    focus:ring-2 
    focus:ring-yellow-400
  "
  />

              <button
                onClick={handleSubscribe}
                disabled={subLoading}
                aria-label="Subscribe"
                className="bg-yellow-500 p-3 rounded-full hover:bg-yellow-600 transition-colors disabled:opacity-50 shadow-md flex items-center justify-center"
              >
                <Mail size={20} />
              </button>
            </div>
            {subMsg && (
              <p className={`text-sm mt-2 ${subError ? 'text-red-400' : 'text-green-400'}`}>{subMsg}</p>
            )}
            {/* Social icons under subscribe */}
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook size={18} className="text-black" />
              </a>

              <a
                href="#"
                className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={18} className="text-black" />
              </a>

              <a
                href="#"
                className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={18} className="text-black" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="text-center md:text-left">Email us • info@foodzippy.co</div>
            <div>© 2025 <span className="brand-font">Foodzippy</span>. All Rights Reserved.</div>
          </div>

          {/* Tagline */}
          <div className="mt-6 text-center">
            <p className="inline-block px-6 py-3 rounded-full bg-white/5 text-white text-lg md:text-2xl font-semibold tracking-wide">
              <span className="text-white-400">Good Food</span>
              {/* <span className="mx-4 text-yellow-400">♥</span> */}
              {/* <span className="text-yellow-400">Good Heart</span> */}
              <span className="mx-4 text-yellow-400">♥</span>
              <span className="text-white-400">Good Mood</span>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
