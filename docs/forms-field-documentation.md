# Forms Field Documentation - Medh Web Platform

## Overview

This document provides a comprehensive reference for all forms in the Medh Web Platform, detailing their fields, types, validation rules, and usage patterns. This documentation serves as a technical reference for developers working with the form system.

---

## Table of Contents

1. [Authentication Forms](#authentication-forms)
2. [Contact & Inquiry Forms](#contact--inquiry-forms)
3. [Registration Forms](#registration-forms)
4. [Admin Forms](#admin-forms)
5. [Enrollment Forms](#enrollment-forms)
6. [Career Application Forms](#career-application-forms)
7. [Field Type Reference](#field-type-reference)
8. [Validation Patterns](#validation-patterns)

---

## Authentication Forms

### 1. SignUpForm (`SignUpForm.tsx`)

**Purpose**: User registration with comprehensive profile setup
**Location**: `src/components/shared/login/SignUpForm.tsx`

#### Fields Structure

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `full_name` | text | ✅ | 2+ chars, letters/spaces only | User's full name |
| `email` | email | ✅ | Valid email format | User's email address |
| `password` | password | ✅ | 8+ chars, strength validation | User's password |
| `confirm_password` | password | ✅ | Must match password | Password confirmation |
| `phone_numbers` | phone array | ✅ | International format validation | Phone number with country code |
| `age_group` | select | ✅ | Predefined options | User's age range |
| `meta.gender` | select | ✅ | male/female/other | User's gender |
| `agree_terms` | checkbox | ✅ | Must be true | Terms acceptance |
| `role` | hidden | ✅ | Fixed: "student" | User role |
| `recaptcha` | captcha | ✅ | Valid token | reCAPTCHA verification |

#### Validation Schema
```typescript
const schema = yup.object({
  full_name: yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  email: yup.string()
    .email("Please enter a valid email")
    .required("Email is required")
    .lowercase()
    .trim(),
  password: yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  phone_numbers: yup.array()
    .of(yup.object({
      country: yup.string().required("Country code is required"),
      number: yup.string().required("Phone number is required")
    }))
    .required("Phone number is required"),
  age_group: yup.string()
    .oneOf(["Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"])
    .required("Age group is required")
});
```

#### Special Features
- **Multi-step form** with stepper UI
- **Password strength meter** with real-time feedback
- **Phone number validation** using libphonenumber-js
- **OAuth integration** (Google, GitHub)
- **OTP verification** for email
- **Dark mode support**

---

## Contact & Inquiry Forms

### 2. ContactForm (`ContactFrom.js`)

**Purpose**: General contact inquiries
**Location**: `src/components/sections/contact-form/ContactFrom.js`

#### Fields Structure

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `full_name` | text | ✅ | 2+ chars, letters/spaces only | Contact person's name |
| `email` | email | ✅ | Valid email format | Contact email |
| `phone` | tel | ❌ | 10+ digits, international format | Contact phone number |
| `company` | text | ❌ | Max 100 chars | Company name |
| `subject` | text | ✅ | 3-100 chars | Service type/inquiry subject |
| `message` | textarea | ✅ | 20-2000 chars | Detailed message |

#### Validation Schema
```javascript
const schema = yup.object().shape({
  full_name: yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  email: yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  phone: yup.string()
    .matches(/^[0-9+\-\s\(\)]*$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits"),
  subject: yup.string()
    .required("Service type is required")
    .min(3, "Service type must be at least 3 characters")
    .max(100, "Service type must not exceed 100 characters"),
  message: yup.string()
    .required("Message is required")
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must not exceed 2000 characters")
});
```

#### Special Features
- **Progress indicator** showing completion percentage
- **Success modal** with animation
- **Form state persistence** during session
- **Auto-save draft** functionality

### 3. BlogContactForm (`BlogContactForm.js`)

**Purpose**: Simplified contact form for blog pages
**Location**: `src/components/shared/blogs/BlogContactForm.js`

#### Fields Structure

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `full_name` | text | ✅ | 2+ chars, letters/spaces only | Contact person's name |
| `email` | email | ✅ | Valid email format | Contact email |
| `message` | textarea | ✅ | 10-1000 chars | Message content |

#### Special Features
- **Minimal design** optimized for blog sidebar
- **Quick submission** with immediate feedback
- **Auto-reset** after successful submission

### 4. Corporate Training Form (`Corporate-Form.tsx`)

**Purpose**: Corporate training inquiries
**Location**: `src/components/sections/corporate-enquiry-form/Corporate-Form.tsx`

#### Fields Structure

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `full_name` | text | ✅ | Letters/spaces/hyphens/apostrophes | Contact person's name |
| `email` | email | ✅ | Valid email format | Business email |
| `country` | select | ❌ | Country list | Country selection |
| `phone_number` | tel | ✅ | 10 digits, country code validation | Business phone |
| `designation` | text | ✅ | Job title/position | Contact person's role |
| `company_name` | text | ✅ | Company name | Organization name |
| `company_website` | url | ✅ | Valid URL format | Company website |
| `message` | textarea | ✅ | Training requirements | Detailed training needs |
| `accept` | checkbox | ✅ | Must be true | Terms acceptance |

#### Validation Schema
```typescript
const schema = yup.object({
  full_name: yup.string()
    .matches(/^[a-zA-Z\s'-]+$/, "Name can only contain alphabets, spaces, hyphens, and apostrophes.")
    .required("Name is required."),
  email: yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address.")
    .required("Email is required."),
  phone_number: yup.string()
    .required("Please enter your mobile number")
    .test("is-valid-phone", "Invalid phone number.", function (value) {
      // Complex phone validation with country code
    }),
  company_website: yup.string()
    .matches(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]*)*$/, "Invalid website URL")
    .required("Website is required")
});
```

#### Special Features
- **Business-focused fields** for corporate inquiries
- **Company validation** with website verification
- **Professional styling** with glassmorphism design
- **reCAPTCHA integration** for spam protection

---

## Registration Forms

### 5. Registration Form (`Registration.tsx`)

**Purpose**: Multi-purpose registration for various services
**Location**: `src/components/sections/registrations/Registration.tsx`

#### Fields Structure

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `full_name` | text | ✅ | Letters/spaces/hyphens/apostrophes | User's full name |
| `email` | email | ✅ | Valid email format | User's email |
| `country` | select | ✅ | Country list with dial codes | Country selection |
| `phone_number` | tel | ✅ | 10 digits, country-specific validation | Phone number |
| `message` | textarea | ✅ | 10+ chars | Requirements/message |
| `accept` | checkbox | ✅ | Must be true | Terms acceptance |
| `resume_image` | file | ❌ | PDF only, 5MB max | Resume upload (conditional) |

#### Conditional Fields (School Registration)
| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `school_institute_name` | text | ✅ | School/institute name | Institution name |
| `designation` | text | ✅ | Job title | Contact person's role |
| `website` | url | ✅ | Valid URL | Institution website |

#### Special Features
- **Dynamic validation** based on page type
- **File upload** with drag & drop
- **Country-specific phone validation**
- **Animated form transitions**
- **Mobile-first responsive design**

---

## Admin Forms

### 6. Add Student Form (`AddStudentForm.tsx`)

**Purpose**: Admin interface for adding new students
**Location**: `src/components/layout/main/dashboards/AddStudentForm.tsx`

#### Fields Structure

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `full_name` | text | ✅ | Full name | Student's name |
| `age` | number | ✅ | Min 1 | Student's age |
| `email` | email | ✅ | Valid email | Student's email |
| `phone_number` | tel | ✅ | 10 digits | Phone number |
| `country_code` | select | ✅ | Country code | Phone country code |
| `gender` | select | ✅ | Gender options | Student's gender |
| `password` | password | ❌ | Complex validation | Manual password (optional) |
| `use_manual_password` | checkbox | ❌ | Boolean | Enable manual password |
| `agree_terms` | checkbox | ✅ | Must be true | Terms acceptance |
| `user_image` | file | ❌ | Image upload | Profile picture |

### 7. Add Instructor Form (`AddInstructor.js`)

**Purpose**: Admin interface for adding new instructors
**Location**: `src/components/layout/main/dashboards/AddInstructor.js`

#### Fields Structure

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `full_name` | text | ✅ | Instructor name | Full name |
| `age` | number | ✅ | Min 18 years | Age validation |
| `phone_number` | tel | ✅ | 10-digit Indian format | Mobile number |
| `email` | email | ✅ | Valid email format | Email address |
| `course_name` | text | ❌ | Course specialization | Teaching subject |
| `amount_per_session` | number | ✅ | Numeric value | Session rate |
| `category` | select | ✅ | Course category | Teaching category |
| `password` | password | ✅ | 8+ chars | Account password |
| `confirm_password` | password | ✅ | Must match password | Password confirmation |
| `gender` | select | ✅ | Gender options | Gender selection |

---

## Enrollment Forms

### 8. Enrollment Form (`Enroll-Form.js`)

**Purpose**: Course enrollment with detailed preferences
**Location**: `src/components/sections/explore-journey/Enroll-Form.js`

#### Fields Structure

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `full_name` | text | ✅ | 3+ chars, letters/spaces/hyphens/apostrophes | Student name |
| `email` | email | ✅ | Valid email format | Contact email |
| `country` | select | ✅ | Country with dial code | Country selection |
| `phone_number` | tel | ✅ | 10 digits, country validation | Phone number |
| `course_category` | select | ✅ | Available categories | Course category |
| `course_type` | select | ✅ | Course delivery type | Learning format |
| `message` | textarea | ✅ | 10+ chars | Learning goals |
| `accept` | checkbox | ✅ | Must be true | Terms acceptance |

#### Special Features
- **Course selection** with dynamic options
- **Learning preference** customization
- **Integrated payment** flow preparation

---

## Career Application Forms

### 9. Job Application Form (`jobApply.js`)

**Purpose**: Job application submissions
**Location**: `src/components/sections/careers/jobApply.js`

#### Fields Structure

| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `full_name` | text | ✅ | Letters/spaces/hyphens/apostrophes | Applicant name |
| `email` | email | ✅ | Valid email format | Contact email |
| `country` | select | ✅ | Country selection | Location |
| `phone_number` | tel | ✅ | 10 digits | Phone number |
| `message` | textarea | ❌ | Cover letter/message | Additional information |
| `accept` | checkbox | ✅ | Must be true | Terms acceptance |

### 10. Placement Form (`PlacementForm.tsx`)

**Purpose**: Comprehensive placement application
**Location**: `src/components/layout/main/dashboards/PlacementForm.tsx`

#### Multi-Tab Structure

##### Tab 1: Personal Information
| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `firstname` | text | ✅ | First name | Given name |
| `lastname` | text | ✅ | Last name | Family name |
| `email` | email | ✅ | Valid email | Contact email |
| `phone_number` | tel | ✅ | 10 digits | Phone number |
| `resumeFile` | file | ✅ | PDF/DOC/DOCX, 5MB max | Resume upload |
| `linkedin_profile` | url | ❌ | Valid LinkedIn URL | LinkedIn profile |
| `github_profile` | url | ❌ | Valid GitHub URL | GitHub profile |
| `portfolio_url` | url | ❌ | Valid URL | Portfolio website |
| `website` | url | ❌ | Valid URL | Personal website |

##### Tab 2: Education
| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `highest_education` | text | ✅ | Education level | Highest degree |
| `university` | text | ✅ | Institution name | University/college |
| `degree` | text | ✅ | Degree title | Degree obtained |
| `field_of_study` | text | ✅ | Study field | Major/specialization |
| `graduation_year` | text | ✅ | Year | Graduation year |
| `gpa` | text | ✅ | GPA/percentage | Academic performance |

##### Tab 3: Experience (Dynamic Arrays)
| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `work_experience` | array | ❌ | Work history | Professional experience |
| `internships` | array | ❌ | Internship history | Internship experience |
| `projects` | array | ❌ | Project portfolio | Personal/academic projects |

**Work Experience Array Fields:**
- `title` (text, required): Job title
- `company` (text, required): Company name
- `location` (text): Work location
- `startDate` (month, required): Start date
- `endDate` (month): End date (if not current)
- `current` (checkbox): Currently working
- `description` (textarea, required): Job description
- `technologies` (text): Technologies used
- `achievements` (text): Key achievements

**Internship Array Fields:**
- `title` (text, required): Internship title
- `company` (text, required): Company name
- `startDate` (month, required): Start date
- `endDate` (month, required): End date
- `description` (textarea, required): Internship description

**Projects Array Fields:**
- `title` (text, required): Project title
- `description` (textarea, required): Project description
- `technologies` (text, required): Technologies used
- `githubUrl` (url): GitHub repository
- `demoUrl` (url): Live demo URL
- `startDate` (month): Start date
- `endDate` (month): End date
- `current` (checkbox): Ongoing project
- `role` (text): Your role
- `highlights` (text): Key highlights

##### Tab 4: Skills & Achievements
| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `skills` | array | ❌ | Skill list | Technical/soft skills |
| `languages_known` | text | ✅ | Languages | Known languages |
| `achievements` | array | ❌ | Achievement list | Awards/recognitions |
| `certifications` | array | ❌ | Certification list | Professional certifications |

##### Tab 5: Job Preferences
| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `preferred_location` | text | ❌ | Location preference | Preferred work location |
| `preferred_job_type` | text | ❌ | Job type | Full-time/part-time/contract |
| `preferred_work_type` | text | ✅ | Work arrangement | Remote/hybrid/on-site |
| `expected_salary` | text | ❌ | Salary expectation | Expected compensation |
| `notice_period` | text | ❌ | Notice period | Current notice period |
| `willing_to_relocate` | boolean | ✅ | Boolean | Relocation willingness |
| `availability_date` | text | ❌ | Date | Available start date |

##### Tab 6: Additional Information
| Field Name | Type | Required | Validation | Description |
|------------|------|----------|------------|-------------|
| `message` | textarea | ✅ | Message | Additional information |
| `references` | array | ❌ | Reference list | Professional references |
| `additional_info` | textarea | ❌ | Additional details | Extra information |

#### Special Features
- **Multi-step wizard** with progress tracking
- **Dynamic field arrays** for experience/projects
- **File upload** with validation
- **Form state persistence** across tabs
- **Comprehensive validation** per tab

---

## Field Type Reference

### Input Types

| Type | HTML Input | Validation | Use Case |
|------|------------|------------|----------|
| `text` | `type="text"` | String patterns | Names, titles, general text |
| `email` | `type="email"` | Email format | Email addresses |
| `tel` | `type="tel"` | Phone patterns | Phone numbers |
| `password` | `type="password"` | Strength validation | Passwords |
| `number` | `type="number"` | Numeric validation | Ages, amounts, counts |
| `url` | `type="url"` | URL format | Websites, profiles |
| `date` | `type="date"` | Date validation | Dates, deadlines |
| `month` | `type="month"` | Month/year format | Start/end dates |
| `file` | `type="file"` | File type/size | Document uploads |
| `checkbox` | `type="checkbox"` | Boolean | Agreements, preferences |
| `radio` | `type="radio"` | Single selection | Options, choices |
| `select` | `<select>` | Option validation | Dropdowns, categories |
| `textarea` | `<textarea>` | Text length | Messages, descriptions |

### Custom Components

| Component | Purpose | Features |
|-----------|---------|----------|
| `PhoneNumberInput` | International phone input | Country code, formatting, validation |
| `FileUpload` | File upload with preview | Drag & drop, progress, validation |
| `PasswordStrengthMeter` | Password strength indicator | Real-time feedback, security tips |
| `OTPVerification` | OTP input and verification | Auto-focus, resend functionality |
| `CountrySelect` | Country selection | Flag icons, search, dial codes |

---

## Validation Patterns

### Common Regex Patterns

```javascript
// Name validation (letters, spaces, hyphens, apostrophes)
const namePattern = /^[a-zA-Z\s'-]+$/;

// Email validation (comprehensive)
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone validation (digits only)
const phonePattern = /^\d+$/;

// Phone validation (international format)
const internationalPhonePattern = /^\+[1-9]\d{1,14}$/;

// URL validation
const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]*)*$/;

// Password strength (8+ chars, mixed case, numbers, symbols)
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Indian phone number (10 digits starting with 6-9)
const indianPhonePattern = /^[6-9]\d{9}$/;
```

### Validation Functions

```typescript
// Email validation
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Phone validation with country code
const validatePhone = (phone: string, countryCode: string): boolean => {
  const cleanNumber = phone.replace(/\D/g, '');
  return cleanNumber.length === 10 && /^\d{10}$/.test(cleanNumber);
};

// Password strength calculation
const calculatePasswordStrength = (password: string): {
  score: number;
  message: string;
  color: string;
} => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  const messages = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["red", "orange", "yellow", "blue", "green"];
  
  return {
    score,
    message: messages[score] || "Very Weak",
    color: colors[score] || "red"
  };
};
```

---

## Best Practices

### Form Design
1. **Progressive disclosure** - Show only necessary fields initially
2. **Clear labeling** - Use descriptive labels and placeholders
3. **Inline validation** - Provide immediate feedback
4. **Error handling** - Show clear, actionable error messages
5. **Success feedback** - Confirm successful submissions

### Validation Strategy
1. **Client-side validation** - Immediate user feedback
2. **Server-side validation** - Security and data integrity
3. **Progressive validation** - Validate as user types/moves
4. **Contextual help** - Provide format examples
5. **Accessibility** - Screen reader compatible errors

### Performance Optimization
1. **Lazy loading** - Load form components on demand
2. **Debounced validation** - Avoid excessive API calls
3. **Form state management** - Efficient state updates
4. **Conditional rendering** - Show only relevant fields
5. **Memory management** - Clean up resources

---

## Conclusion

This documentation provides a comprehensive reference for all forms in the Medh Web Platform. Each form is designed with specific use cases in mind, following consistent validation patterns and user experience principles. The modular approach allows for easy maintenance and extension of form functionality across the platform.

For implementation details and code examples, refer to the respective component files and the UniversalForm system documentation. 