"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Phone, ChevronDown, Search, Check, AlertCircle } from 'lucide-react';

// Component props
interface PhoneNumberInputCopyProps {
  value: {
    country: string;
    number: string;
    formattedNumber?: string;
    isValid?: boolean;
  };
  onChange: (value: {
    country: string;
    number: string;
    formattedNumber: string;
    isValid: boolean;
  }) => void;
  placeholder?: string;
  defaultCountry?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

// Country data structure
interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  format: string;
  priority?: number;
}

// Countries data - comprehensive list with formatting patterns
const COUNTRIES: Country[] = [
  // Priority countries (commonly used)
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', format: '##### #####', priority: 1 },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', format: '(###) ###-####', priority: 2 },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', format: '#### ### ####', priority: 3 },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', format: '(###) ###-####', priority: 4 },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', format: '#### ### ###', priority: 5 },
  
  // Other countries
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', format: '## ### ####' },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫', format: '## ### ####' },
  { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱', format: '## ### ####' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿', format: '## ### ####' },
  { code: 'AS', name: 'American Samoa', dialCode: '+1684', flag: '🇦🇸', format: '###-####' },
  { code: 'AD', name: 'Andorra', dialCode: '+376', flag: '🇦🇩', format: '### ###' },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴', format: '### ### ###' },
  { code: 'AI', name: 'Anguilla', dialCode: '+1264', flag: '🇦🇮', format: '###-####' },
  { code: 'AG', name: 'Antigua and Barbuda', dialCode: '+1268', flag: '🇦🇬', format: '###-####' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', format: '## ####-####' },
  { code: 'AM', name: 'Armenia', dialCode: '+374', flag: '🇦🇲', format: '## ######' },
  { code: 'AW', name: 'Aruba', dialCode: '+297', flag: '🇦🇼', format: '### ####' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹', format: '### ######' },
  { code: 'AZ', name: 'Azerbaijan', dialCode: '+994', flag: '🇦🇿', format: '## ### ## ##' },
  { code: 'BS', name: 'Bahamas', dialCode: '+1242', flag: '🇧🇸', format: '###-####' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭', format: '#### ####' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩', format: '####-######' },
  { code: 'BB', name: 'Barbados', dialCode: '+1246', flag: '🇧🇧', format: '###-####' },
  { code: 'BY', name: 'Belarus', dialCode: '+375', flag: '🇧🇾', format: '## ###-##-##' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪', format: '### ## ## ##' },
  { code: 'BZ', name: 'Belize', dialCode: '+501', flag: '🇧🇿', format: '###-####' },
  { code: 'BJ', name: 'Benin', dialCode: '+229', flag: '🇧🇯', format: '## ## ## ##' },
  { code: 'BM', name: 'Bermuda', dialCode: '+1441', flag: '🇧🇲', format: '###-####' },
  { code: 'BT', name: 'Bhutan', dialCode: '+975', flag: '🇧🇹', format: '## ### ###' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴', format: '########' },
  { code: 'BA', name: 'Bosnia and Herzegovina', dialCode: '+387', flag: '🇧🇦', format: '## ###-###' },
  { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼', format: '## ### ###' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', format: '## #####-####' },
  { code: 'IO', name: 'British Indian Ocean Territory', dialCode: '+246', flag: '🇮🇴', format: '### ####' },
  { code: 'BN', name: 'Brunei', dialCode: '+673', flag: '🇧🇳', format: '### ####' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬', format: '## ### ####' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫', format: '## ## ## ##' },
  { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮', format: '## ## ## ##' },
  { code: 'CV', name: 'Cape Verde', dialCode: '+238', flag: '🇨🇻', format: '### ## ##' },
  { code: 'KH', name: 'Cambodia', dialCode: '+855', flag: '🇰🇭', format: '## ### ###' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲', format: '#### ####' },
  { code: 'KY', name: 'Cayman Islands', dialCode: '+1345', flag: '🇰🇾', format: '###-####' },
  { code: 'CF', name: 'Central African Republic', dialCode: '+236', flag: '🇨🇫', format: '## ## ## ##' },
  { code: 'TD', name: 'Chad', dialCode: '+235', flag: '🇹🇩', format: '## ## ## ##' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱', format: '# #### ####' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', format: '### #### ####' },
  { code: 'CX', name: 'Christmas Island', dialCode: '+61', flag: '🇨🇽', format: '#### ####' },
  { code: 'CC', name: 'Cocos Islands', dialCode: '+61', flag: '🇨🇨', format: '#### ####' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', format: '### ### ####' },
  { code: 'KM', name: 'Comoros', dialCode: '+269', flag: '🇰🇲', format: '## ## ###' },
  { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬', format: '## ### ####' },
  { code: 'CD', name: 'Congo (DRC)', dialCode: '+243', flag: '🇨🇩', format: '### ### ###' },
  { code: 'CK', name: 'Cook Islands', dialCode: '+682', flag: '🇨🇰', format: '## ###' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷', format: '#### ####' },
  { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮', format: '## ### ###' },
  { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷', format: '## ### ####' },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺', format: '# ### ####' },
  { code: 'CW', name: 'Curaçao', dialCode: '+599', flag: '🇨🇼', format: '# ### ####' },
  { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: '🇨🇾', format: '## ######' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿', format: '### ### ###' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰', format: '## ## ## ##' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯', format: '## ## ## ##' },
  { code: 'DM', name: 'Dominica', dialCode: '+1767', flag: '🇩🇲', format: '###-####' },
  { code: 'DO', name: 'Dominican Republic', dialCode: '+1', flag: '🇩🇴', format: '###-###-####' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨', format: '## ### ####' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', format: '### ### ####' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻', format: '#### ####' },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶', format: '## ### ####' },
  { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: '🇪🇷', format: '# ### ###' },
  { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪', format: '#### ####' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: '🇸🇿', format: '## ## ####' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹', format: '## ### ####' },
  { code: 'FK', name: 'Falkland Islands', dialCode: '+500', flag: '🇫🇰', format: '#####' },
  { code: 'FO', name: 'Faroe Islands', dialCode: '+298', flag: '🇫🇴', format: '######' },
  { code: 'FJ', name: 'Fiji', dialCode: '+679', flag: '🇫🇯', format: '### ####' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮', format: '## ### ####' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', format: '## ## ## ## ##' },
  { code: 'GF', name: 'French Guiana', dialCode: '+594', flag: '🇬🇫', format: '### ## ## ##' },
  { code: 'PF', name: 'French Polynesia', dialCode: '+689', flag: '🇵🇫', format: '## ## ##' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦', format: '## ## ## ##' },
  { code: 'GM', name: 'Gambia', dialCode: '+220', flag: '🇬🇲', format: '### ####' },
  { code: 'GE', name: 'Georgia', dialCode: '+995', flag: '🇬🇪', format: '### ### ###' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', format: '### ########' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', format: '## ### ####' },
  { code: 'GI', name: 'Gibraltar', dialCode: '+350', flag: '🇬🇮', format: '### #####' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷', format: '### ### ####' },
  { code: 'GL', name: 'Greenland', dialCode: '+299', flag: '🇬🇱', format: '## ## ##' },
  { code: 'GD', name: 'Grenada', dialCode: '+1473', flag: '🇬🇩', format: '###-####' },
  { code: 'GP', name: 'Guadeloupe', dialCode: '+590', flag: '🇬🇵', format: '### ## ## ##' },
  { code: 'GU', name: 'Guam', dialCode: '+1671', flag: '🇬🇺', format: '###-####' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹', format: '#### ####' },
  { code: 'GG', name: 'Guernsey', dialCode: '+44', flag: '🇬🇬', format: '#### ######' },
  { code: 'GN', name: 'Guinea', dialCode: '+224', flag: '🇬🇳', format: '## ### ###' },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼', format: '# ######' },
  { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾', format: '### ####' },
  { code: 'HT', name: 'Haiti', dialCode: '+509', flag: '🇭🇹', format: '## ## ####' },
  { code: 'HM', name: 'Heard & McDonald Islands', dialCode: '+672', flag: '🇭🇲', format: '### ###' },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳', format: '####-####' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰', format: '#### ####' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺', format: '## ### ####' },
  { code: 'IS', name: 'Iceland', dialCode: '+354', flag: '🇮🇸', format: '### ####' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', format: '###-###-####' },
  { code: 'IR', name: 'Iran', dialCode: '+98', flag: '🇮🇷', format: '### ### ####' },
  { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶', format: '### ### ####' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', format: '## ### ####' },
  { code: 'IM', name: 'Isle of Man', dialCode: '+44', flag: '🇮🇲', format: '#### ######' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱', format: '##-###-####' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', format: '### ### ####' },
  { code: 'JM', name: 'Jamaica', dialCode: '+1876', flag: '🇯🇲', format: '###-####' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', format: '##-####-####' },
  { code: 'JE', name: 'Jersey', dialCode: '+44', flag: '🇯🇪', format: '#### ######' },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴', format: '# #### ####' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿', format: '### ###-##-##' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', format: '### ######' },
  { code: 'KI', name: 'Kiribati', dialCode: '+686', flag: '🇰🇮', format: '## ###' },
  { code: 'XK', name: 'Kosovo', dialCode: '+383', flag: '🇽🇰', format: '## ### ###' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼', format: '#### ####' },
  { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996', flag: '🇰🇬', format: '### ######' },
  { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦', format: '## ### ###' },
  { code: 'LV', name: 'Latvia', dialCode: '+371', flag: '🇱🇻', format: '## ### ###' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧', format: '## ### ###' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸', format: '## ### ###' },
  { code: 'LR', name: 'Liberia', dialCode: '+231', flag: '🇱🇷', format: '## ### ###' },
  { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾', format: '##-#######' },
  { code: 'LI', name: 'Liechtenstein', dialCode: '+423', flag: '🇱🇮', format: '### ## ##' },
  { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: '🇱🇹', format: '### ## ###' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺', format: '### ### ###' },
  { code: 'MO', name: 'Macao', dialCode: '+853', flag: '🇲🇴', format: '#### ####' },
  { code: 'MK', name: 'North Macedonia', dialCode: '+389', flag: '🇲🇰', format: '## ### ###' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬', format: '## ## ### ##' },
  { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼', format: '# #### ####' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', format: '##-### ####' },
  { code: 'MV', name: 'Maldives', dialCode: '+960', flag: '🇲🇻', format: '###-####' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱', format: '## ## ## ##' },
  { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹', format: '#### ####' },
  { code: 'MH', name: 'Marshall Islands', dialCode: '+692', flag: '🇲🇭', format: '###-####' },
  { code: 'MQ', name: 'Martinique', dialCode: '+596', flag: '🇲🇶', format: '### ## ## ##' },
  { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: '🇲🇷', format: '## ## ## ##' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: '🇲🇺', format: '#### ####' },
  { code: 'YT', name: 'Mayotte', dialCode: '+262', flag: '🇾🇹', format: '### ## ## ##' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', format: '### ### ####' },
  { code: 'FM', name: 'Micronesia', dialCode: '+691', flag: '🇫🇲', format: '###-####' },
  { code: 'MD', name: 'Moldova', dialCode: '+373', flag: '🇲🇩', format: '## ### ###' },
  { code: 'MC', name: 'Monaco', dialCode: '+377', flag: '🇲🇨', format: '## ### ###' },
  { code: 'MN', name: 'Mongolia', dialCode: '+976', flag: '🇲🇳', format: '#### ####' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382', flag: '🇲🇪', format: '## ### ###' },
  { code: 'MS', name: 'Montserrat', dialCode: '+1664', flag: '🇲🇸', format: '###-####' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦', format: '##-####-###' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿', format: '## ### ####' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲', format: '## ### ###' },
  { code: 'NA', name: 'Namibia', dialCode: '+264', flag: '🇳🇦', format: '## ### ####' },
  { code: 'NR', name: 'Nauru', dialCode: '+674', flag: '🇳🇷', format: '### ####' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵', format: '##-### ###' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', format: '## ### ####' },
  { code: 'NC', name: 'New Caledonia', dialCode: '+687', flag: '🇳🇨', format: '## ## ##' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', format: '##-### ####' },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮', format: '#### ####' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪', format: '## ## ## ##' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', format: '### ### ####' },
  { code: 'NU', name: 'Niue', dialCode: '+683', flag: '🇳🇺', format: '####' },
  { code: 'NF', name: 'Norfolk Island', dialCode: '+672', flag: '🇳🇫', format: '### ###' },
  { code: 'KP', name: 'North Korea', dialCode: '+850', flag: '🇰🇵', format: '###-###-####' },
  { code: 'MP', name: 'Northern Mariana Islands', dialCode: '+1670', flag: '🇲🇵', format: '###-####' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴', format: '### ## ###' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲', format: '#### ####' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', format: '### #######' },
  { code: 'PW', name: 'Palau', dialCode: '+680', flag: '🇵🇼', format: '###-####' },
  { code: 'PS', name: 'Palestine', dialCode: '+970', flag: '🇵🇸', format: '## ### ####' },
  { code: 'PA', name: 'Panama', dialCode: '+507', flag: '🇵🇦', format: '#### ####' },
  { code: 'PG', name: 'Papua New Guinea', dialCode: '+675', flag: '🇵🇬', format: '### ####' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾', format: '### ######' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪', format: '### ### ###' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', format: '### ### ####' },
  { code: 'PN', name: 'Pitcairn Islands', dialCode: '+64', flag: '🇵🇳', format: '##-### ####' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱', format: '### ### ###' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', format: '### ### ###' },
  { code: 'PR', name: 'Puerto Rico', dialCode: '+1', flag: '🇵🇷', format: '###-###-####' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦', format: '#### ####' },
  { code: 'RE', name: 'Réunion', dialCode: '+262', flag: '🇷🇪', format: '### ## ## ##' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴', format: '### ### ###' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺', format: '### ###-##-##' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼', format: '### ### ###' },
  { code: 'BL', name: 'Saint Barthélemy', dialCode: '+590', flag: '🇧🇱', format: '### ## ## ##' },
  { code: 'SH', name: 'Saint Helena', dialCode: '+290', flag: '🇸🇭', format: '#### ####' },
  { code: 'KN', name: 'Saint Kitts and Nevis', dialCode: '+1869', flag: '🇰🇳', format: '###-####' },
  { code: 'LC', name: 'Saint Lucia', dialCode: '+1758', flag: '🇱🇨', format: '###-####' },
  { code: 'MF', name: 'Saint Martin', dialCode: '+590', flag: '🇲🇫', format: '### ## ## ##' },
  { code: 'PM', name: 'Saint Pierre and Miquelon', dialCode: '+508', flag: '🇵🇲', format: '## ## ##' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', dialCode: '+1784', flag: '🇻🇨', format: '###-####' },
  { code: 'WS', name: 'Samoa', dialCode: '+685', flag: '🇼🇸', format: '##-####' },
  { code: 'SM', name: 'San Marino', dialCode: '+378', flag: '🇸🇲', format: '#### ######' },
  { code: 'ST', name: 'São Tomé and Príncipe', dialCode: '+239', flag: '🇸🇹', format: '## #####' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', format: '## ### ####' },
  { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳', format: '## ### ## ##' },
  { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸', format: '## ### ####' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨', format: '# ### ###' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱', format: '## ######' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', format: '#### ####' },
  { code: 'SX', name: 'Sint Maarten', dialCode: '+1721', flag: '🇸🇽', format: '###-####' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: '🇸🇰', format: '### ### ###' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: '🇸🇮', format: '## ### ###' },
  { code: 'SB', name: 'Solomon Islands', dialCode: '+677', flag: '🇸🇧', format: '### ####' },
  { code: 'SO', name: 'Somalia', dialCode: '+252', flag: '🇸🇴', format: '## ### ###' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', format: '## ### ####' },
  { code: 'GS', name: 'South Georgia & South Sandwich Islands', dialCode: '+500', flag: '🇬🇸', format: '#####' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', format: '##-####-####' },
  { code: 'SS', name: 'South Sudan', dialCode: '+211', flag: '🇸🇸', format: '## ### ####' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', format: '### ## ## ##' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰', format: '## ### ####' },
  { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩', format: '## ### ####' },
  { code: 'SR', name: 'Suriname', dialCode: '+597', flag: '🇸🇷', format: '###-####' },
  { code: 'SJ', name: 'Svalbard and Jan Mayen', dialCode: '+47', flag: '🇸🇯', format: '### ## ###' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', format: '##-### ## ##' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', format: '## ### ## ##' },
  { code: 'SY', name: 'Syria', dialCode: '+963', flag: '🇸🇾', format: '## #### ###' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼', format: '#### ####' },
  { code: 'TJ', name: 'Tajikistan', dialCode: '+992', flag: '🇹🇯', format: '## ### ####' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿', format: '## ### ####' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', format: '##-###-####' },
  { code: 'TL', name: 'Timor-Leste', dialCode: '+670', flag: '🇹🇱', format: '### ####' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬', format: '## ## ## ##' },
  { code: 'TK', name: 'Tokelau', dialCode: '+690', flag: '🇹🇰', format: '####' },
  { code: 'TO', name: 'Tonga', dialCode: '+676', flag: '🇹🇴', format: '### ####' },
  { code: 'TT', name: 'Trinidad and Tobago', dialCode: '+1868', flag: '🇹🇹', format: '###-####' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳', format: '## ### ###' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', format: '### ### ## ##' },
  { code: 'TM', name: 'Turkmenistan', dialCode: '+993', flag: '🇹🇲', format: '## ######' },
  { code: 'TC', name: 'Turks and Caicos Islands', dialCode: '+1649', flag: '🇹🇨', format: '###-####' },
  { code: 'TV', name: 'Tuvalu', dialCode: '+688', flag: '🇹🇻', format: '### ####' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬', format: '### ######' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦', format: '## ### ## ##' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾', format: '#### ####' },
  { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', flag: '🇺🇿', format: '## ### ## ##' },
  { code: 'VU', name: 'Vanuatu', dialCode: '+678', flag: '🇻🇺', format: '### ####' },
  { code: 'VA', name: 'Vatican City', dialCode: '+39', flag: '🇻🇦', format: '### ### ####' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪', format: '###-#######' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳', format: '### ### ####' },
  { code: 'VG', name: 'British Virgin Islands', dialCode: '+1284', flag: '🇻🇬', format: '###-####' },
  { code: 'VI', name: 'U.S. Virgin Islands', dialCode: '+1340', flag: '🇻🇮', format: '###-####' },
  { code: 'WF', name: 'Wallis and Futuna', dialCode: '+681', flag: '🇼🇫', format: '## ## ##' },
  { code: 'EH', name: 'Western Sahara', dialCode: '+212', flag: '🇪🇭', format: '##-####-###' },
  { code: 'YE', name: 'Yemen', dialCode: '+967', flag: '🇾🇪', format: '### ### ###' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: '🇿🇲', format: '## ### ####' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼', format: '## ### ####' },
];

const PhoneNumberInputCopy: React.FC<PhoneNumberInputCopyProps> = ({ 
  value, 
  onChange, 
  placeholder = "Enter phone number",
  defaultCountry = "IN",
  error, 
  disabled = false,
  className = ""
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(() => 
    COUNTRIES.find(c => c.code === (value?.country || defaultCountry)) || COUNTRIES[0]
  );

  // Format phone number based on country pattern
  const formatPhoneNumber = useCallback((number: string, country: Country) => {
    if (!number || !country.format) return number;
    
    // Ensure number is a string
    const numberStr = String(number || '');
    
    // Remove all non-numeric characters
    const cleaned = numberStr.replace(/\D/g, '');
    
    // Apply formatting based on country pattern
    let formatted = '';
    let numberIndex = 0;
    
    for (let i = 0; i < country.format.length && numberIndex < cleaned.length; i++) {
      const formatChar = country.format[i];
      if (formatChar === '#') {
        formatted += cleaned[numberIndex];
        numberIndex++;
      } else {
        formatted += formatChar;
      }
    }
    
    return formatted;
  }, []);

  // Validate phone number based on country
  const validatePhoneNumber = useCallback((number: string, country: Country) => {
    if (!number) return false;
    
    const cleaned = number.replace(/\D/g, '');
    const expectedLength = country.format.replace(/[^#]/g, '').length;
    
    return cleaned.length >= 7 && cleaned.length <= 15; // Basic validation
  }, []);

  // Filter countries based on search term
  const filteredCountries = useMemo(() => {
    if (!searchTerm) return COUNTRIES;
    
    return COUNTRIES.filter(country => 
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.dialCode.includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Handle country selection
  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm('');
    
    // Keep the current value but update country and formatting
    const currentNumber = value?.number || '';
    const formattedNumber = formatPhoneNumber(currentNumber, country);
    const isValid = validatePhoneNumber(currentNumber, country);
    
    onChange({
      country: country.code,
      number: currentNumber,
      formattedNumber,
      isValid
    });
  }, [value, onChange, formatPhoneNumber, validatePhoneNumber]);

  // Handle phone number input
  const handleNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow only numbers and basic formatting characters
    const cleaned = inputValue.replace(/[^\d\s\-\(\)]/g, '');
    const formattedNumber = formatPhoneNumber(cleaned, selectedCountry);
    const isValid = validatePhoneNumber(cleaned, selectedCountry);
    
    onChange({
      country: selectedCountry.code,
      number: cleaned,
      formattedNumber,
      isValid
    });
  }, [onChange, selectedCountry, formatPhoneNumber, validatePhoneNumber]);

  // Update selected country when value changes
  useEffect(() => {
    if (value?.country) {
      const country = COUNTRIES.find(c => c.code === value.country);
      if (country && country.code !== selectedCountry.code) {
        setSelectedCountry(country);
      }
    }
  }, [value?.country, selectedCountry.code]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.phone-input-container')) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get formatted display value
  const displayValue = useMemo(() => {
    return formatPhoneNumber(value?.number || '', selectedCountry);
  }, [value, selectedCountry, formatPhoneNumber]);

  // Check if phone number is valid
  const isValid = useMemo(() => {
    return validatePhoneNumber(value?.number || '', selectedCountry);
  }, [value, selectedCountry, validatePhoneNumber]);

  return (
    <div className={`phone-input-container relative ${className}`}>
      <div className={`
        flex border rounded-lg overflow-hidden transition-colors duration-200 bg-white dark:bg-gray-800
        ${error 
          ? 'border-red-300 dark:border-red-500' 
          : 'border-gray-300 dark:border-gray-600 focus-within:border-primary-500 dark:focus-within:border-primary-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        {/* Country Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-3 bg-gray-50 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 z-50 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
              {/* Search */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Countries List */}
              <div className="overflow-y-auto max-h-40">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      selectedCountry.code === country.code 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{country.name}</div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {country.dialCode}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="tel"
            value={displayValue}
            onChange={handleNumberChange}
            placeholder={selectedCountry.format.replace(/#/g, '0') || placeholder}
            disabled={disabled}
            className="w-full pl-10 pr-10 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm"
            autoComplete="tel"
          />
          
          {/* Validation Indicator */}
          {value?.number && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValid ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}

      {/* Help Text */}
      {!error && value?.number && !isValid && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Please enter a valid phone number for {selectedCountry.name} (Copy Form)
        </div>
      )}
    </div>
  );
};

export default PhoneNumberInputCopy; 