"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, Shield, Calendar, Users, ArrowRight, Sparkles, CheckCircle, Zap, Gift, Download, Share2, QrCode, RotateCcw, Phone, Mail, Globe, MapPin, Award, BookOpen, Lock, Unlock, MessageCircle, Percent, Sun, X, Loader2, Clock, Target, Check } from "lucide-react";

// TypeScript interfaces based on the JSON structure
interface MembershipUser {
  name: string;
  photo?: string;
  email?: string;
  phone?: string;
  membershipId?: string;
}

interface MembershipTier {
  type: 'Silver' | 'Gold';
  badge: {
    text: string;
    icon: string;
    style: string;
  };
  theme: string;
  gradientColors: string[];
  glowColor: string;
  pattern: string;
  hologramEffect: boolean;
}

interface MembershipProgress {
  percentage: number;
  text: string;
  level: number;
  totalLevels: number;
  showBar: boolean;
}

interface MembershipFeature {
  label: string;
  icon: string;
  status: 'unlocked' | 'locked';
}

interface MembershipActions {
  primary: {
    label: string;
    actionId: string;
    style: string;
  };
  secondary: Array<{
    label: string;
    actionId: string;
    style: string;
  }>;
}

interface SocialProof {
  enabled: boolean;
  text: string;
  icon: string;
  style: string;
}

interface QRCodeConfig {
  imageUrl?: string;
  tooltip: string;
  encrypted: boolean;
}

interface MembershipData {
  user: MembershipUser;
  tier: MembershipTier;
  progress: MembershipProgress;
  features: MembershipFeature[];
  actions: MembershipActions;
  socialProof: SocialProof;
  qrCode: QRCodeConfig;
}

interface MembershipCardProps {
  membershipType: 'Silver' | 'Gold' | null;
  membershipData?: MembershipData;
  isDemo?: boolean;
  onUpgrade?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onRenew?: () => void;
}

const PremiumMembershipCard: React.FC<MembershipCardProps> = ({
  membershipType = null,
  membershipData,
  isDemo = false,
  onUpgrade,
  onDownload,
  onShare,
  onRenew
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [showQR, setShowQR] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Get user name from localStorage with memory pattern [[memory:6195512246065623398]]
  useEffect(() => {
    if (membershipData?.user?.name) {
      setUserName(membershipData.user.name);
    } else {
      const storedUserName = localStorage.getItem("userName") || "";
      const storedFullName = localStorage.getItem("fullName") || "";
      const storedName = storedUserName || storedFullName;
      
      if (storedName) {
        const firstName = storedName.trim().split(' ')[0];
        const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        setUserName(capitalizedName);
      }
    }
  }, [membershipData]);

  // Generate QR Code
  useEffect(() => {
    const generateQRCode = async () => {
      if (membershipType && userName) {
        try {
          const QRCode = (await import('qrcode')).default;
          const qrData = membershipData || {
            user: { name: userName, membershipId: `${membershipType.toUpperCase()}-${Date.now().toString().slice(-6)}` },
            tier: { type: membershipType },
            progress: { percentage: membershipType === 'Gold' ? 80 : 60 }
          };
          
          const qrString = JSON.stringify({
            membership: qrData,
            verified: true,
            issuer: 'MEDH - Learn Upskill Elevate'
          });
          
          const dataUrl = await QRCode.toDataURL(qrString, {
            width: 200,
            margin: 2,
            color: {
              dark: '#1e293b',
              light: '#ffffff'
            }
          });
          setQrCodeDataUrl(dataUrl);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQRCode();
  }, [membershipType, userName, membershipData]);

  // Default configuration based on membership type
  const defaultConfig = {
    Silver: {
      tier: {
        type: 'Silver' as const,
        badge: { text: 'SILVER MEMBER', icon: 'star', style: 'ribbon' },
        theme: 'glass',
        gradientColors: ['#3b82f6', '#2563eb', '#1d4ed8'],
        glowColor: '#60a5fa',
        pattern: 'diagonal-stripes',
        hologramEffect: true
      },
      progress: { percentage: 60, text: '60% benefits unlocked', level: 3, totalLevels: 5, showBar: true },
      features: [
        { label: 'LIVE Q&A Sessions', icon: 'chat', status: 'unlocked' as const },
        { label: 'Course Discounts', icon: 'discount', status: 'unlocked' as const },
        { label: 'Community Access', icon: 'globe', status: 'unlocked' as const },
        { label: 'Free Courses', icon: 'book-open', status: 'unlocked' as const },
        { label: 'Career Counselling', icon: 'lock', status: 'locked' as const }
      ],
      socialProof: { enabled: true, text: '1,847 learners achieved success with Silver!', icon: 'sun', style: 'highlight' }
    },
    Gold: {
      tier: {
        type: 'Gold' as const,
        badge: { text: 'GOLD MEMBER', icon: 'crown', style: 'ribbon' },
        theme: 'glass',
        gradientColors: ['#fbbf24', '#f59e0b', '#d97706'],
        glowColor: '#facc15',
        pattern: 'diagonal-stripes',
        hologramEffect: true
      },
      progress: { percentage: 80, text: '80% benefits unlocked', level: 4, totalLevels: 5, showBar: true },
      features: [
        { label: 'LIVE Q&A Sessions', icon: 'chat', status: 'unlocked' as const },
        { label: 'Minimum 15% Course Discount', icon: 'discount', status: 'unlocked' as const },
        { label: 'Community Access', icon: 'globe', status: 'unlocked' as const },
        { label: 'Free Courses', icon: 'book-open', status: 'unlocked' as const },
        { label: 'Career Counselling', icon: 'phone', status: 'unlocked' as const },
        { label: 'Placement Support', icon: 'lock', status: 'locked' as const }
      ],
      socialProof: { enabled: true, text: '2,943 learners achieved success with Gold!', icon: 'sun', style: 'highlight' }
    }
  };

  // No membership state
  if (!membershipType) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md mx-auto"
      >
        <div className={`${isDemo ? 'bg-gray-200' : 'bg-white'} p-6 rounded-3xl shadow-2xl`}>
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Unlock Premium Access
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Choose your membership tier
                </p>
              </div>
            </div>
            <motion.button
              onClick={onUpgrade}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
            >
              <Sparkles className="w-4 h-4" />
              Explore Plans
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  const config = defaultConfig[membershipType];
  const currentData = membershipData || {
    user: { 
      name: userName, 
      membershipId: `${membershipType.toUpperCase()}-${Date.now().toString().slice(-6)}` 
    },
    tier: {
      ...config.tier,
      style: {
        container: "pt-16 sm:pt-20", // Added top padding to shift content down
        content: "space-y-8 sm:space-y-10" // Increased spacing between sections
      }
    },
    progress: config.progress,
    features: config.features,
    actions: {
      primary: { label: 'Get My Card', actionId: 'downloadCard', style: 'primary' },
      secondary: [
        { label: 'Share Badge', actionId: 'shareBadge', style: 'secondary' },
        { label: 'Continue Membership', actionId: 'renewMembership', style: 'secondary' }
      ]
    },
    socialProof: config.socialProof,
    qrCode: { tooltip: 'Scan to verify membership', encrypted: true }
  };

  const getIconComponent = (iconName: string, size = "w-4 h-4") => {
    const icons: { [key: string]: React.ReactNode } = {
      'chat': <MessageCircle className={size} />,
      'discount': <Percent className={size} />,
      'globe': <Globe className={size} />,
      'book-open': <BookOpen className={size} />,
      'phone': <Phone className={size} />,
      'lock': <Lock className={size} />,
      'crown': <Crown className={size} />,
      'star': <Star className={size} />,
      'sun': <Sun className={size} />
    };
    return icons[iconName] || <CheckCircle className={size} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onHoverStart={() => { if (window.innerWidth >= 768) { setIsHovered(true); setIsFlipped(true); } }}
      onHoverEnd={() => { if (window.innerWidth >= 768) { setIsHovered(false); setIsFlipped(false); } }}
      className="max-w-md mx-auto group"
    >
      <div className="relative overflow-hidden">
        {/* Flip Container - Portrait Mode */}
        <motion.div
          className="relative w-full h-[580px] sm:h-[580px] preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        >
          {/* Front Side - Main Card */}
          <motion.div 
            className="absolute inset-0 w-full h-full backface-hidden"
            animate={isHovered ? {
              y: -8,
              boxShadow: `0 30px 60px -12px ${currentData.tier.glowColor}50`
            } : {
              y: 0
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              backfaceVisibility: "hidden"
            }}
          >
            {/* Card Background */}
            <div 
              className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${currentData.tier.gradientColors[0]}E6, ${currentData.tier.gradientColors[1]}CC, ${currentData.tier.gradientColors[2]}E6)`,
              }}
            >
              {/* Pattern & Contrast Overlay */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: currentData.tier.pattern === 'diagonal-stripes' 
                    ? `repeating-linear-gradient(45deg, transparent, transparent 25px, rgba(255,255,255,0.1) 25px, rgba(255,255,255,0.1) 50px)`
                    : 'none'
                }}
              />

              {/* Dark overlay for improved text contrast */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Demo Badge */}
              {(isDemo || !membershipData) && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="px-3 py-1 bg-red-500/90 backdrop-blur-sm rounded-full border border-red-400/50 shadow-lg">
                    <span className="text-white text-xs font-bold tracking-wider">DEMO</span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className={`relative z-10 p-4 sm:p-6 h-full flex flex-col text-white ${currentData.tier.style.content}`}>
                {/* Header Section */}
                <div className="flex items-start justify-between mb-5 sm:mb-6">
                  {/* User Profile */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <motion.div 
                      className="relative"
                      animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-3 border-white/40 shadow-xl">
                        {currentData.user.photo ? (
                          <img
                            src={currentData.user.photo}
                            alt={currentData.user.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-lg sm:text-xl font-bold">
                              {currentData.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                    
                    <div>
                      <h2 className="text-base sm:text-lg font-bold drop-shadow-sm">
                        {currentData.user.name}
                      </h2>
                      <p className="text-[10px] sm:text-xs opacity-90 font-mono">
                        {currentData.user.membershipId}
                      </p>
                    </div>
                  </div>
                  
                  {/* Badge Ribbon */}
                  <div 
                    className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-white text-[10px] sm:text-xs font-bold tracking-wider shadow-lg flex items-center gap-1.5 sm:gap-2 border border-white/30"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                  >
                    {getIconComponent(currentData.tier.badge.icon, "w-3 h-3 sm:w-4 sm:h-4")}
                    {currentData.tier.badge.text}
                  </div>
                </div>

                {/* Membership Title */}
                <div className="mb-5 sm:mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-wider drop-shadow-sm" style={{ color: currentData.tier.gradientColors[0] }}>
                    {membershipType.toUpperCase()}
                  </h1>
                  <h2 className="text-xl sm:text-2xl font-bold drop-shadow-sm">
                    MEMBER
                  </h2>
                </div>

                {/* Progress Section */}
                {currentData.progress.showBar && (
                  <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-lg font-bold drop-shadow-sm">
                        {currentData.progress.text}
                      </span>
                      <span className="text-xs sm:text-sm opacity-90">
                        {currentData.progress.level}/{currentData.progress.totalLevels}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 rounded-full h-2.5 sm:h-3 overflow-hidden shadow-inner">
                      <motion.div
                        className="h-full rounded-full shadow-sm"
                        style={{ backgroundColor: currentData.tier.gradientColors[0] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${currentData.progress.percentage}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Key Benefits */}
                <div className="flex-1">
                  <div className="space-y-2 sm:space-y-3">
                    {currentData.features.slice(0, 3).map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.02, boxShadow: `0 6px 14px -4px ${currentData.tier.glowColor}66` }}
                        className="relative flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm border-l-4"
                        style={{ borderColor: currentData.tier.gradientColors[1] }}
                      >
                        <div 
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-inner" 
                          style={{ backgroundColor: `${currentData.tier.gradientColors[0]}66` }}
                        >
                          {getIconComponent(feature.icon, "w-3.5 h-3.5 sm:w-4 sm:h-4")}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold leading-snug drop-shadow-sm">
                          {feature.label}
                        </span>
                        {feature.status === 'unlocked' ? (
                          <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-300 ml-auto" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300 ml-auto" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Social Proof */}
                {currentData.socialProof.enabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="mt-3 sm:mt-4 flex items-center gap-2 p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm"
                  >
                    {getIconComponent(currentData.socialProof.icon, "w-3.5 h-3.5 sm:w-4 sm:h-4")}
                    <span className="text-[10px] sm:text-xs font-medium drop-shadow-sm">
                      {currentData.socialProof.text}
                    </span>
                  </motion.div>
                )}

                {/* QR Code Button - Now at the bottom */}
                <motion.button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="md:hidden mt-3 w-full py-3 px-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.95 }}
                >
                  <QrCode className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">View Membership QR</span>
                </motion.button>

                {/* Mobile Back Button */}
                {isFlipped && (
                  <motion.button
                    onClick={() => setIsFlipped(false)}
                    className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30 flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Card</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Back Side - QR Code */}
          <motion.div 
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <h3 className="text-xl font-semibold text-white text-center">Membership QR Code</h3>
                <p className="text-sm text-slate-300 text-center mb-4">Scan to verify membership</p>
                
                <div className="w-48 h-48 bg-white rounded-lg p-2">
                  <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="Membership QR Code" className="w-full h-full" />
                    ) : (
                      <QrCode className="w-32 h-32 text-slate-800" />
                    )}
                  </div>
                </div>

                {/* Back to Card Button */}
                <motion.button
                  onClick={() => setIsFlipped(false)}
                  className="md:hidden mt-6 w-full py-3 px-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">Back to Card</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* External Action Buttons */}
        <motion.div 
          className="mt-4 flex flex-wrap w-full justify-start gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={(isDemo || !membershipData) ? undefined : onDownload}
            whileHover={(isDemo || !membershipData) ? {} : { scale: 1.05, boxShadow: `0 8px 16px -4px ${currentData.tier.glowColor}66` }}
            whileTap={(isDemo || !membershipData) ? {} : { scale: 0.98 }}
            className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-3 shadow-xl ${
              (isDemo || !membershipData) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
            style={{
              background: (isDemo || !membershipData) 
                ? '#9ca3af' 
                : `linear-gradient(135deg, ${currentData.tier.gradientColors[0]}, ${currentData.tier.gradientColors[1]})`,
              color: (isDemo || !membershipData) ? '#6b7280' : '#1a1a1a'
            }}
          >
            <Download className="w-5 h-5" />
            {currentData.actions.primary.label}
          </motion.button>

          <motion.button
            onClick={(isDemo || !membershipData) ? undefined : onShare}
            whileHover={(isDemo || !membershipData) ? {} : { scale: 1.02 }}
            whileTap={(isDemo || !membershipData) ? {} : { scale: 0.98 }}
            className={`px-6 py-4 backdrop-blur-sm rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg border ${
              (isDemo || !membershipData) 
                ? 'bg-gray-300/50 text-gray-500 border-gray-400/30 cursor-not-allowed opacity-50' 
                : 'bg-white/10 text-slate-700 dark:text-slate-300 border-white/20 hover:bg-white/20 cursor-pointer'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Share Badge
          </motion.button>

          <motion.button
            onClick={(isDemo || !membershipData) ? undefined : () => setIsFlipped(!isFlipped)}
            whileHover={(isDemo || !membershipData) ? {} : { scale: 1.02 }}
            whileTap={(isDemo || !membershipData) ? {} : { scale: 0.98 }}
            className={`px-6 py-4 backdrop-blur-sm rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg border ${
              (isDemo || !membershipData) 
                ? 'bg-gray-300/50 text-gray-500 border-gray-400/30 cursor-not-allowed opacity-50' 
                : 'bg-white/10 text-slate-700 dark:text-slate-300 border-white/20 hover:bg-white/20 cursor-pointer'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Flip
          </motion.button>

          <motion.button
            onClick={(isDemo || !membershipData) ? undefined : onRenew}
            whileHover={(isDemo || !membershipData) ? {} : { scale: 1.02 }}
            whileTap={(isDemo || !membershipData) ? {} : { scale: 0.98 }}
            className={`px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 backdrop-blur-sm shadow-lg ${
              (isDemo || !membershipData) 
                ? 'bg-gray-300/70 text-gray-500 cursor-not-allowed opacity-50' 
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 cursor-pointer'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Continue Membership
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PremiumMembershipCard; 