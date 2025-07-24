"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Star, Award, Download, Percent, 
  BookOpen, Eye, Gift, FileText, Users, 
  CheckCircle, Calendar, Clock, Video,
  User, GraduationCap, Heart, Shield, Trophy
} from 'lucide-react';
import { buildComponent, buildAdvancedComponent, getResponsive } from '@/utils/designSystem';
import EmbeddedDemoForm from '@/components/forms/EmbeddedDemoForm';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { useToast } from '@/components/shared/ui/ToastProvider';

// Import certification images from WhyMedh2
import iso9001Emblem from "@/assets/images/certifications/ISO_9001-2015_Emblem.jpg";
import iso10002Emblem from "@/assets/images/certifications/ISO_10002-2018_Emblem.jpg";
import iso20000Emblem from "@/assets/images/certifications/ISO_20000-2018_Emblem.jpg";
import iso22301Emblem from "@/assets/images/certifications/ISO_22301-2019_Emblem.jpg"; 
import iso27001Emblem from "@/assets/images/certifications/ISO_27001-2022_Emblem.jpg";
import iso27701Emblem from "@/assets/images/certifications/ISO_27701-2019_Emblem.jpg";
import stemAccreditation from "@/assets/images/certifications/medh-stem-accreditation-logo (1).png";
import isoLogo from "@/assets/images/certifications/ISOlogo.png";

// ========== BENEFITS DATA ==========

const demoSessionBenefits = [
  {
    id: 'assessment',
    icon: User,
    title: 'Personalized Assessment',
    description: 'Tailored insights based on your learning style and goals',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30'
  },
  {
    id: 'preview',
    icon: Eye,
    title: 'Course Preview',
    description: 'Experience our curriculum with real content before enrolling',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30'
  },
  {
    id: 'resources',
    icon: Gift,
    title: 'Instant Resources',
    description: 'Unlock premium materials and study guides immediately',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30'
  },
  {
    id: 'certificate',
    icon: Award,
    title: 'Demo Certificate',
    description: 'Official completion certificate for your portfolio',
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30'
  },
  {
    id: 'discount',
    icon: Percent,
    title: 'Enrollment Discount',
    description: 'Exclusive pricing and early-bird discounts',
    gradient: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30'
  }
];

// ========== DEMO BOOKING PAGE COMPONENT ==========

const DemoBookingCopyPage: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);

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
                {/* Desktop Header - Hidden on mobile */}
                <div className="hidden lg:block text-center lg:text-left">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3" style={{ whiteSpace: 'nowrap' }}>
                    Key Benefits of the Medh-Demo-Session
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-base mb-6" style={{ whiteSpace: 'nowrap' }}>
                    Discover the key benefits of experiencing MEDH before you commit
                  </p>
                </div>

                {/* Mobile Header - Optimized for mobile */}
                <div className="lg:hidden text-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    Key Benefits of the<br />Medh-Demo-Session
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                    Discover the key benefits of<br />experiencing MEDH before you commit
                  </p>
                </div>

                {/* Desktop Benefits List - Original layout */}
                <div className="hidden lg:grid grid-cols-1 gap-8">
                  {demoSessionBenefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    
                    return (
                      <div
                        key={benefit.id}
                        className={`
                          relative p-4 rounded-xl border-transparent backdrop-blur-sm
                          bg-gradient-to-r ${benefit.bgGradient} shadow-lg
                        `}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {/* Icon */}
                          <div className={`
                            flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                            bg-gradient-to-r ${benefit.gradient} text-white shadow-md
                          `}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base mb-1 text-gray-900 dark:text-white">
                              {benefit.title}
                            </h3>
                            <p className="text-sm leading-snug text-gray-700 dark:text-gray-200">
                              {benefit.description}
                            </p>
                          </div>

                          {/* Check Icon */}
                          <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-green-500 text-white shadow-md">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Benefits List - Optimized for mobile */}
                <div className="lg:hidden grid grid-cols-1 gap-4">
                  {demoSessionBenefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    
                    return (
                      <div
                        key={benefit.id}
                        className={`
                          relative p-3 rounded-lg border-transparent backdrop-blur-sm
                          bg-gradient-to-r ${benefit.bgGradient} shadow-md
                        `}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`
                            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                            bg-gradient-to-r ${benefit.gradient} text-white shadow-md
                          `}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">
                              {benefit.title}
                            </h3>
                            <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-200">
                              {benefit.description}
                            </p>
                          </div>

                          {/* Check Icon */}
                          <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-green-500 text-white shadow-md">
                            <CheckCircle className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Form Section */}
              <div className="lg:col-span-7 order-2 lg:order-2">
                <div className="flex flex-col">
                  {/* Form Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      Book Your Free Demo Session
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-base">
                      Fill in your details and we'll schedule a personalized demo for you
                    </p>
                  </div>

                  {/* Form Container */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 min-h-[600px]">
                    {showForm ? (
                      <div className="h-[600px]">
                        <EmbeddedDemoForm
                          initialData={initialFormData}
                          onSubmitSuccess={handleFormSuccess}
                          onSubmitError={handleFormError}
                        />
                      </div>
                    ) : (
                      <div className="h-[600px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                          <p className="text-gray-600 dark:text-gray-400">Loading form...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Certifications Section */}
          <section className="w-full mt-12 lg:mt-16 px-8">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium mb-4">
                <Trophy className="w-4 h-4" />
                Trusted & Certified
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Certifications
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-3xl mx-auto">
                Recognized for excellence in education and quality standards
              </p>
            </div>

            {/* Featured Certifications - STEM & ISO */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-12 sm:mb-16">
              {/* STEM Accredited */}
              <div className="group relative w-full max-w-lg mx-auto transform transition-all duration-300 hover:-translate-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-gray-100/50 dark:border-gray-800/50 shadow-lg hover:shadow-xl p-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 group-hover:scale-105 overflow-hidden">
                  <Image
                    src={stemAccreditation}
                    alt="STEM Accredited"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-2 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400 text-center">
                  STEM Accredited
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-3">
                  Excellence in Science, Technology, Engineering, and Mathematics education with globally recognized standards.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                    Globally Recognized
                  </span>
                </div>
              </div>

              {/* ISO Certified */}
              <div className="group relative w-full max-w-lg mx-auto transform transition-all duration-300 hover:-translate-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-gray-100/50 dark:border-gray-800/50 shadow-lg hover:shadow-xl p-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 group-hover:scale-105 overflow-hidden">
                  <Image
                    src={isoLogo}
                    alt="ISO Certified"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-2 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400 text-center">
                  ISO Certified
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-3">
                  International standards for quality management and continuous improvement in educational services.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                    Globally Recognized
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Certifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
              {/* Learning Quality */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Learning Quality
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                  <div className="text-center group/item transform transition-all duration-300 hover:-translate-y-2">
                    <div className="w-18 h-18 sm:w-22 sm:h-22 mx-auto mb-3 bg-white/90 dark:bg-gray-700/90 rounded-2xl p-3 shadow-lg border border-gray-100 dark:border-gray-600 group-hover/item:scale-110 group-hover/item:shadow-xl transition-all duration-300">
                      <Image
                        src={iso9001Emblem}
                        alt="ISO 9001"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain transition-all duration-300 group-hover/item:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors">
                      ISO 9001
                    </div>
                  </div>
                  <div className="text-center group/item transform transition-all duration-300 hover:-translate-y-2">
                    <div className="w-18 h-18 sm:w-22 sm:h-22 mx-auto mb-3 bg-white/90 dark:bg-gray-700/90 rounded-2xl p-3 shadow-lg border border-gray-100 dark:border-gray-600 group-hover/item:scale-110 group-hover/item:shadow-xl transition-all duration-300">
                      <Image
                        src={iso10002Emblem}
                        alt="ISO 10002"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain transition-all duration-300 group-hover/item:scale-110"
                        loading="lazy"
                      />
                    </div>  
                    <div className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors">
                      ISO 10002
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Protection */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Data Protection
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                  <div className="text-center group/item transform transition-all duration-300 hover:-translate-y-2">
                    <div className="w-18 h-18 sm:w-22 sm:h-22 mx-auto mb-3 bg-white/90 dark:bg-gray-700/90 rounded-2xl p-3 shadow-lg border border-gray-100 dark:border-gray-600 group-hover/item:scale-110 group-hover/item:shadow-xl transition-all duration-300">
                      <Image
                        src={iso27001Emblem}
                        alt="ISO 27001"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain transition-all duration-300 group-hover/item:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors">
                      ISO 27001
                    </div>
                  </div>
                  <div className="text-center group/item transform transition-all duration-300 hover:-translate-y-2">
                    <div className="w-18 h-18 sm:w-22 sm:h-22 mx-auto mb-3 bg-white/90 dark:bg-gray-700/90 rounded-2xl p-3 shadow-lg border border-gray-100 dark:border-gray-600 group-hover/item:scale-110 group-hover/item:shadow-xl transition-all duration-300">
                      <Image
                        src={iso27701Emblem}
                        alt="ISO 27701"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain transition-all duration-300 group-hover/item:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors">
                      ISO 27701
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Reliability */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Service Reliability
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                  <div className="text-center group/item transform transition-all duration-300 hover:-translate-y-2">
                    <div className="w-18 h-18 sm:w-22 sm:h-22 mx-auto mb-3 bg-white/90 dark:bg-gray-700/90 rounded-2xl p-3 shadow-lg border border-gray-100 dark:border-gray-600 group-hover/item:scale-110 group-hover/item:shadow-xl transition-all duration-300">
                      <Image
                        src={iso20000Emblem}
                        alt="ISO 20000"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain transition-all duration-300 group-hover/item:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors">
                      ISO 20000
                    </div>
                  </div>
                  <div className="text-center group/item transform transition-all duration-300 hover:-translate-y-2">
                    <div className="w-18 h-18 sm:w-22 sm:h-22 mx-auto mb-3 bg-white/90 dark:bg-gray-700/90 rounded-2xl p-3 shadow-lg border border-gray-100 dark:border-gray-600 group-hover/item:scale-110 group-hover/item:shadow-xl transition-all duration-300">
                      <Image
                        src={iso22301Emblem}
                        alt="ISO 22301"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain transition-all duration-300 group-hover/item:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors">
                      ISO 22301
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Summary */}
            <div className="mt-8 sm:mt-12 text-center">
              <div className="inline-flex items-center gap-4 sm:gap-6 px-6 sm:px-8 py-3 sm:py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm sm:text-base font-medium text-green-800 dark:text-green-200">Quality Assured</span>
                </div>
                <div className="w-px h-4 sm:h-5 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm sm:text-base font-medium text-blue-800 dark:text-blue-200">Internationally Recognized</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
                These certifications ensure your learning journey is built on globally recognized standards of excellence.
              </p>
            </div>
          </section>
        </main>
      </div>
    </PageWrapper>
  );
};

export default DemoBookingCopyPage; 