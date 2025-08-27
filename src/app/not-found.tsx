'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Home, Search, RefreshCw, Zap, Star } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([]);

  useEffect(() => {
    setMounted(true);
    
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDelay: `${particle.id * 0.2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* 404 Number with Glow Effect */}
          <div className="relative mb-8">
            <h1 className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-purple-500/20 blur-2xl leading-none select-none">
              404
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
              Oops! Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-200">
              The page you're looking for seems to have vanished into the digital void. 
              Don't worry, even the best explorers sometimes take a wrong turn.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up delay-400">
            <Link
              href="/"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3"
            >
              <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Back to Home
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </Link>

            <button
              onClick={() => router.back()}
              className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Go Back
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="mb-8 animate-fade-in-up delay-600">
            <p className="text-gray-400 mb-4">Looking for something specific?</p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 group"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Try our search
            </Link>
          </div>

          {/* Fun Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in-up delay-800">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-3">
                <Zap className="w-8 h-8 text-yellow-400 group-hover:animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">99.9%</h3>
              <p className="text-gray-400 text-sm">Uptime</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-3">
                <Star className="w-8 h-8 text-purple-400 group-hover:animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">4.9★</h3>
              <p className="text-gray-400 text-sm">User Rating</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-3">
                <RefreshCw className="w-8 h-8 text-green-400 group-hover:animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">24/7</h3>
              <p className="text-gray-400 text-sm">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-800 { animation-delay: 0.8s; }
      `}</style>
    </div>
  );
} 