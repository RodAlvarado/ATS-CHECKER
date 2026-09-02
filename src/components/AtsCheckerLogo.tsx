import React from "react";

interface AtsCheckerLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
}

export const AtsCheckerLogo: React.FC<AtsCheckerLogoProps> = ({
  className = "",
  size = "md",
  showSubtitle = true,
}) => {
  const dimensionMap = {
    sm: "w-10 h-10",
    md: "w-20 h-20",
    lg: "w-44 h-44",
    xl: "w-64 h-64",
  };

  const dimClass = dimensionMap[size] || dimensionMap.md;

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${dimClass} drop-shadow-xl`}
      >
        <defs>
          {/* Gold metallic gradients */}
          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBE08A" />
            <stop offset="25%" stopColor="#D99B26" />
            <stop offset="50%" stopColor="#FFF1B8" />
            <stop offset="75%" stopColor="#BA7B18" />
            <stop offset="100%" stopColor="#E2A638" />
          </linearGradient>

          <linearGradient id="goldInner" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9881A" />
            <stop offset="35%" stopColor="#FFDE79" />
            <stop offset="70%" stopColor="#B37311" />
            <stop offset="100%" stopColor="#FEE699" />
          </linearGradient>

          <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="45%" stopColor="#FDC435" />
            <stop offset="70%" stopColor="#D98E16" />
            <stop offset="100%" stopColor="#F5B92B" />
          </linearGradient>

          <linearGradient id="navyBanner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1A30" />
            <stop offset="50%" stopColor="#0E2344" />
            <stop offset="100%" stopColor="#071326" />
          </linearGradient>

          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#EFF6FF" />
          </linearGradient>

          <linearGradient id="greenGauge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 1. OUTER GOLD CIRCLE / RIM */}
        <circle cx="250" cy="250" r="235" fill="url(#goldRim)" stroke="#8A580B" strokeWidth="4" filter="url(#badgeShadow)" />
        <circle cx="250" cy="250" r="222" fill="#0B1B36" stroke="url(#goldInner)" strokeWidth="6" />

        {/* Outer Rim decorative screws / rivets */}
        <circle cx="250" cy="24" r="5" fill="#FFF1B8" stroke="#8A580B" strokeWidth="1.5" />
        <circle cx="250" cy="476" r="5" fill="#FFF1B8" stroke="#8A580B" strokeWidth="1.5" />
        <circle cx="24" cy="250" r="5" fill="#FFF1B8" stroke="#8A580B" strokeWidth="1.5" />
        <circle cx="476" cy="250" r="5" fill="#FFF1B8" stroke="#8A580B" strokeWidth="1.5" />

        {/* 2. INNER CONTENT CLIP */}
        <g clipPath="url(#badgeInnerClip)">
          <clipPath id="badgeInnerClip">
            <circle cx="250" cy="250" r="216" />
          </clipPath>

          {/* Sky background */}
          <rect x="25" y="25" width="450" height="450" fill="url(#skyGrad)" />

          {/* USA FLAG (Waving in background left & center) */}
          <g opacity="0.9">
            {/* Red and white stripes */}
            <path d="M25 50 Q130 90 250 50 T475 60 L475 220 Q360 210 250 220 T25 220 Z" fill="#B91C1C" />
            <path d="M25 70 Q130 105 250 70 T475 80 L475 100 Q360 90 250 90 T25 90 Z" fill="#FFFFFF" />
            <path d="M25 110 Q130 145 250 110 T475 120 L475 140 Q360 130 250 130 T25 130 Z" fill="#FFFFFF" />
            <path d="M25 150 Q130 185 250 150 T475 160 L475 180 Q360 170 250 170 T25 170 Z" fill="#FFFFFF" />
            <path d="M25 190 Q130 225 250 190 T475 200 L475 220 Q360 210 250 210 T25 210 Z" fill="#FFFFFF" />

            {/* Blue canton with stars */}
            <path d="M25 40 Q130 80 230 40 L230 170 Q130 190 25 170 Z" fill="#1E3A8A" />
            {/* Star dots */}
            <g fill="#FFFFFF">
              <circle cx="50" cy="65" r="3.5" /><circle cx="85" cy="68" r="3.5" /><circle cx="120" cy="70" r="3.5" /><circle cx="155" cy="68" r="3.5" /><circle cx="190" cy="65" r="3.5" />
              <circle cx="65" cy="90" r="3.5" /><circle cx="100" cy="93" r="3.5" /><circle cx="135" cy="95" r="3.5" /><circle cx="170" cy="93" r="3.5" /><circle cx="205" cy="90" r="3.5" />
              <circle cx="50" cy="115" r="3.5" /><circle cx="85" cy="118" r="3.5" /><circle cx="120" cy="120" r="3.5" /><circle cx="155" cy="118" r="3.5" /><circle cx="190" cy="115" r="3.5" />
              <circle cx="65" cy="140" r="3.5" /><circle cx="100" cy="143" r="3.5" /><circle cx="135" cy="145" r="3.5" /><circle cx="170" cy="143" r="3.5" />
            </g>
          </g>

          {/* CAPITOL DOME & SKYSCRAPERS */}
          <g>
            {/* City Skyscrapers right */}
            <rect x="365" y="115" width="22" height="150" fill="#0C4A6E" />
            <polygon points="365,115 376,85 387,115" fill="#0284C7" />
            <rect x="392" y="135" width="28" height="130" fill="#075985" />
            <rect x="424" y="160" width="26" height="105" fill="#0369A1" />
            <rect x="345" y="150" width="18" height="115" fill="#0369A1" opacity="0.8" />

            {/* Capitol Dome Center Top */}
            <g transform="translate(250, 110)">
              {/* Statuary summit & lantern */}
              <rect x="-3" y="-62" width="6" height="16" fill="#F8FAFC" />
              <circle cx="0" cy="-64" r="4.5" fill="#E2E8F0" />
              <path d="M-18 -46 Q0 -52 18 -46 L14 -32 L-14 -32 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
              {/* Main dome curvature */}
              <path d="M-36 -12 C-36 -38 36 -38 36 -12 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              {/* Columns arcade */}
              <rect x="-42" y="-12" width="84" height="24" fill="#E2E8F0" />
              <line x1="-34" y1="-12" x2="-34" y2="12" stroke="#475569" strokeWidth="2" />
              <line x1="-20" y1="-12" x2="-20" y2="12" stroke="#475569" strokeWidth="2" />
              <line x1="-6" y1="-12" x2="-6" y2="12" stroke="#475569" strokeWidth="2" />
              <line x1="8" y1="-12" x2="8" y2="12" stroke="#475569" strokeWidth="2" />
              <line x1="22" y1="-12" x2="22" y2="12" stroke="#475569" strokeWidth="2" />
              <line x1="36" y1="-12" x2="36" y2="12" stroke="#475569" strokeWidth="2" />
              {/* Pediment / Base */}
              <rect x="-48" y="12" width="96" height="12" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
            </g>
          </g>

          {/* LAPTOP WITH RESUME ANALYZER */}
          <g transform="translate(250, 205)">
            {/* Laptop Base */}
            <polygon points="-160,55 160,55 180,68 -180,68" fill="#94A3B8" stroke="#334155" strokeWidth="2" />
            <rect x="-40" y="55" width="80" height="4" rx="2" fill="#475569" />

            {/* Laptop Lid / Frame */}
            <rect x="-135" y="-105" width="270" height="160" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="3" />
            {/* Screen Inner */}
            <rect x="-127" y="-97" width="254" height="144" rx="4" fill="url(#screenGrad)" />

            {/* Left Screen: Resume info */}
            <rect x="-120" y="-90" width="105" height="130" rx="3" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <text x="-67" y="-76" fill="#0F172A" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="0.5">RESUME</text>
            <circle cx="-67" cy="-56" r="12" fill="#E2E8F0" />
            <circle cx="-67" cy="-59" r="5" fill="#3B82F6" />
            <path d="M-75 -47 Q-67 -52 -59 -47" stroke="#3B82F6" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Resume checklist lines */}
            <g transform="translate(-112, -36)">
              <circle cx="6" cy="5" r="4" fill="#22C55E" />
              <path d="M4 5 L5.5 6.5 L8 3.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="5" x2="80" y2="5" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

              <circle cx="6" cy="18" r="4" fill="#22C55E" />
              <path d="M4 18 L5.5 19.5 L8 16.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="18" x2="70" y2="18" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

              <circle cx="6" cy="31" r="4" fill="#22C55E" />
              <path d="M4 31 L5.5 32.5 L8 29.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="16" y1="31" x2="84" y2="31" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Right Screen: ATS Friendly badges */}
            <g transform="translate(-5, -88)">
              {/* ATS Friendly */}
              <rect x="0" y="0" width="124" height="24" rx="5" fill="#F0FDF4" stroke="#DCFCE7" strokeWidth="1" />
              <circle cx="13" cy="12" r="7" fill="#22C55E" />
              <path d="M9.5 12 L12 14.5 L16.5 9.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="27" y="16" fill="#0F172A" fontSize="9" fontWeight="bold">ATS Friendly</text>

              {/* Keywords */}
              <rect x="0" y="28" width="124" height="24" rx="5" fill="#F0FDF4" stroke="#DCFCE7" strokeWidth="1" />
              <circle cx="13" cy="40" r="7" fill="#22C55E" />
              <path d="M9.5 40 L12 42.5 L16.5 37.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="27" y="44" fill="#0F172A" fontSize="9" fontWeight="bold">Keywords</text>

              {/* Formatting */}
              <rect x="0" y="56" width="124" height="24" rx="5" fill="#F0FDF4" stroke="#DCFCE7" strokeWidth="1" />
              <circle cx="13" cy="68" r="7" fill="#22C55E" />
              <path d="M9.5 68 L12 70.5 L16.5 65.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="27" y="72" fill="#0F172A" fontSize="9" fontWeight="bold">Formatting</text>

              {/* Job Match */}
              <rect x="0" y="84" width="124" height="24" rx="5" fill="#F0FDF4" stroke="#DCFCE7" strokeWidth="1" />
              <circle cx="13" cy="96" r="7" fill="#22C55E" />
              <path d="M9.5 96 L12 98.5 L16.5 93.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="27" y="100" fill="#0F172A" fontSize="9" fontWeight="bold">Job Match</text>
            </g>

            {/* MAGNIFYING GLASS WITH 92% ATS SCORE */}
            <g transform="translate(0, -10)">
              {/* Handle */}
              <path d="M-28 28 L-55 58" stroke="#1E293B" strokeWidth="14" strokeLinecap="round" />
              <path d="M-28 28 L-55 58" stroke="#D99B26" strokeWidth="6" strokeLinecap="round" />

              {/* Glass Rim */}
              <circle cx="0" cy="0" r="48" fill="#FFFFFF" stroke="#0F2850" strokeWidth="7" filter="url(#badgeShadow)" />
              <circle cx="0" cy="0" r="44" fill="#FFFFFF" stroke="#D99B26" strokeWidth="3" />

              {/* Green score gauge arc */}
              <circle
                cx="0"
                cy="0"
                r="36"
                fill="none"
                stroke="#22C55E"
                strokeWidth="7"
                strokeDasharray="210"
                strokeDashoffset="25"
                strokeLinecap="round"
                transform="rotate(-90)"
              />

              {/* 92% Text */}
              <text x="0" y="-3" fill="#0F172A" fontSize="24" fontWeight="900" textAnchor="middle" letterSpacing="-0.5">92%</text>
              <text x="0" y="14" fill="#1E293B" fontSize="8" fontWeight="800" textAnchor="middle" letterSpacing="0.8">ATS SCORE</text>

              {/* Green checkmark floating bottom */}
              <circle cx="18" cy="22" r="14" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2.5" />
              <path d="M12 22 L16.5 26.5 L24 18" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        </g>

        {/* 3. PROMINENT NAVY & GOLD BANNER */}
        <g transform="translate(250, 345)">
          {/* Banner Ribbons background ends */}
          <path d="M-245 0 L-220 -28 L-220 28 Z" fill="#071326" stroke="url(#goldRim)" strokeWidth="3" />
          <path d="M245 0 L220 -28 L220 28 Z" fill="#071326" stroke="url(#goldRim)" strokeWidth="3" />

          {/* Main Banner Plate */}
          <path
            d="M-230 -38 L230 -38 L242 0 L230 38 L-230 38 L-242 0 Z"
            fill="url(#navyBanner)"
            stroke="url(#goldRim)"
            strokeWidth="5"
            filter="url(#badgeShadow)"
          />
          {/* Inner gold pin stripe */}
          <path
            d="M-224 -32 L224 -32 L234 0 L224 32 L-224 32 L-234 0 Z"
            fill="none"
            stroke="url(#goldInner)"
            strokeWidth="1.5"
          />

          {/* Document icon with magnifier badge on left */}
          <g transform="translate(-185, -18)">
            <rect x="0" y="0" width="30" height="36" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="3" />
            <path d="M18 0 L30 12 L18 12 Z" fill="#FFFFFF" />
            <line x1="6" y1="10" x2="14" y2="10" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="6" y1="17" x2="22" y2="17" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="6" y1="24" x2="16" y2="24" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

            {/* Magnifier over doc */}
            <circle cx="24" cy="26" r="10" fill="#0E2344" stroke="#FBBF24" strokeWidth="2.5" />
            <path d="M21 26 L23 28 L27 24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            <line x1="31" y1="33" x2="38" y2="40" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Main Title: ATS-CHECKER */}
          <text
            x="20"
            y="-4"
            fill="url(#goldText)"
            fontSize="46"
            fontWeight="900"
            fontFamily="Impact, Arial Black, sans-serif"
            textAnchor="middle"
            letterSpacing="2.5"
            stroke="#451A03"
            strokeWidth="1.2"
          >
            ATS-CHECKER
          </text>

          {/* Subtitle: — BY — USAPLACEMENT PROGRAM */}
          {showSubtitle && (
            <g transform="translate(20, 22)">
              <line x1="-190" y1="-5" x2="-35" y2="-5" stroke="url(#goldInner)" strokeWidth="2" strokeLinecap="round" />
              <text
                x="-12"
                y="-2"
                fill="#FFF1B8"
                fontSize="11"
                fontWeight="900"
                fontFamily="Arial, sans-serif"
                textAnchor="middle"
                letterSpacing="1"
              >
                BY
              </text>
              <line x1="12" y1="-5" x2="165" y2="-5" stroke="url(#goldInner)" strokeWidth="2" strokeLinecap="round" />

              <text
                x="-10"
                y="10"
                fill="#FFFFFF"
                fontSize="12.5"
                fontWeight="900"
                fontFamily="Arial, sans-serif"
                textAnchor="middle"
                letterSpacing="3.5"
              >
                USAPLACEMENT PROGRAM
              </text>
            </g>
          )}
        </g>

        {/* 4. BOTTOM GOLD GLOBE MEDALLION & LAURELS */}
        <g transform="translate(250, 426)">
          {/* Symmetrical Laurel branches left and right */}
          <g fill="#F59E0B" stroke="#B45309" strokeWidth="1">
            {/* Left stars & leaves */}
            <polygon points="-85,-8 -88,-16 -80,-12 -72,-16 -75,-8 -69,-2 -77,-2 -80,5 -83,-2 -91,-2" fill="#FDE047" />
            <path d="M-65 -5 C-55 -20 -40 -15 -32 -2 C-38 6 -52 6 -65 -5 Z" />
            <path d="M-55 8 C-46 -4 -32 2 -26 14 C-33 21 -45 18 -55 8 Z" />
            <path d="M-40 20 C-32 10 -20 16 -16 26 C-23 32 -33 28 -40 20 Z" />

            {/* Right stars & leaves */}
            <polygon points="85,-8 88,-16 80,-12 72,-16 75,-8 69,-2 77,-2 80,5 83,-2 91,-2" fill="#FDE047" />
            <path d="M65 -5 C55 -20 40 -15 32 -2 C38 6 52 6 65 -5 Z" />
            <path d="M55 8 C46 -4 32 2 26 14 C33 21 45 18 55 8 Z" />
            <path d="M40 20 C32 10 20 16 16 26 C23 32 33 28 40 20 Z" />
          </g>

          {/* Central Circular Globe Seal */}
          <circle cx="0" cy="0" r="38" fill="url(#goldRim)" stroke="#78350F" strokeWidth="3" filter="url(#badgeShadow)" />
          <circle cx="0" cy="0" r="33" fill="#0C2340" stroke="#FDE047" strokeWidth="2.5" />

          {/* World continents vector map in gold */}
          <g fill="#FBBF24" opacity="0.95">
            {/* North & Central America */}
            <path d="M-18 -18 Q-12 -24 -6 -20 Q-2 -15 -8 -8 Q-12 -2 -14 -8 Z" />
            {/* South America */}
            <path d="M-10 -4 Q-4 -2 -2 8 Q-6 18 -10 22 Q-14 12 -12 2 Z" />
            {/* Europe & Africa */}
            <path d="M2 -22 Q12 -24 16 -16 Q10 -12 6 -16 Z" />
            <path d="M4 -10 Q14 -12 18 -2 Q16 12 8 18 Q2 8 4 -10 Z" />
            {/* Asia & Australia */}
            <path d="M16 -20 Q24 -18 26 -8 Q18 -4 14 -12 Z" />
            <path d="M20 8 Q26 10 24 16 Q18 16 18 10 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default AtsCheckerLogo;
