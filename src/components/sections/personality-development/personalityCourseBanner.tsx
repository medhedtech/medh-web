"use client";

import React, { useMemo, memo } from "react";
import { useTheme } from "next-themes";
import { Users, ArrowRight, Shield, Award, Smile, Zap } from "lucide-react";
import Image from "next/image";
import medhLogo from "@/assets/images/logo/medh.png";

interface IFeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  isDark: boolean;
}

const FeatureCard = memo<IFeatureCard>(({ icon, title, description, isDark }) => {
  const cardClasses = useMemo(
    () =>
      // ⛑️ clip x, disable scale effects on mobile; only enable on md+
      `relative group cursor-pointer overflow-hidden overflow-x-clip gpu-accelerated 
       backdrop-blur-lg border rounded-xl p-4 md:p-5 
       md:hover:scale-105 transition-all duration-300
       ${
         isDark
           ? "bg-white/5 border-white/10 md:hover:bg-white/10 md:hover:border-white/20"
           : "bg-white/40 border-white/30 md:hover:bg-white/60 md:hover:border-white/40 shadow-lg md:hover:shadow-xl"
       }`,
    [isDark]
  );

  const titleClasses = useMemo(
    () =>
      `font-bold text-sm md:text-base mb-2 md:group-hover:text-emerald-400 transition-gpu gpu-accelerated ${
        isDark ? "text-white" : "text-gray-900"
      }`,
    [isDark]
  );

  const descriptionClasses = useMemo(
    () =>
      `text-xs md:text-sm gpu-accelerated ${isDark ? "text-gray-300" : "text-gray-600"} font-medium leading-relaxed`,
    [isDark]
  );

  return (
    <div className={cardClasses + " text-center"}>
      {/* No animated background on mobile to avoid paint overflow */}
      <div className="absolute inset-0 opacity-30 gpu-accelerated hidden md:block">
        <div
          className={`absolute inset-0 bg-gradient-to-br animate-pulse gpu-accelerated ${
            isDark
              ? "from-emerald-500/10 via-green-500/5 to-teal-500/10"
              : "from-emerald-200/30 via-green-200/20 to-teal-200/30"
          }`}
        />
      </div>

      <div className="relative z-10 gpu-accelerated">
        <div className="mb-3 md:group-hover:scale-110 transition-gpu gpu-accelerated flex justify-center">{icon}</div>
        <h3 className={titleClasses + " text-center"}>{title}</h3>
        <p className={descriptionClasses + " text-center"}>{description}</p>
      </div>
    </div>
  );
});
FeatureCard.displayName = "FeatureCard";

const PersonalityCourseBanner: React.FC = memo(() => {
  const { theme } = useTheme();
  const isDark = useMemo(() => theme === "dark", [theme]);

  // ⛑️ Clip x-overflow at the root and inner containers
  const containerClasses = useMemo(
    () =>
      `relative min-h-screen overflow-hidden overflow-x-clip gpu-accelerated ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-emerald-900/20 to-green-900/20"
          : "bg-gradient-to-br from-emerald-50 via-green-50/80 to-teal-50"
      }`,
    [isDark]
  );

  const contentClasses = useMemo(
    () => `relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 gpu-accelerated overflow-x-clip`,
    []
  );

  const headingClasses = useMemo(
    () =>
      `text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 md:mb-4 text-center max-w-5xl mx-auto gpu-accelerated ${
        isDark ? "text-white" : "text-gray-900"
      }`,
    [isDark]
  );

  const descriptionClasses = useMemo(
    () =>
      `text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6 text-center max-w-4xl mx-auto gpu-accelerated ${
        isDark ? "text-gray-300" : "text-gray-700"
      } font-medium`,
    [isDark]
  );

  const ctaClasses = useMemo(
    () =>
      // scale/extra shadow only from md+
      `inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 font-bold rounded-xl transition-all duration-300 
       md:hover:scale-105 group text-sm md:text-base relative overflow-hidden gpu-accelerated ${
         isDark
           ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white md:hover:shadow-xl md:hover:shadow-emerald-500/25 backdrop-blur-lg"
           : "bg-gradient-to-r from-emerald-500 to-green-500 text-white md:hover:shadow-xl md:hover:shadow-emerald-500/30 backdrop-blur-lg"
       }`,
    [isDark]
  );

  const taglineClasses = useMemo(
    () =>
      `mumkinMedh font-extrabold leading-tight text-center gpu-accelerated ${
        isDark
          ? "text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text"
          : "text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text"
      }`,
    [isDark]
  );

  const mainCardClasses = useMemo(
    () =>
      // ⛑️ clip x, no internal overflows
      `relative group gpu-accelerated backdrop-blur-xl border rounded-2xl p-4 md:p-8 mb-16 overflow-hidden overflow-x-clip ${
        isDark
          ? "bg-white/5 border-white/10 md:hover:bg-white/10"
          : "bg-white/50 border-white/40 md:hover:bg-white/70 shadow-2xl md:hover:shadow-3xl"
      }`,
    [isDark]
  );

  return (
    <section className={containerClasses}>
      {/* Background: fully disable the blurred bubbles on mobile (hidden) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-0 w-full h-full opacity-30 gpu-accelerated ${
            isDark
              ? "bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5"
              : "bg-gradient-to-br from-emerald-200/20 via-transparent to-green-200/20"
          }`}
        />
        {/* Only render decorative circles from md+ (they were causing overflow) */}
        <div className="hidden md:block">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-xl" />
          <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-blue-400/10 rounded-full blur-xl" />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-blue-400/10 rounded-full blur-xl" />
        </div>
      </div>

      <div className={contentClasses}>
        <div className={mainCardClasses}>
          {/* Card animated bg only on md+ */}
          <div className="absolute inset-0 opacity-40 gpu-accelerated hidden md:block">
            <div
              className={`absolute inset-0 bg-gradient-to-br animate-pulse gpu-accelerated ${
                isDark ? "from-emerald-500/10 via-green-500/5 to-teal-500/10" : "from-emerald-200/30 via-green-200/20 to-teal-200/30"
              }`}
            />
          </div>

          <div className="relative z-10">
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-4 md:mb-6 gpu-accelerated">
              <div
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium opacity-95 gpu-accelerated backdrop-blur-md border transition-all duration-300 ${
                  isDark ? "bg-white/10 border-white/20 text-blue-300 md:hover:bg-white/20" : "bg-white/60 border-white/40 text-blue-700 md:hover:bg-white/80"
                }`}
              >
                <Shield size={12} className="mr-1.5 gpu-accelerated" />
                ISO Certified
              </div>
              <div
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium opacity-95 gpu-accelerated backdrop-blur-md border transition-all duration-300 ${
                  isDark ? "bg-white/10 border-white/20 text-purple-300 md:hover:bg-white/20" : "bg-white/60 border-white/40 text-purple-700 md:hover:bg-white/80"
                }`}
              >
                <Award size={12} className="mr-1.5 gpu-accelerated" />
                STEM Accredited
              </div>
            </div>

            <div className="mb-0 text-center">
              <span className={`block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Learn
              </span>
            </div>

            <h1 className={headingClasses}>
              <span
                className={`gpu-accelerated text-[1.78rem] sm:text-[2.14rem] md:text-[2.85rem] lg:text-[3.56rem] ${
                  isDark
                    ? "text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-teal-300 bg-clip-text"
                    : "text-transparent bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text"
                }`}
              >
                Personality Development
              </span>
            </h1>

            {/* Logo row (fully constrained) */}
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <span className={`-mt-1 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold italic tracking-wide ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                with
              </span>
              <span className="inline-flex items-baseline align-baseline gpu-accelerated max-w-full overflow-x-clip">
                <Image
                  src={"/src/assets/images/logo/medh.png"}
                  alt="Medh Logo"
                  width={96}
                  height={96}
                  className="inline-block h-6 sm:h-7 md:h-8 lg:h-9 w-auto align-baseline gpu-accelerated"
                  sizes="(max-width: 1024px) 25vw, 96px"
                  priority
                  style={
                    verticalAlign: "baseline",
                    objectFit: "contain",
                    backfaceVisibility: "hidden",
                    WebkitFontSmoothing: "antialiased"
                  }}
                />
              </span>
            </div>

            {/* Description */}
            <p className={descriptionClasses + " mt-10"}>
              Transform your personality and unlock your potential with expert-led training that builds confidence, communication skills, and leadership qualities.
            </p>

            {/* CTA */}
            <div className="text-center mb-4 md:mb-6 gpu-accelerated">
              <button
                className={ctaClasses}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("course-options-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="relative z-10 font-extrabold tracking-wide gpu-accelerated">Enroll Now</span>
                <ArrowRight size={16} className="relative z-10 ml-2 md:group-hover:translate-x-1 transition-gpu gpu-accelerated" />
              </button>
            </div>

            {/* Tagline — wrap & clip */}
            <div className="w-full overflow-hidden overflow-x-clip gpu-accelerated">
              <div
                className={taglineClasses}
                style={{
                  fontSize: "clamp(1.2rem, 5vw, 2.5rem)",
                  letterSpacing: "0.05em",
                  textAlign: "center",
                  width: "100%",
                  wordBreak: "break-word"
                }}
              >
                Medh Hai Toh Mumkin Hai !
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6 md:mb-8 gpu-accelerated">
          <h2 className={`text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 gpu-accelerated ${isDark ? "text-white" : "text-gray-900"}`}>
            What You'll Develop
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto gpu-accelerated overflow-x-clip">
            <FeatureCard
              icon={<Smile className="w-7 h-7 text-emerald-500 gpu-accelerated" />}
              title="Confidence Building"
              description="Develop unshakeable self-confidence and overcome social anxiety with proven techniques"
              isDark={isDark}
            />
            <FeatureCard
              icon={<Users className="w-7 h-7 text-emerald-500 gpu-accelerated" />}
              title="Communication Skills"
              description="Master the art of effective communication, public speaking, and interpersonal relationships"
              isDark={isDark}
            />
            <FeatureCard
              icon={<Zap className="w-7 h-7 text-emerald-500 gpu-accelerated" />}
              title="Leadership Qualities"
              description="Cultivate leadership mindset, emotional intelligence, and influence others positively"
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </section>
  );
});
PersonalityCourseBanner.displayName = "PersonalityCourseBanner";
export default PersonalityCourseBanner;
