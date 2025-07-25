import css from 'styled-jsx/css';

/**
 * Dashboard styles separated from components
 * This improves maintainability and keeps component files cleaner
 */
export const dashboardStyles = css`
  /* Hide scrollbar while maintaining functionality */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Gradient styles for GenAlpha features */
  .gen-alpha-gradient {
    background: linear-gradient(to right, #4158D0, #C850C0, #FFCC70);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .gen-alpha-nav {
    background: linear-gradient(to right, rgba(65, 88, 208, 0.05), rgba(200, 80, 192, 0.05), rgba(255, 204, 112, 0.05));
    border-bottom: 2px solid rgba(200, 80, 192, 0.2);
  }
  
  .gen-alpha-button {
    background-size: 200% auto;
    transition: all 0.3s ease;
  }
  
  .gen-alpha-button:hover {
    background-position: right center;
  }
  
  .gen-alpha-active {
    background: linear-gradient(to right, rgba(65, 88, 208, 0.2), rgba(200, 80, 192, 0.2));
    border-left: 3px solid #C850C0;
  }
  
  /* Animation styles */
  .pulsing-dot {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      opacity: 0.7;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(0.95);
      opacity: 0.7;
    }
  }
  
  /* Dropdown menu positioning */
  .dropdown-container {
    position: relative;
  }
  
  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 50;
    width: 15rem;
    transform-origin: top right;
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    .dropdown-menu {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 16px;
      top: auto;
      width: calc(100% - 32px);
      max-width: 20rem;
    }
  }
  
  /* Dashboard content transitions */
  .dashboard-content-enter {
    opacity: 0;
    transform: translateY(10px);
  }
  
  .dashboard-content-enter-active {
    opacity: 1;
    transform: translateY(0px);
    transition: opacity 300ms, transform 300ms;
  }
  
  .dashboard-content-exit {
    opacity: 1;
    transform: translateY(0px);
  }
  
  .dashboard-content-exit-active {
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 300ms, transform 300ms;
  }
  
  /* Elevation and depth effects */
  .elevation-1 {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .elevation-2 {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  }
  
  .elevation-3 {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* Focus and interaction states */
  .focus-ring {
    outline: none;
    transition: box-shadow 0.2s ease-in-out;
  }
  
  .focus-ring:focus-visible {
    box-shadow: 0 0 0 2px rgba(200, 80, 192, 0.4);
  }
`;

export default dashboardStyles; 