import React, { useState, useEffect } from 'react';
import {
  getMembershipPricing,
  getMembershipBenefits,
  createMembershipEnrollment,
  getMembershipStatus,
  upgradeMembership,
  renewMembership,
  cancelMembership,
  toggleAutoRenewal,
  calculateMembershipPricing,
  formatMembershipDuration,
  isMembershipExpiringSoon,
  type TMembershipType,
  type IMembershipPricing,
  type IMembershipEnrollment,
  type IMembershipEnrollmentInput
} from './index';

// ==================== EXAMPLE 1: Membership Pricing Display ====================

export const MembershipPricingExample = () => {
  const [pricingPlans, setPricingPlans] = useState<IMembershipPricing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await getMembershipPricing();
        if (response.status === 'success' && response.data) {
          setPricingPlans(response.data.pricing_plans);
        }
      } catch (error) {
        console.error('Failed to fetch pricing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  if (loading) return <div>Loading pricing...</div>;

  return (
    <div className="pricing-container">
      <h2>Membership Plans</h2>
      <div className="pricing-grid">
        {pricingPlans.map((plan) => (
          <div key={`${plan.membership_type}-${plan.duration_months}`} className="pricing-card">
            <h3>{plan.membership_type.toUpperCase()}</h3>
            <p>{formatMembershipDuration(plan.duration_months)}</p>
            <div className="price">
              <span className="currency">₹</span>
              <span className="amount">{plan.price_inr}</span>
              {plan.original_price_inr && plan.original_price_inr > plan.price_inr && (
                <span className="original-price">₹{plan.original_price_inr}</span>
              )}
            </div>
            {plan.discount_percentage && (
              <div className="discount">{plan.discount_percentage}% OFF</div>
            )}
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== EXAMPLE 2: Membership Enrollment ====================

export const MembershipEnrollmentExample = () => {
  const [selectedMembership, setSelectedMembership] = useState<TMembershipType>('silver');
  const [selectedDuration, setSelectedDuration] = useState(12);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleEnrollment = async () => {
    setLoading(true);
    
    try {
      const enrollmentData: IMembershipEnrollmentInput = {
        membership_type: selectedMembership,
        duration_months: selectedDuration,
        billing_cycle: 'annually',
        auto_renewal: true,
        selected_categories: selectedCategories,
        payment_info: {
          amount: calculateMembershipPricing(selectedMembership, selectedDuration).final_price,
          currency: 'INR',
          payment_method: 'upi',
          transaction_id: 'TXN' + Date.now()
        }
      };

      const response = await createMembershipEnrollment(enrollmentData);
      
      if (response.status === 'success') {
        console.log('Enrollment successful:', response.data);
        alert('Membership enrolled successfully!');
      } else {
        console.error('Enrollment failed:', response.error);
        alert('Enrollment failed. Please try again.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('An error occurred during enrollment.');
    } finally {
      setLoading(false);
    }
  };

  const pricing = calculateMembershipPricing(selectedMembership, selectedDuration);

  return (
    <div className="enrollment-form">
      <h2>Enroll in Membership</h2>
      
      <div className="membership-selection">
        <h3>Select Membership Type</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="silver"
              checked={selectedMembership === 'silver'}
              onChange={(e) => setSelectedMembership(e.target.value as TMembershipType)}
            />
            Silver Membership (1 Category)
          </label>
          <label>
            <input
              type="radio"
              value="gold"
              checked={selectedMembership === 'gold'}
              onChange={(e) => setSelectedMembership(e.target.value as TMembershipType)}
            />
            Gold Membership (3 Categories)
          </label>
        </div>
      </div>

      <div className="duration-selection">
        <h3>Select Duration</h3>
        <select 
          value={selectedDuration} 
          onChange={(e) => setSelectedDuration(Number(e.target.value))}
        >
          <option value={1}>1 Month - ₹{calculateMembershipPricing(selectedMembership, 1).final_price}</option>
          <option value={3}>3 Months - ₹{calculateMembershipPricing(selectedMembership, 3).final_price}</option>
          <option value={6}>6 Months - ₹{calculateMembershipPricing(selectedMembership, 6).final_price}</option>
          <option value={12}>12 Months - ₹{calculateMembershipPricing(selectedMembership, 12).final_price}</option>
        </select>
      </div>

      <div className="pricing-summary">
        <h3>Pricing Summary</h3>
        <p>Duration: {formatMembershipDuration(selectedDuration)}</p>
        <p>Price: ₹{pricing.final_price}</p>
        {pricing.savings_compared_to_monthly > 0 && (
          <p className="savings">You save ₹{pricing.savings_compared_to_monthly} compared to monthly!</p>
        )}
      </div>

      <button 
        onClick={handleEnrollment}
        disabled={loading}
        className="enroll-button"
      >
        {loading ? 'Processing...' : `Enroll for ₹${pricing.final_price}`}
      </button>
    </div>
  );
};

// ==================== EXAMPLE 3: Membership Status Dashboard ====================

export const MembershipStatusExample = () => {
  const [membershipData, setMembershipData] = useState<IMembershipEnrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRenewalLoading, setAutoRenewalLoading] = useState(false);

  useEffect(() => {
    const fetchMembershipStatus = async () => {
      try {
        const response = await getMembershipStatus();
        if (response.status === 'success' && response.data?.enrollment) {
          setMembershipData(response.data.enrollment);
        }
      } catch (error) {
        console.error('Failed to fetch membership status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipStatus();
  }, []);

  const handleAutoRenewalToggle = async () => {
    if (!membershipData) return;
    
    setAutoRenewalLoading(true);
    try {
      const newEnabled = !membershipData.auto_renewal.enabled;
      const response = await toggleAutoRenewal(membershipData._id, newEnabled);
      
      if (response.status === 'success') {
        setMembershipData(prev => prev ? {
          ...prev,
          auto_renewal: { ...prev.auto_renewal, enabled: newEnabled }
        } : null);
      }
    } catch (error) {
      console.error('Failed to toggle auto-renewal:', error);
    } finally {
      setAutoRenewalLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!membershipData || membershipData.membership_type === 'gold') return;

    try {
      const upgradeData = {
        new_membership_type: 'gold' as TMembershipType,
        payment_info: {
          amount: 2000, // Upgrade price
          currency: 'INR',
          payment_method: 'upi' as const,
          transaction_id: 'UPG' + Date.now()
        }
      };

      const response = await upgradeMembership(membershipData._id, upgradeData);
      
      if (response.status === 'success') {
        alert('Upgrade successful!');
        // Refresh membership data
        window.location.reload();
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Upgrade failed. Please try again.');
    }
  };

  if (loading) return <div>Loading membership status...</div>;

  if (!membershipData) {
    return (
      <div className="no-membership">
        <h2>No Active Membership</h2>
        <p>You don't have an active membership. Enroll now to get started!</p>
        <button onClick={() => window.location.href = '/membership/enroll'}>
          Enroll Now
        </button>
      </div>
    );
  }

  const isExpiringSoon = isMembershipExpiringSoon(membershipData.expiry_date);
  const daysRemaining = Math.ceil(
    (new Date(membershipData.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="membership-dashboard">
      <div className="membership-card">
        <div className="membership-header">
          <h2>{membershipData.membership_type.toUpperCase()} Membership</h2>
          <span className={`status ${membershipData.status}`}>
            {membershipData.status.toUpperCase()}
          </span>
        </div>

        <div className="membership-details">
          <div className="detail-item">
            <span className="label">Enrollment Date:</span>
            <span className="value">{new Date(membershipData.enrollment_date).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <span className="label">Expiry Date:</span>
            <span className="value">{new Date(membershipData.expiry_date).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <span className="label">Days Remaining:</span>
            <span className={`value ${isExpiringSoon ? 'warning' : ''}`}>
              {daysRemaining} days
            </span>
          </div>
          <div className="detail-item">
            <span className="label">Selected Categories:</span>
            <span className="value">{membershipData.selected_categories.join(', ')}</span>
          </div>
        </div>

        {isExpiringSoon && (
          <div className="expiry-warning">
            ⚠️ Your membership expires soon! Consider renewing to continue enjoying benefits.
          </div>
        )}

        <div className="membership-actions">
          <div className="auto-renewal">
            <label>
              <input
                type="checkbox"
                checked={membershipData.auto_renewal.enabled}
                onChange={handleAutoRenewalToggle}
                disabled={autoRenewalLoading}
              />
              Auto-renewal {autoRenewalLoading ? '(updating...)' : ''}
            </label>
          </div>

          {membershipData.membership_type === 'silver' && (
            <button onClick={handleUpgrade} className="upgrade-button">
              Upgrade to Gold
            </button>
          )}

          <button 
            onClick={() => window.location.href = `/membership/${membershipData._id}/renew`}
            className="renew-button"
          >
            Renew Membership
          </button>
        </div>
      </div>

      <div className="usage-stats">
        <h3>Usage Statistics</h3>
        {membershipData.usage_stats && (
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{membershipData.usage_stats.courses_accessed}</span>
              <span className="stat-label">Courses Accessed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{membershipData.usage_stats.total_learning_hours || 0}h</span>
              <span className="stat-label">Learning Hours</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{membershipData.usage_stats.categories_used.length}</span>
              <span className="stat-label">Categories Used</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== EXAMPLE 4: Admin Membership Management ====================

export const AdminMembershipExample = () => {
  const [memberships, setMemberships] = useState<IMembershipEnrollment[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'active' as const,
    membership_type: 'all',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membershipsResponse, statsResponse] = await Promise.all([
          getAllMemberships(filters),
          getMembershipStatistics()
        ]);

        if (membershipsResponse.status === 'success') {
          setMemberships(membershipsResponse.data?.enrollments || []);
        }

        if (statsResponse.status === 'success') {
          setStatistics(statsResponse.data?.statistics);
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleStatusUpdate = async (enrollmentId: string, newStatus: string) => {
    try {
      const response = await updateMembershipStatus(enrollmentId, newStatus as any, 'Admin update');
      
      if (response.status === 'success') {
        // Refresh the list
        setMemberships(prev => 
          prev.map(m => m._id === enrollmentId ? { ...m, status: newStatus as any } : m)
        );
        alert('Status updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading admin data...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Membership Management</h1>
      </div>

      {statistics && (
        <div className="stats-overview">
          <div className="stat-card">
            <h3>Total Memberships</h3>
            <p>{statistics.overview.total_memberships}</p>
          </div>
          <div className="stat-card">
            <h3>Active Memberships</h3>
            <p>{statistics.overview.active_memberships}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>₹{statistics.overview.total_revenue.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>MRR</h3>
            <p>₹{statistics.overview.monthly_recurring_revenue.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="filters">
        <select 
          value={filters.status} 
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
        >
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
          <option value="suspended">Suspended</option>
        </select>

        <select 
          value={filters.membership_type} 
          onChange={(e) => setFilters(prev => ({ ...prev, membership_type: e.target.value }))}
        >
          <option value="all">All Types</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
        </select>
      </div>

      <div className="memberships-table">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Enrollment Date</th>
              <th>Expiry Date</th>
              <th>Amount Paid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership) => (
              <tr key={membership._id}>
                <td>{membership.user_id}</td>
                <td>{membership.membership_type.toUpperCase()}</td>
                <td>
                  <span className={`status ${membership.status}`}>
                    {membership.status}
                  </span>
                </td>
                <td>{new Date(membership.enrollment_date).toLocaleDateString()}</td>
                <td>{new Date(membership.expiry_date).toLocaleDateString()}</td>
                <td>₹{membership.pricing.paid_amount}</td>
                <td>
                  <select 
                    value={membership.status}
                    onChange={(e) => handleStatusUpdate(membership._id, e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==================== EXAMPLE 5: Membership Benefits Display ====================

export const MembershipBenefitsExample = () => {
  const [silverBenefits, setSilverBenefits] = useState<any>(null);
  const [goldBenefits, setGoldBenefits] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const [silverResponse, goldResponse] = await Promise.all([
          getMembershipBenefits('silver'),
          getMembershipBenefits('gold')
        ]);

        if (silverResponse.status === 'success') {
          setSilverBenefits(silverResponse.data?.benefits);
        }

        if (goldResponse.status === 'success') {
          setGoldBenefits(goldResponse.data?.benefits);
        }
      } catch (error) {
        console.error('Failed to fetch benefits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  if (loading) return <div>Loading benefits...</div>;

  return (
    <div className="benefits-comparison">
      <h2>Membership Benefits</h2>
      
      <div className="benefits-grid">
        {silverBenefits && (
          <div className="benefit-card silver">
            <div className="card-header">
              <h3>{silverBenefits.tier_name}</h3>
              <p>{silverBenefits.description}</p>
            </div>
            <div className="features-list">
              <h4>Course Access</h4>
              <p>{silverBenefits.features.course_access.description}</p>
              
              <h4>Support Features</h4>
              <ul>
                {silverBenefits.features.support_features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              
              <h4>Additional Benefits</h4>
              <ul>
                {silverBenefits.features.additional_benefits.map((benefit: string, index: number) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            <div className="ideal-for">
              <strong>Ideal for:</strong> {silverBenefits.ideal_for}
            </div>
          </div>
        )}

        {goldBenefits && (
          <div className="benefit-card gold">
            <div className="card-header">
              <h3>{goldBenefits.tier_name}</h3>
              <p>{goldBenefits.description}</p>
            </div>
            <div className="features-list">
              <h4>Course Access</h4>
              <p>{goldBenefits.features.course_access.description}</p>
              
              <h4>Support Features</h4>
              <ul>
                {goldBenefits.features.support_features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              
              <h4>Additional Benefits</h4>
              <ul>
                {goldBenefits.features.additional_benefits.map((benefit: string, index: number) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            <div className="ideal-for">
              <strong>Ideal for:</strong> {goldBenefits.ideal_for}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== STYLING (Optional CSS-in-JS or use with external CSS) ====================

export const membershipStyles = `
.pricing-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.pricing-card {
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  position: relative;
}

.pricing-card.popular {
  border-color: #3b82f6;
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
}

.price {
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0;
}

.original-price {
  text-decoration: line-through;
  color: #6b7280;
  font-size: 1.5rem;
  margin-left: 0.5rem;
}

.discount {
  background: #ef4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  display: inline-block;
  margin-bottom: 1rem;
}

.features {
  list-style: none;
  padding: 0;
  text-align: left;
}

.features li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.features li:before {
  content: "✓";
  color: #10b981;
  margin-right: 0.5rem;
}

.enrollment-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

.enroll-button {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 2rem;
}

.enroll-button:hover {
  background: #2563eb;
}

.enroll-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.membership-dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.membership-card {
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.membership-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status.active {
  background: #d1fae5;
  color: #065f46;
}

.status.expired {
  background: #fee2e2;
  color: #991b1b;
}

.membership-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
}

.value {
  font-size: 1rem;
}

.value.warning {
  color: #ef4444;
  font-weight: 600;
}

.expiry-warning {
  background: #fef3c7;
  color: #92400e;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.membership-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.upgrade-button,
.renew-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.upgrade-button {
  background: #f59e0b;
  color: white;
}

.renew-button {
  background: #10b981;
  color: white;
}

.usage-stats {
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 1rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.stat-card p {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.memberships-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e1e5e9;
}

.memberships-table table {
  width: 100%;
  border-collapse: collapse;
}

.memberships-table th,
.memberships-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.memberships-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.benefits-comparison {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
  margin-top: 2rem;
}

.benefit-card {
  border: 2px solid;
  border-radius: 16px;
  padding: 2rem;
  position: relative;
}

.benefit-card.silver {
  border-color: #6b7280;
}

.benefit-card.gold {
  border-color: #f59e0b;
}

.card-header h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.features-list h4 {
  margin: 1.5rem 0 0.5rem 0;
  color: #374151;
}

.features-list ul {
  list-style: none;
  padding: 0;
}

.features-list li {
  padding: 0.25rem 0;
}

.features-list li:before {
  content: "✓";
  color: #10b981;
  margin-right: 0.5rem;
}

.ideal-for {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .membership-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;

export default {
  MembershipPricingExample,
  MembershipEnrollmentExample,
  MembershipStatusExample,
  AdminMembershipExample,
  MembershipBenefitsExample,
  membershipStyles
}; 