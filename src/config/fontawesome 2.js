// Font Awesome Configuration
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faSearch, 
  faSignOutAlt, 
  faArrowLeft, 
  faTimes, 
  faCog, 
  faSun, 
  faMoon, 
  faGraduationCap, 
  faBookOpen, 
  faBell, 
  faHeart, 
  faShareAlt, 
  faTachometerAlt, 
  faSignInAlt, 
  faUserPlus 
} from '@fortawesome/free-solid-svg-icons';

// Add all icons to the library so you can use them without importing individually
export const initFontAwesome = () => {
  library.add(
    faUser, 
    faEnvelope, 
    faPhone, 
    faSearch, 
    faSignOutAlt, 
    faArrowLeft, 
    faTimes, 
    faCog, 
    faSun, 
    faMoon, 
    faGraduationCap, 
    faBookOpen, 
    faBell, 
    faHeart, 
    faShareAlt, 
    faTachometerAlt, 
    faSignInAlt, 
    faUserPlus
  );
};

export default initFontAwesome; 