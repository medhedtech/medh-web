# MFA Testing Guide

## Quick Testing Instructions

### 🔧 Prerequisites
1. Ensure the backend MFA endpoints are implemented
2. Have a mobile device with an authenticator app (Google Authenticator, Authy, etc.)
3. Access to SMS receiving capability for testing

### 🧪 Testing the Student Profile MFA Integration

#### 1. Navigate to Security Settings
```
1. Go to: https://www.medh.co/dashboards/student/profile/
2. Click on the "Security & Devices" tab
3. Scroll to the "Multi-Factor Authentication" section
```

#### 2. Test TOTP Setup
```
1. Click "Setup with Authenticator App"
2. Scan the QR code with your authenticator app
3. Enter the 6-digit code from your app
4. Save the backup codes that are generated
5. Verify MFA status shows "Enabled"
```

#### 3. Test SMS Setup (Alternative)
```
1. Click "Setup with SMS"
2. Enter your phone number
3. Wait for SMS code
4. Enter the received code
5. Save the backup codes
```

#### 4. Test MFA Management
```
1. View backup codes
2. Test regenerating backup codes
3. Test disabling MFA (requires password + code)
```

### 🔐 Testing the Login Flow MFA

#### 1. Enable MFA First
```
- Complete the profile setup above
- Ensure MFA is enabled on your account
```

#### 2. Test Login with MFA
```
1. Logout from your account
2. Go to: https://www.medh.co/login
3. Enter email and password
4. Complete email verification (if required)
5. **NEW: MFA Verification Step**
   - Enter 6-digit code from authenticator app
   - OR enter SMS code (if SMS method)
   - OR use backup code
6. Should redirect to dashboard
```

#### 3. Test Backup Code Login
```
1. Logout and attempt login again
2. At MFA step, click "Use backup code instead"
3. Enter one of your saved backup codes
4. Should complete login successfully
5. Note: Backup code is now used and invalid
```

#### 4. Test SMS Resend
```
1. If using SMS method
2. At MFA step, wait for cooldown
3. Click "Resend SMS Code"
4. Verify new code works
```

### 🔍 Visual Verification Points

#### Profile Page Security Tab
- [ ] MFA status indicator (Enabled/Disabled)
- [ ] Professional glassmorphism design
- [ ] Setup buttons for TOTP and SMS
- [ ] QR code display for TOTP setup
- [ ] Backup codes management
- [ ] Security recommendations section
- [ ] Advanced security settings

#### Login Flow
- [ ] Stepper UI showing progress (Login → Email → **MFA** → Dashboard)
- [ ] MFA verification form
- [ ] Method-specific instructions
- [ ] Backup code toggle
- [ ] SMS resend functionality
- [ ] Recovery links

### 🐛 Common Issues & Solutions

#### QR Code Not Displaying
```
- Check browser console for errors
- Verify auth.api.ts MFA endpoints are accessible
- Ensure QR code generation is working
```

#### SMS Not Received
```
- Verify phone number format
- Check SMS service configuration
- Test with different phone numbers
```

#### Backup Codes Not Working
```
- Ensure codes are entered exactly as shown
- Check for extra spaces or formatting
- Verify codes haven't been used already
```

#### Login Flow Not Showing MFA
```
- Verify MFA is enabled in profile
- Check authUtils.isMFARequired() logic
- Ensure API returns requires_mfa: true
```

### 📱 Mobile Testing

#### Responsive Design
- [ ] Test on iPhone (375px width)
- [ ] Test on Android (360px width)
- [ ] Test on tablet (768px width)
- [ ] Verify touch targets are 44px minimum
- [ ] Check text readability

#### Accessibility
- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Color contrast

### 🔧 Developer Testing

#### API Integration
```typescript
// Test MFA status
const status = await authUtils.getMFAStatus();
console.log('MFA Status:', status);

// Test TOTP setup
const totp = await authUtils.setupTOTP();
console.log('TOTP Setup:', totp);

// Test verification
const verify = await authUtils.verifyMFA(userId, code);
console.log('Verification:', verify);
```

#### Component Integration
```jsx
// Test MFA component
<MFAManagement 
  onStatusChange={(enabled) => console.log('MFA Status Changed:', enabled)}
/>
```

### ✅ Success Criteria

#### Functional Requirements
- [ ] TOTP setup works end-to-end
- [ ] SMS setup works end-to-end
- [ ] Login flow includes MFA verification
- [ ] Backup codes work for authentication
- [ ] MFA can be disabled securely
- [ ] Recovery process is accessible

#### User Experience
- [ ] Professional, modern design
- [ ] Clear instructions and feedback
- [ ] Error handling is user-friendly
- [ ] Responsive across all devices
- [ ] Accessible to all users

#### Security
- [ ] Codes are validated properly
- [ ] Sessions are managed securely
- [ ] Backup codes are single-use
- [ ] Recovery requires proper verification

### 🚀 Production Readiness Checklist

#### Backend
- [ ] All MFA endpoints implemented
- [ ] Rate limiting configured
- [ ] Error handling implemented
- [ ] Security logging active

#### Frontend
- [ ] All components tested
- [ ] Error boundaries in place
- [ ] Loading states implemented
- [ ] Accessibility verified

#### Integration
- [ ] End-to-end flows tested
- [ ] Cross-browser compatibility
- [ ] Mobile device testing
- [ ] Performance optimization

---

## 🎯 Ready for Production!

Once all tests pass, the MFA integration is ready for production deployment. The system provides enterprise-grade security while maintaining an excellent user experience across all devices and use cases. 