"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import PremiumMembershipCard from "./PremiumMembershipCard";
import { Download, Share2, Calendar, ArrowRight } from "lucide-react";

const MembershipCardShowcase: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<'Silver' | 'Gold'>('Silver');

  const handleDownload = () => {
    console.log("Downloading membership card...");
    // Implement download functionality
  };

  const handleShare = () => {
    console.log("Sharing membership card...");
    // Implement share functionality
  };

  const handleRenew = () => {
    console.log("Renewing membership...");
    // Implement renewal functionality
  };

  const handleUpgrade = () => {
    console.log("Upgrading membership...");
    // Implement upgrade functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Digital Membership Cards
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Professional, shareable, and verifiable digital membership cards with QR codes and detailed benefits
          </motion.p>
        </div>

        {/* Tier Selector */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/60 dark:border-slate-600/60">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTier('Silver')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedTier === 'Silver'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                Silver Membership
              </button>
              <button
                onClick={() => setSelectedTier('Gold')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedTier === 'Gold'
                    ? 'bg-amber-500 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                Gold Membership
              </button>
            </div>
          </div>
        </motion.div>

        {/* Card Display */}
        <motion.div 
          className="flex justify-center"
          key={selectedTier}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PremiumMembershipCard
            membershipType={selectedTier}
            plan="ANNUAL"
            expiryDate="Dec 31, 2025"
            issueDate="Jan 15, 2024"
            membershipId={`${selectedTier.toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`}
            onDownload={handleDownload}
            onShare={handleShare}
            onRenew={handleRenew}
            onUpgrade={handleUpgrade}
            userEmail="member@medh.com"
            userPhone="+1 (555) 123-4567"
          />
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="mt-16 grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60 dark:border-slate-600/60">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Downloadable Cards
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Save your membership card as a high-quality image for offline use and sharing
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60 dark:border-slate-600/60">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
              <Share2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              QR Code Verification
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Each card includes a unique QR code with encrypted member data for instant verification
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60 dark:border-slate-600/60">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Flip for Details
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Interactive flip animation reveals comprehensive membership benefits and features
            </p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto">
            Get Your Digital Card
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default MembershipCardShowcase; 