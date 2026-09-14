import React from "react";

interface KanafLogoProps {
  variant?: "light" | "dark" | "maroon";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const KanafLogo: React.FC<KanafLogoProps> = ({
  variant = "maroon",
  className = "",
  size = "md",
}) => {
  const isLight = variant === "light";
  const strokeColor = isLight ? "#FAF7F2" : "#5C0D20";
  const textColor = isLight ? "#FAF7F2" : "#4A0817";
  const subtextColor = isLight ? "#DCEAF4" : "#73132B";

  const sizeClasses = {
    sm: "h-9",
    md: "h-12",
    lg: "h-16",
  }[size];

  return (
    <div id="kanaf-brand-logo" className={`flex items-center gap-3 select-none ${className}`}>
      {/* Handcrafted Brand Emblem matching the authentic Kanaf logo */}
      <svg
        viewBox="0 0 100 120"
        className={`${sizeClasses} w-auto transition-transform duration-300 hover:scale-105`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Arch outline */}
        <path
          d="M10 55 C 10 25, 90 25, 90 55 L 90 105 C 90 112, 85 116, 78 116 L 22 116 C 15 116, 10 112, 10 105 Z"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Inner thin arch */}
        <path
          d="M17 56 C 17 31, 83 31, 83 56 L 83 103 C 83 108, 80 110, 75 110 L 25 110 C 20 110, 17 108, 17 103 Z"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeDasharray="3 2"
          opacity="0.7"
        />
        {/* Wheat Sheaf (Left) */}
        <path
          d="M32 68 C 29 60, 24 54, 20 50 C 26 49, 31 52, 33 58 C 30 52, 27 44, 25 38 C 32 39, 36 45, 37 50 C 37 42, 36 34, 38 27 C 42 32, 43 40, 42 46"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Coffee Beans at top */}
        <ellipse cx="44" cy="22" rx="4" ry="6" transform="rotate(-25 44 22)" stroke={strokeColor} strokeWidth="1.8" />
        <path d="M42 18 C 45 22, 43 25, 46 26" stroke={strokeColor} strokeWidth="1.4" strokeLinecap="round" />
        <ellipse cx="56" cy="20" rx="3.5" ry="5.5" transform="rotate(20 56 20)" stroke={strokeColor} strokeWidth="1.8" />
        <path d="M55 17 C 57 20, 56 23, 58 24" stroke={strokeColor} strokeWidth="1.4" strokeLinecap="round" />
        {/* Steaming Coffee Cup (Right) */}
        <path
          d="M52 64 L 72 64 C 72 73, 67 79, 62 79 C 57 79, 52 73, 52 64 Z"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Cup handle */}
        <path
          d="M72 66 C 77 66, 78 72, 72 74"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Steam scrolls */}
        <path
          d="M57 60 C 56 55, 60 52, 58 46"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M65 59 C 64 54, 68 50, 66 44"
          stroke={strokeColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Furrowed bakery field lines at base */}
        <path
          d="M17 88 C 30 84, 70 84, 83 88"
          stroke={strokeColor}
          strokeWidth="1.6"
        />
        <path
          d="M18 97 C 32 93, 68 93, 82 97"
          stroke={strokeColor}
          strokeWidth="1.6"
        />
        <path
          d="M20 104 C 35 101, 65 101, 80 104"
          stroke={strokeColor}
          strokeWidth="1.6"
        />
      </svg>

      <div className="flex flex-col">
        <span
          className="font-serif font-bold tracking-wider text-xl sm:text-2xl leading-none"
          style={{ color: textColor }}
        >
          KANAF
        </span>
        <span
          className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium mt-1"
          style={{ color: subtextColor }}
        >
          Cafe & Bakery
        </span>
      </div>
    </div>
  );
};
