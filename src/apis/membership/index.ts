// Export all membership-related types and interfaces
export type {
  TMembershipType,
  TMembershipStatus,
  TBillingCycle,
  TPaymentStatus,
  TPaymentMethod,
  TAutoRenewalStatus,
  IMembershipPricing,
  IMembershipBenefits,
  IPaymentInfo,
  IMembershipEnrollmentInput,
  IMembershipPayment,
  IMembershipEnrollment,
  IMembershipUpgradeInput,
  IMembershipRenewalInput,
  IMembershipCancellationInput,
  IMembershipQueryParams,
  IMembershipStatistics,
  IMembershipEnrollmentResponse,
  IMembershipStatusResponse,
  IMembershipListResponse,
  IMembershipPricingResponse,
  IMembershipBenefitsResponse,
  IMembershipStatsResponse
} from './membership';

// Export all membership API functions
export {
  // Public APIs
  getMembershipPricing,
  getMembershipBenefits,
  getAllMembershipBenefits,
  
  // Student APIs
  createMembershipEnrollment,
  getMembershipStatus,
  upgradeMembership,
  renewMembership,
  getMembershipPayments,
  cancelMembership,
  toggleAutoRenewal,
  updateSelectedCategories,
  getMembershipUsage,
  
  // Admin APIs
  getAllMemberships,
  getMembershipStatistics,
  getMembershipById,
  updateMembershipStatus,
  processMembershipRenewal,
  getUpcomingRenewals,
  processBulkRenewal,
  exportMembershipsData,
  
  // Utility functions
  calculateMembershipPricing,
  formatMembershipDuration,
  getBillingCycleFromDuration,
  isMembershipExpiringSoon,
  getMembershipStatusColor,
  validateMembershipEnrollmentData
} from './membership';

// Default export
export { default } from './membership';

// Re-export everything as a namespace for organized imports
import * as MembershipAPI from './membership';
export { MembershipAPI }; 