import React, { useState } from 'react';

import { 
  UserCircleIcon, 
  PencilIcon,
  CameraIcon 
} from '@heroicons/react/24/outline';

interface ProfilePageExampleProps {
  className?: string;
}

const ProfilePageExample: React.FC<ProfilePageExampleProps> = ({ className = '' }) => {
  const [activeEditSection, setActiveEditSection] = useState<string | null>(null);

  const handleFieldEdit = (fieldName: string, category: string) => {
    // Handle field editing - scroll to section, open modal, etc.
    console.log(`Edit field: ${fieldName} in category: ${category}`);
    
    // Example: Set active edit section to highlight the field
    setActiveEditSection(`${category}-${fieldName}`);
    
    // Example: Scroll to the relevant section
    const sectionId = getSectionIdForCategory(category);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Clear highlight after 3 seconds
    setTimeout(() => {
      setActiveEditSection(null);
    }, 3000);
  };

  const getSectionIdForCategory = (category: string) => {
    switch (category) {
      case 'basic_info': return 'basic-info-section';
      case 'personal_details': return 'personal-details-section';
      case 'social_links': return 'social-links-section';
      default: return 'profile-form';
    }
  };

  const isFieldHighlighted = (category: string, fieldName: string) => {
    return activeEditSection === `${category}-${fieldName}`;
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-12 h-12 text-gray-400" />
            </div>
            <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors">
              <CameraIcon className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Harsh Patel</h1>
            <p className="text-gray-600">it@esampark.biz</p>
            <p className="text-sm text-gray-500">Last login: Aug 21, 2025, 08:43 PM</p>
          </div>
        </div>
      </div>



      {/* Profile Form Sections */}
      <div className="space-y-6">
        
        {/* Basic Information Section */}
        <div 
          id="basic-info-section" 
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('basic_info', 'full_name') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-gray-900">Harsh Patel</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('basic_info', 'username') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <p className="text-gray-500 italic">Not set</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('basic_info', 'phone_numbers') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <p className="text-gray-500 italic">Not provided</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('basic_info', 'address') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <p className="text-gray-500 italic">Not provided</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('basic_info', 'organization') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <p className="text-gray-500 italic">Not specified</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('basic_info', 'country') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <p className="text-gray-500 italic">Not specified</p>
            </div>
          </div>
          
          <div className={`mt-4 p-3 rounded-lg border ${isFieldHighlighted('basic_info', 'bio') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <p className="text-gray-500 italic">No bio added yet</p>
          </div>
        </div>

        {/* Personal Details Section */}
        <div 
          id="personal-details-section" 
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
            <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('personal_details', 'date_of_birth') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <p className="text-gray-500 italic">Not specified</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('personal_details', 'gender') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <p className="text-gray-500 italic">Not Specified</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('personal_details', 'education_level') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
              <p className="text-gray-500 italic">Not specified</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('personal_details', 'experience_level') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <p className="text-gray-500 italic">Not specified</p>
            </div>
          </div>
          
          <div className={`mt-4 p-3 rounded-lg border ${isFieldHighlighted('personal_details', 'skills') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
            <p className="text-gray-500 italic">No skills added yet</p>
          </div>
        </div>

        {/* Social Links Section */}
        <div 
          id="social-links-section" 
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
            <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('social_links', 'linkedin_link') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <p className="text-gray-500 italic">Not provided</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('social_links', 'github_link') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
              <p className="text-gray-500 italic">Not provided</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('social_links', 'portfolio_link') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
              <p className="text-gray-500 italic">Not provided</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${isFieldHighlighted('social_links', 'twitter_link') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X</label>
              <p className="text-gray-500 italic">Not provided</p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ProfilePageExample;
