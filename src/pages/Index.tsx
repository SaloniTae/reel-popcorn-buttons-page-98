
import { useEffect, useRef } from "react";
import "../styles/landing-page.css";

const Index = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Set up intersection observer for fade-in animations
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    // Apply to all fade-in elements
    document.querySelectorAll('.fade-in-element').forEach((el) => {
      if (observerRef.current) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Preload images for better user experience
    const imagesToPreload = [
      "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg",
      "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/netflix-button.png",
      "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/prime-button.png",
      "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/crunchy-button.png",
      "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/film.png",
      "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/popcorn.png"
    ];
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[url('https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/film.png')] bg-no-repeat bg-cover opacity-5"></div>
      
      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen relative z-10">
        {/* Header with logo */}
        <header className="w-full flex flex-col items-center justify-center py-6 fade-in-element">
          <a 
            href="https://www.instagram.com/ott.on.rent?igsh=MWd5cHh5aHk3NGgxbQ==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-md group-hover:bg-blue-400/40 transition-all duration-300"></div>
            <img 
              src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
              alt="OTT ON RENT" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover relative z-10 logo-pulse shadow-lg"
            />
          </a>
          <h1 className="text-3xl md:text-4xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            OTT ON RENT
          </h1>
          <p className="text-gray-300 mt-2 text-center max-w-md">
            Premium streaming services at affordable prices
          </p>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center py-6 md:py-12">
          {/* Main CTA */}
          <div className="w-full max-w-md fade-in-element" style={{ transitionDelay: '100ms' }}>
            <a 
              href="https://t.me/ott_on_rent" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              <div className="bg-white rounded-full p-2 mr-4">
                <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-bold">BUY NOW</span>
            </a>
          </div>

          {/* Divider */}
          <div className="my-8 w-full max-w-xs flex items-center fade-in-element" style={{ transitionDelay: '200ms' }}>
            <div className="flex-1 h-[1px] bg-gray-700"></div>
            <span className="px-4 text-gray-400">OR</span>
            <div className="flex-1 h-[1px] bg-gray-700"></div>
          </div>

          {/* Streaming options */}
          <div className="w-full max-w-md space-y-4 fade-in-element" style={{ transitionDelay: '300ms' }}>
            {/* Netflix */}
            <a 
              href="https://t.me/ott_on_rent" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full bg-white rounded-xl p-3 flex justify-center items-center hover:shadow-lg transition-all duration-300 transform hover:scale-102"
            >
              <img 
                src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/netflix-button.png" 
                alt="Netflix" 
                className="h-8 md:h-10 object-contain" 
              />
            </a>
            
            {/* Prime */}
            <a 
              href="https://t.me/ott_on_rent" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-white rounded-xl p-3 flex justify-center items-center hover:shadow-lg transition-all duration-300 transform hover:scale-102" 
            >
              <img 
                src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/prime-button.png" 
                alt="Prime Video" 
                className="h-8 md:h-10 object-contain" 
              />
            </a>
            
            {/* Crunchyroll */}
            <a 
              href="https://t.me/ott_on_rent" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-white rounded-xl p-3 flex justify-center items-center hover:shadow-lg transition-all duration-300 transform hover:scale-102" 
            >
              <img 
                src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/crunchy-button.png" 
                alt="Crunchyroll" 
                className="h-8 md:h-10 object-contain" 
              />
            </a>
          </div>

          {/* How it works */}
          <div className="mt-10 text-center fade-in-element" style={{ transitionDelay: '400ms' }}>
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">How it works</h3>
            <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8 space-y-6 md:space-y-0">
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl w-full max-w-[180px] flex flex-col items-center">
                <div className="bg-blue-500/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-blue-400">1</span>
                </div>
                <p className="text-gray-300">START THE BOT</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl w-full max-w-[180px] flex flex-col items-center">
                <div className="bg-purple-500/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-purple-400">2</span>
                </div>
                <p className="text-gray-300">CHOOSE SLOT</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl w-full max-w-[180px] flex flex-col items-center">
                <div className="bg-pink-500/20 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-pink-400">3</span>
                </div>
                <p className="text-gray-300">PAY & GET ACCOUNT</p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-1/3 max-w-[280px] opacity-60 pointer-events-none z-0">
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/film.png" 
            alt="Film Reel" 
            className="w-full object-contain float-animation"
          />
        </div>
        
        <div className="absolute bottom-0 right-0 w-1/3 max-w-[280px] opacity-60 pointer-events-none z-0">
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/popcorn.png" 
            alt="Popcorn" 
            className="w-full object-contain float-animation"
            style={{ animationDelay: '1s' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
