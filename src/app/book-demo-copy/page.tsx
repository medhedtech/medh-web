"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Star, Award, Download, Percent, 
  BookOpen, Eye, Gift, FileText, Users, 
  CheckCircle, Calendar, Clock, Video,
  User, GraduationCap, Heart, Shield, Trophy, X, ZoomIn
} from 'lucide-react';
import { buildComponent, buildAdvancedComponent, getResponsive } from '@/utils/designSystem';
import EmbeddedDemoFormCopy from '@/components/forms/EmbeddedDemoFormCopy';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { useToast } from '@/components/shared/ui/ToastProvider';

// Import certification images from Certified.tsx
import iso27001 from "@/assets/images/iso/iso27001.png";
import iso10002 from "@/assets/images/iso/iso10002.png";
import iso20000 from "@/assets/images/iso/iso20000.png";
import iso22301 from "@/assets/images/iso/iso22301.png";
import iso9001 from "@/assets/images/iso/iso9001.png";
import iso27701 from "@/assets/images/iso/iso27701.jpg";
import isoSTEM from "@/assets/images/iso/iso-STEM.jpg";
import isoUAEA from "@/assets/images/iso/iso-UAEA.jpg";

// ========== BENEFITS DATA ==========

const demoSessionBenefits = [
  {
    id: 'assessment',
    icon: User,
    title: 'Personalized Learning Assessment',
    description: 'Receive tailored insights and recommendations based on your learning style and goals',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30'
  },
  {
    id: 'preview',
    icon: Eye,
    title: 'Exclusive Course Preview',
    description: 'Experience our actual curriculum and teaching methodology before enrolling for any of the course',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30'
  },
  {
    id: 'resources',
    icon: Gift,
    title: 'Immediate Resource Access',
    description: 'Get instant access to Free Educational Materials right after booking your demo.',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30'
  },
  {
    id: 'certificate',
    icon: Award,
    title: 'Demo Participation Certificate',
    description: 'Download an official certificate after your session to add to your educational portfolio.',
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30'
  },
  {
    id: 'discount',
    icon: Percent,
    title: 'Special Enrollment Discount',
    description: 'Enjoy a special discount on your first course enrollment when you complete a demo session.',
    gradient: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30'
  }
];

// ========== DEMO BOOKING PAGE COMPONENT ==========

const DemoBookingPageCopy = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const isDark = useMemo(() => {
    if (!mounted) return false;
    return theme === 'dark';
  }, [mounted, theme]);

  useEffect(() => {
    setMounted(true);
    // Auto-show form after a brief delay to create engagement
    const timer = setTimeout(() => setShowForm(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle escape key for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCertificateModal) {
        setShowCertificateModal(false);
      }
    };

    if (showCertificateModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showCertificateModal]);

  // Get initial data from URL params if any
  const initialFormData = useMemo(() => {
    if (!searchParams) return undefined;
    
    const course = searchParams.get('course');
    const category = searchParams.get('category');
    
    if (course || category) {
      return {
        studentDetailsUnder16: {
          preferred_course: course ? [course] : category ? [category] : []
        },
        studentDetails16AndAbove: {
          preferred_course: course ? [course] : category ? [category] : []
        }
      };
    }
    
    return undefined;
  }, [searchParams]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading demo booking...</p>
        </div>
      </div>
    );
  }

  const handleFormSuccess = (data: any) => {
    // Show success toast
    showToast.success('🎉 Demo session booked successfully! Check your email for details.', {
      duration: 6000
    });
    
    // Redirect to success page after a brief delay
    setTimeout(() => {
      router.push('/courses?demo=booked');
    }, 2000);
  };

  const handleFormError = (error: any) => {
    // Use the enhanced error handling from ToastProvider
    showToast.fromError(error, 'Failed to book demo session. Please try again.');
  };

  const handleBenefitHover = (benefitId: string) => {
    setSelectedBenefit(benefitId);
  };

  const handleBenefitLeave = () => {
    setSelectedBenefit(null);
  };

  return (
    <PageWrapper showFooter={false} addTopPadding={true} addBottomPadding={false}>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
          <div className="absolute inset-0 bg-[url('/backgrounds/grid-pattern.svg')] bg-repeat"></div>
        </div>
        
        {/* Enhanced Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-600/10 dark:to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-400/20 dark:from-emerald-600/10 dark:to-cyan-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main Content - Full scrollable page */}
        <main className="relative z-10">
          <div className="px-8 py-8">
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">
              
                            {/* Benefits Section */}
              <div className="lg:col-span-5 space-y-6 order-1 lg:order-1">
                {/* Compact Single Card - All Benefits */}
                <div className="bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 lg:p-8">
                  {/* Card Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 text-white" />
                </div>
                    <div>
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                        Demo Session Benefits
                            </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Everything you get with your free demo
                            </p>
                          </div>
                </div>

                  {/* Benefits Grid */}
                  <div className="space-y-4">
                  {demoSessionBenefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    
                    return (
                      <div
                        key={benefit.id}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 group"
                        >
                          {/* Icon */}
                          <div className={`
                            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                            bg-gradient-to-r ${benefit.gradient} text-white shadow-md
                            group-hover:scale-110 transition-transform duration-200
                          `}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm lg:text-base mb-2 text-gray-900 dark:text-white leading-snug">
                              {benefit.title}
                            </h4>
                            <p className="text-xs lg:text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                              {benefit.description}
                            </p>
                          </div>

                          {/* Check Icon */}
                          <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-green-500 text-white shadow-sm group-hover:scale-110 transition-transform duration-200">
                            <CheckCircle className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                  {/* Bottom CTA */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                        <strong className="text-gray-900 dark:text-white">5 amazing benefits</strong> waiting for you
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          100% Free
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="lg:col-span-7 order-2 lg:order-2">
                <div className="flex flex-col">
                  {/* Form Header - Modified to indicate this is a copy */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Book Your Free Demo Session at Medh
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-base">
                      Fill in your details and we'll schedule a personalized demo for you
                    </p>
                  </div>

                  {/* Form Container */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 min-h-[700px] lg:min-h-[570px]">
                    {showForm ? (
                      <div className="h-[700px] lg:h-[570px]">
                        <EmbeddedDemoFormCopy
                          initialData={initialFormData}
                          onSubmitSuccess={handleFormSuccess}
                          onSubmitError={handleFormError}
                        />
                      </div>
                    ) : (
                      <div className="h-[700px] lg:h-[570px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                          <p className="text-gray-600 dark:text-gray-400">Loading form...</p>
                        </div>
                      </div>
                    )}
              </div>
            </div>
          </div>

              {/* Certificate and Certifications - Desktop Version */}
              <div className="hidden lg:block lg:col-span-12 order-3 lg:order-3 mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* Demo Certificate Showcase - Left Side */}
                  <div className="bg-white/95 dark:bg-gray-800/95 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-4 text-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Get Your Demo Participation Certificate
                </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Download an official certificate to showcase your demo session participation
                    </p>
                    
                    <div className="relative max-w-sm mx-auto mb-3 group cursor-pointer" onClick={() => setShowCertificateModal(true)}>
                      <Image
                        src="/images/Demo Certificate .png"
                        alt="Demo Participation Certificate Sample"
                        width={300}
                        height={225}
                        className="w-full h-auto object-cover rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                        priority
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-800/90 rounded-full p-3 shadow-lg">
                          <ZoomIn className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Click to view hint */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Click to view certificate in full size
                    </p>
                    
                    {/* Certificate Features - Minimal */}
                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                        <CheckCircle className="w-3 h-3" />
                        Official
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
                        <Download className="w-3 h-3" />
                        Instant Download
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded">
                        <Trophy className="w-3 h-3" />
                        Portfolio Ready
                      </span>
                    </div>
                  </div>

                  {/* All Certifications - Right Side */}
                  <div className="bg-white/95 dark:bg-gray-800/95 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-4">
                    <div className="text-center mb-3">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Trusted & Certified
                      </h3>
                    </div>

                    {/* Certifications Grid - Image Focused */}
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      {/* ISO 10002 */}
                      <div className="text-center">
                        <div className="w-27 h-27 mx-auto mb-1">
                      <Image
                            src={iso10002}
                        alt="ISO 10002"
                            width={108}
                            height={108}
                            className="w-full h-full object-contain"
                      />
                    </div>  
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                      ISO 10002
                        </p>
                      </div>

                      {/* ISO 27001 */}
                      <div className="text-center">
                        <div className="w-27 h-27 mx-auto mb-1">
                          <Image
                            src={iso27001}
                            alt="ISO 27001"
                            width={108}
                            height={108}
                            className="w-full h-full object-contain"
                          />
                    </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          ISO 27001
                        </p>
                  </div>

                      {/* ISO 20000 */}
                      <div className="text-center">
                        <div className="w-27 h-27 mx-auto mb-1">
                          <Image
                            src={iso20000}
                            alt="ISO 20000"
                            width={108}
                            height={108}
                            className="w-full h-full object-contain"
                          />
                </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          ISO 20000
                        </p>
              </div>

                      {/* ISO 22301 */}
                      <div className="text-center">
                        <div className="w-27 h-27 mx-auto mb-1">
                      <Image
                            src={iso22301}
                            alt="ISO 22301"
                            width={108}
                            height={108}
                            className="w-full h-full object-contain"
                      />
                    </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          ISO 22301
                        </p>
                      </div>

                      {/* ISO 9001 */}
                      <div className="text-center">
                        <div className="w-27 h-27 mx-auto mb-1">
                          <Image
                            src={iso9001}
                            alt="ISO 9001"
                            width={108}
                            height={108}
                            className="w-full h-full object-contain"
                          />
                    </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          ISO 9001
                        </p>
                  </div>

                      {/* ISO 27701 */}
                      <div className="text-center">
                        <div className="w-27 h-27 mx-auto mb-1">
                      <Image
                            src={iso27701}
                        alt="ISO 27701"
                            width={108}
                            height={108}
                            className="w-full h-full object-contain"
                      />
                    </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                      ISO 27701
                        </p>
                    </div>

                      {/* STEM */}
                      <div className="text-center">
                        <div className="w-27 h-27 mx-auto mb-1">
                          <Image
                            src={isoSTEM}
                            alt="STEM"
                            width={108}
                            height={108}
                            className="w-full h-full object-contain"
                          />
                  </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          STEM
                        </p>
              </div>

                      {/* UAEA */}
                      <div className="text-center">
                        <div className="w-27 h-27 mx-auto mb-1">
                      <Image
                            src={isoUAEA}
                            alt="UAEA"
                            width={108}
                            height={108}
                            className="w-full h-full object-contain"
                      />
                    </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          UAEA
                        </p>
                  </div>
                    </div>

                    {/* Simple Footer */}
                    <div className="text-center pt-2 border-t border-gray-200/50 dark:border-gray-600/50">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Quality Assured • Internationally Recognized
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate and Certifications - Optimized Mobile Version */}
              <div className="lg:hidden col-span-12 order-3 mb-6 space-y-3">
                
                {/* Mobile Certificate Showcase - Optimized */}
                <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xl backdrop-blur-sm px-4 py-5 sm:p-6">
                  <div className="text-center">
                    {/* Optimized Header */}
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                        🎓 Demo Certificate
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                        Official certificate after demo completion
                      </p>
                    </div>
                    
                    {/* Optimized Certificate Image - Touch-First Design */}
                    <div 
                      className="relative mx-auto mb-5 max-w-[280px] sm:max-w-[320px] cursor-pointer group touch-manipulation" 
                      onClick={() => setShowCertificateModal(true)}
                      role="button"
                      tabIndex={0}
                      aria-label="View certificate in full size"
                    >
                      {/* Certificate Container */}
                      <div className="relative bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-3 shadow-lg group-active:scale-95 transition-transform duration-150 ease-out">
                        <Image
                          src="/images/Demo Certificate .png"
                          alt="Demo Participation Certificate Sample"
                          width={280}
                          height={210}
                          className="w-full h-auto object-cover rounded-lg border border-blue-200/60 dark:border-blue-700/60 shadow-sm"
                          loading="lazy"
                          sizes="(max-width: 640px) 280px, 320px"
                        />
                        
                        {/* Touch Indicator - Optimized */}
                        <div className="absolute top-1 right-1 bg-blue-500/90 text-white rounded-full p-1.5 shadow-md">
                          <ZoomIn className="w-3.5 h-3.5" />
                        </div>
                        
                        {/* Subtle hover overlay for touch devices */}
                        <div className="absolute inset-0 bg-blue-500/0 group-active:bg-blue-500/5 rounded-xl transition-colors duration-150 pointer-events-none"></div>
                      </div>
                      
                      {/* CTA Button - Optimized for Touch */}
                      <button 
                        className="mt-3 bg-blue-500 active:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors duration-150 inline-flex items-center gap-2 min-h-[44px] shadow-md active:shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCertificateModal(true);
                        }}
                        aria-label="Tap to view certificate in full size"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="font-semibold">View Full Size</span>
                      </button>
                    </div>
                    
                    {/* Optimized Certificate Features - Better Mobile Layout */}
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      <div className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 bg-green-50/80 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl min-h-[60px]">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-xs font-semibold leading-none">Official</span>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl min-h-[60px]">
                        <Download className="w-5 h-5 flex-shrink-0" />
                        <span className="text-xs font-semibold leading-none">Instant</span>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 bg-purple-50/80 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-xl min-h-[60px]">
                        <Shield className="w-5 h-5 flex-shrink-0" />
                        <span className="text-xs font-semibold leading-none">Verified</span>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 bg-amber-50/80 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-xl min-h-[60px]">
                        <Trophy className="w-5 h-5 flex-shrink-0" />
                        <span className="text-xs font-semibold leading-none">Portfolio</span>
                      </div>
                    </div>
                    
                    {/* Optimized Info Banner */}
                    <div className="bg-gradient-to-r from-blue-50/90 to-purple-50/90 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-3 border border-blue-200/50 dark:border-blue-700/50">
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium flex items-center justify-center gap-1.5">
                        <span className="text-sm">✨</span>
                        <span>Available after demo session</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Certifications Showcase - Optimized */}
                <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xl backdrop-blur-sm px-4 py-4 sm:p-5">
                  {/* Optimized Header */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 leading-tight">
                      🏆 Trusted Platform
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      International certifications
                    </p>
                  </div>

                  {/* Optimized Certifications Grid - All Certifications Visible */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {/* Row 1 */}
                    {/* ISO 10002 */}
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-1 bg-white/90 rounded-lg p-1 shadow-sm border border-gray-200/60 dark:border-gray-600/40">
                        <Image
                          src={iso10002}
                          alt="ISO 10002"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-none">
                        10002
                      </p>
                    </div>

                    {/* ISO 27001 */}
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-1 bg-white/90 rounded-lg p-1 shadow-sm border border-gray-200/60 dark:border-gray-600/40">
                        <Image
                          src={iso27001}
                          alt="ISO 27001"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-none">
                        27001
                      </p>
                    </div>

                    {/* ISO 20000 */}
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-1 bg-white/90 rounded-lg p-1 shadow-sm border border-gray-200/60 dark:border-gray-600/40">
                        <Image
                          src={iso20000}
                          alt="ISO 20000"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-none">
                        20000
                      </p>
                    </div>

                    {/* ISO 22301 */}
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-1 bg-white/90 rounded-lg p-1 shadow-sm border border-gray-200/60 dark:border-gray-600/40">
                        <Image
                          src={iso22301}
                          alt="ISO 22301"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-none">
                        22301
                      </p>
                    </div>

                    {/* Row 2 */}
                    {/* ISO 9001 */}
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-1 bg-white/90 rounded-lg p-1 shadow-sm border border-gray-200/60 dark:border-gray-600/40">
                        <Image
                          src={iso9001}
                          alt="ISO 9001"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-none">
                        9001
                      </p>
                    </div>

                    {/* ISO 27701 */}
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-1 bg-white/90 rounded-lg p-1 shadow-sm border border-gray-200/60 dark:border-gray-600/40">
                        <Image
                          src={iso27701}
                          alt="ISO 27701"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-none">
                        27701
                      </p>
                    </div>

                    {/* STEM */}
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-1 bg-white/90 rounded-lg p-1 shadow-sm border border-gray-200/60 dark:border-gray-600/40">
                        <Image
                          src={isoSTEM}
                          alt="STEM"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-none">
                        STEM
                      </p>
                    </div>

                    {/* UAEA */}
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-1 bg-white/90 rounded-lg p-1 shadow-sm border border-gray-200/60 dark:border-gray-600/40">
                        <Image
                          src={isoUAEA}
                          alt="UAEA"
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-none">
                        UAEA
                      </p>
                    </div>
                  </div>

                  {/* Optimized Trust Indicators */}
                  <div className="flex items-center justify-center gap-3 pt-2.5 border-t border-gray-200/40 dark:border-gray-600/40">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Verified</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Global</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
        </main>
      </div>

      {/* Optimized Certificate Full View Modal */}
      {showCertificateModal && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm touch-manipulation" 
          onClick={() => setShowCertificateModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Certificate full view"
        >
          <div className="relative max-w-5xl max-h-[95vh] w-full h-full flex items-center justify-center">
            {/* Optimized Close button - Better for mobile */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCertificateModal(false);
              }}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/95 dark:bg-gray-800/95 active:bg-white dark:active:bg-gray-800 rounded-full p-3 shadow-xl transition-all duration-200 active:scale-95 min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Close certificate view"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Optimized Certificate container */}
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-w-full max-h-full mx-2 sm:mx-4">
              <Image
                src="/images/Demo Certificate .png"
                alt="Demo Participation Certificate Sample - Full View"
                width={900}
                height={675}
                className="w-full h-auto object-contain max-h-[85vh]"
                priority
                onClick={(e) => e.stopPropagation()}
                sizes="(max-width: 640px) 95vw, (max-width: 1024px) 90vw, 900px"
              />
            </div>

            {/* Optimized Download hint - Better mobile positioning */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white/95 dark:bg-gray-800/95 rounded-xl px-4 py-3 shadow-xl max-w-[calc(100%-24px)] sm:max-w-none">
              <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 font-medium">
                <Download className="w-4 h-4 flex-shrink-0" />
                <span className="text-center">Available after demo completion</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default DemoBookingPageCopy; 