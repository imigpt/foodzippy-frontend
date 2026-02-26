import { useEffect, useState } from "react";

function Hero() {
  const images = [
    "/new.jpeg",
    "/new4.jpeg",
    "/new2.jpeg",
    "/new5.jpeg",
    // "/food-image2.jpg",
    // "/food-image3.jpg",
    // "/food-image4.jpg",
    // "/food-image5.jpg",
    // "/food-image6.jpg",
    // "/food-image7.jpg",
    // "/food-image8.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Preload images
  useEffect(() => {
    const load = async () => {
      const promises = images.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
          })
      );
      await Promise.all(promises);
      setLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const id = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(id);
  }, [loaded]);

  // Handle transition end to create infinite loop
  useEffect(() => {
    if (current === images.length) {
      // We've reached the duplicate first image
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(0);
      }, 1000); // Wait for transition to complete
      
      setTimeout(() => {
        setIsTransitioning(true);
      }, 1050); // Re-enable transition after reset
    }
  }, [current, images.length]);

  return (
    <section className="relative w-full h-screen overflow-hidden text-white">

      {/* SLIDES */}
      <div
        className="absolute inset-0 flex ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: isTransitioning ? 'transform 1000ms ease-in-out' : 'none',
          willChange: "transform",
          contain: "layout",
        }}
      >
        {images.map((src, i) => (
          <img
            key={`img-${i}`}
            src={src}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-full object-cover flex-shrink-0"
            draggable="false"
          />
        ))}
        {/* Duplicate first image at the end for seamless loop */}
        <img
          key="img-duplicate"
          src={images[0]}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover flex-shrink-0"
          draggable="false"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* TEXT CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center mt-28">
        <h1 className="font-century-gothic text-[#F7C150] text-5xl sm:text-6xl md:text-7xl font-bold">
            Delivering L
  <span className="text-red-500">❤</span>
  ve to Students
        </h1>

        <p className="font-century-gothic text-3xl sm:text-4xl md:text-5xl mt-6 font-semibold">
          Fresh food, lowest commissions
        </p>

        {/* <p className="font-century-gothic text-3xl sm:text-4xl md:text-5xl mt-10 font-semibold">
          Coming soon to your campus!
        </p> */}
        <br></br>
        
        <p className="font-century gothic text-[#F7C150] text-5xl sm:text-6xl md:text-8xl mt-6 font-semibold">
        Launching soon 
        </p>
        <p className="font-century-gothic text-3xl sm:text-4xl md:text-5xl mt-8 font-semibold">
         in Agra, Noida & more cites
        </p>
       {/* APP STORE BUTTONS */}
       <br></br>
       
<div className="mt-12 flex items-center justify-center gap-6">
  <a href="#" className="inline-block">
    <img
      src="/google-play.png"
      alt="Get it on Google Play"
      className="h-24 w-auto transition-transform duration-300 hover:scale-110"
      draggable="false"
    />
  </a>

  <a href="#" className="inline-block">
    <img
      src="/app-store.png"
      alt="Download on the App Store"
      className="h-24 w-auto transition-transform duration-300 hover:scale-110"
      draggable="false"
    />
  </a>
</div>

      </div>
    </section>
  );
}

export default Hero;
