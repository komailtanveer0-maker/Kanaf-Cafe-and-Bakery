import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Play, Pause, Volume2, VolumeX, Sparkles, MapPin } from "lucide-react";

interface HeroVideoProps {
  onViewMenu: () => void;
  onOrderNow: () => void;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  onViewMenu,
  onOrderNow,
}) => {
  // 1: Food Specialties, 2: Cafe Ambiance
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasVideoError, setHasVideoError] = useState(false);

  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const video2Ref = useRef<HTMLVideoElement | null>(null);

  // Crossfade timer: alternate between Video 1 and Video 2 every 9 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev === 1 ? 2 : 1));
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Sync play states
  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;

    if (v1 && v2) {
      if (isPlaying) {
        v1.play().catch(() => setHasVideoError(true));
        v2.play().catch(() => setHasVideoError(true));
      } else {
        v1.pause();
        v2.pause();
      }
    }
  }, [isPlaying]);

  // Sync mute states
  useEffect(() => {
    if (video1Ref.current) video1Ref.current.muted = isMuted;
    if (video2Ref.current) video2Ref.current.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#3B0612]"
    >
      {/* Background Video Layer 1: Food Highlights */}
      {!hasVideoError && (
        <video
          ref={video1Ref}
          src="/assets/kanaf_video1.mp4"
          poster="/assets/kanaf_hero_cinematic.jpg"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setHasVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            activeVideo === 1 ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      )}

      {/* Background Video Layer 2: Cafe Ambiance */}
      {!hasVideoError && (
        <video
          ref={video2Ref}
          src="/assets/kanaf_video2.mp4"
          poster="/assets/kanaf_cafe_interior.jpg"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setHasVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            activeVideo === 2 ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      )}

      {/* Fallback Static Image if autoplay or video is restricted */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          hasVideoError ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundImage: `url('/assets/kanaf_hero_cinematic.jpg')` }}
      />

      {/* Dark Transparent Maroon Overlay for perfect readability */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#3B0612] via-[#4A0817]/75 to-[#3B0612]/60 backdrop-brightness-90" />

      {/* Subtle decorative radial vignette */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/25 to-[#2D040E]/80 pointer-events-none" />

      {/* Content Box */}
      <div className="relative z-30 max-w-5xl mx-auto px-6 py-32 text-center flex flex-col items-center">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D7E7F2] text-xs uppercase tracking-[0.25em] font-semibold mb-6 shadow-inner animate-in fade-in duration-700">
          <Sparkles className="w-3.5 h-3.5 text-[#D7E7F2]" />
          <span>The Finest Cafe & Bakery in Chakwal</span>
        </div>

        {/* Big Brand Sub-header */}
        <p className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-[#FAF7F2]/90 mb-2 font-light tracking-wide">
          Welcome to
        </p>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight text-[#FAF7F2] drop-shadow-md mb-6 leading-tight">
          Taste Crafted <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FAF7F2] via-[#F4EDE2] to-[#D7E7F2]">
            With Care
          </span>
        </h1>

        {/* Supporting Paragraph */}
        <p className="max-w-2xl text-base sm:text-lg lg:text-xl text-[#F5EFE6]/90 font-normal leading-relaxed mb-10 text-balance">
          Freshly prepared café favourites, bakery treats and premium flavours in the heart of Chakwal.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            id="hero-view-menu-btn"
            onClick={onViewMenu}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FAF7F2] text-[#4A0817] font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-white hover:shadow-2xl hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <span>View Menu</span>
          </button>

          <button
            id="hero-order-now-btn"
            onClick={onOrderNow}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#8F1F39] text-[#FAF7F2] border border-[#D7E7F2]/30 font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-[#A32342] hover:shadow-2xl hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <span>Order Now</span>
          </button>
        </div>

        {/* Location chip */}
        <div className="mt-12 flex items-center gap-2 text-xs text-[#FAF7F2]/80 bg-black/25 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
          <MapPin className="w-3.5 h-3.5 text-[#D7E7F2]" />
          <span>Main Talagang Road, Chakwal, Pakistan</span>
        </div>
      </div>

      {/* Video Control Pills (Bottom Right) */}
      <div className="absolute bottom-8 right-6 z-30 hidden sm:flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/15 text-white text-xs">
        <button
          onClick={() => setActiveVideo(1)}
          className={`px-3 py-1 rounded-full font-medium transition-all ${
            activeVideo === 1
              ? "bg-[#FAF7F2] text-[#4A0817] shadow"
              : "text-white/80 hover:text-white"
          }`}
          title="Switch to Video 1: Culinary Specialties"
        >
          1. Specialties
        </button>
        <button
          onClick={() => setActiveVideo(2)}
          className={`px-3 py-1 rounded-full font-medium transition-all ${
            activeVideo === 2
              ? "bg-[#FAF7F2] text-[#4A0817] shadow"
              : "text-white/80 hover:text-white"
          }`}
          title="Switch to Video 2: Cafe Walkthrough"
        >
          2. Ambiance
        </button>
        <div className="h-4 w-px bg-white/20 mx-1" />
        <button
          onClick={togglePlay}
          className="p-1.5 rounded-full hover:bg-white/15 text-white/90"
          aria-label={isPlaying ? "Pause background video" : "Play background video"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-full hover:bg-white/15 text-white/90"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
        onClick={onViewMenu}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#D7E7F2]">
          Explore
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
};
