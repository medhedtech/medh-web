# MEDH Sales Dashboard - Professional Form Management System

A comprehensive, user-friendly sales dashboard designed for non-technical users to manage form submissions, leads, and customer inquiries efficiently.

## 🌟 Features

### 📊 **Dashboard Overview**
- **Real-time Statistics**: Total forms, pending reviews, confirmed leads, urgent items
- **Visual Analytics**: Conversion rates, response times, and performance metrics
- **Professional UI**: Clean, intuitive design with glassmorphism effects
- **Mobile-First**: Fully responsive across all devices

### 📋 **Form Categories**
- **Demo Sessions**: Free demo bookings with scheduling details
- **Corporate Training**: Business training inquiries with team size and budget
- **Course Enrollment**: Paid course registrations with payment status
- **General Contact**: Customer inquiries and support requests
- **Partnerships**: Business partnership opportunities
- **Educator Applications**: Instructor application submissions

### 🔍 **Advanced Filtering**
- **Category Filter**: Filter by form type (Demo, Corporate, Enrollment, etc.)
- **Status Filter**: New, Pending, Confirmed, Processing, Completed, Cancelled
- **Priority Filter**: Low, Medium, High, Urgent
- **Date Range**: Today, This Week, This Month, Custom ranges
- **Search**: Name, email, phone, course, company
- **Real-time Filtering**: Instant results as you type

### ⚡ **Quick Actions**
- **One-Click Actions**: Call, Email, View Details, Confirm
- **Bulk Operations**: Confirm multiple forms, send bulk emails
- **Status Updates**: Change form status with notes
- **Export Data**: CSV, Excel, PDF formats

### 🔐 **Authentication & Security**
- **Role-Based Access**: Admin, Manager, Agent permissions
- **Secure Login**: JWT token-based authentication
- **Session Management**: Auto-logout and token refresh
- **Protected Routes**: Authentication required for all dashboard access

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Express backend API running
- MongoDB database connected
- Sales user accounts created

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medh-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # .env.local
   JWT_SECRET=your-jwt-secret-key
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Sales Login Credentials

#### Demo Accounts
- **Admin**: `admin@medh.com` / `admin123`
- **Manager**: `manager@medh.com` / `manager123`
- **Agent**: `agent@medh.com` / `agent123`

## 📱 User Guide

### 🔑 **Logging In**

1. Navigate to `/sales/login`
2. Enter your email and password
3. Click "Sign In" to access the dashboard
4. Use "Remember me" for convenience (optional)

### 🏠 **Dashboard Navigation**

#### **Main Sections**
- **Statistics Cards**: Quick overview of key metrics
- **Form Categories**: Visual category selection
- **Search & Filters**: Advanced filtering options
- **Forms Grid**: Card-based form display

#### **Quick Actions**
- **📞 Call**: Initiate phone call to customer
- **✉️ Email**: Send email to customer
- **👁️ View**: View detailed form information
- **✅ Confirm**: Mark form as confirmed

### 🔍 **Filtering Forms**

#### **By Category**
Click on category buttons to filter:
- All Forms
- Demo Sessions
- Corporate Training
- Course Enrollment
- General Contact
- Partnerships
- Educator Applications

#### **Advanced Filters**
1. Click "Filters" button
2. Select from dropdowns:
   - **Status**: Filter by processing status
   - **Priority**: Filter by urgency level
   - **Date Range**: Filter by submission date
3. Click "Clear Filters" to reset

#### **Search**
- Type in the search box to find forms by:
  - Customer name
  - Email address
  - Phone number
  - Course name
  - Company name

### 📊 **Understanding Form Cards**

Each form card displays:
- **Header**: Customer name, form type, priority badge
- **Contact Info**: Email, phone, location
- **Course/Service**: Requested course or service
- **Timing**: Preferred dates and times (for demos)
- **Status Badge**: Current processing status
- **Action Buttons**: Quick action options

### ⚡ **Performing Actions**

#### **Single Form Actions**
1. Locate the form card
2. Click the appropriate action button:
   - **Call**: Opens dialer or phone app
   - **Email**: Opens email client
   - **View**: Shows detailed information
   - **Confirm**: Updates status to confirmed

#### **Bulk Actions**
1. Select multiple forms (checkboxes)
2. Choose bulk action from dropdown:
   - Confirm All
   - Send Bulk Email
   - Update Status
   - Export Selected

### 📤 **Exporting Data**

1. Apply desired filters
2. Click "Export" button
3. Choose format:
   - **CSV**: For spreadsheet applications
   - **Excel**: For Microsoft Excel
   - **PDF**: For reports and presentations

## 🛠️ Technical Architecture

### **Frontend Stack**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Lucide React**: Modern icons

### **State Management**
- **Custom Hooks**: `useFormsData`, `useSalesAuth`
- **React Query**: Data fetching and caching
- **Local State**: React useState for UI state

### **API Integration**
- **Express Backend**: RESTful API endpoints
- **JWT Authentication**: Secure token-based auth
- **Real-time Updates**: Automatic data refresh
- **Error Handling**: Comprehensive error management

### **Key Components**

#### **SalesDashboard.tsx**
Main dashboard component with:
- Statistics display
- Category filtering
- Form grid layout
- Search and filter controls

#### **useFormsData.ts**
Custom hook managing:
- Form data fetching
- Filter state management
- API interactions
- Error handling

#### **useSalesAuth.ts**
Authentication hook handling:
- User login/logout
- Token management
- Permission checking
- Session persistence

## 🎨 Design System

### **Color Scheme**
- **Primary**: Blue (#3B82F6) for main actions
- **Success**: Green (#10B981) for confirmations
- **Warning**: Orange (#F59E0B) for attention
- **Error**: Red (#EF4444) for issues
- **Neutral**: Gray shades for backgrounds

### **Typography**
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable, accessible sizing
- **Labels**: Medium weight for clarity
- **Captions**: Subtle for secondary info

### **Spacing**
- **Cards**: Generous padding for readability
- **Grid**: Consistent gaps between elements
- **Buttons**: Adequate touch targets (44px+)
- **Forms**: Logical grouping and spacing

### **Responsive Design**
- **Mobile**: Single column, touch-friendly
- **Tablet**: Two columns, optimized layout
- **Desktop**: Three+ columns, full features
- **Large Screens**: Maximum width constraints

## 🔧 Customization

### **Adding New Form Types**

1. **Update formCategories array**:
   ```typescript
   {
     id: "new_type",
     name: "New Type",
     icon: IconComponent,
     color: "bg-color-50 dark:bg-color-900/20",
     iconColor: "text-color-600",
     description: "Description"
   }
   ```

2. **Update API endpoints** to handle new type

3. **Add to filtering logic** in useFormsData hook

### **Customizing Status Options**

Update `statusConfig` object:
```typescript
const statusConfig = {
  new_status: { 
    label: "New Status", 
    color: "bg-blue-100 text-blue-800", 
    icon: "🆕" 
  }
};
```

### **Adding Quick Actions**

1. **Add button to FormCard component**
2. **Update handleQuickAction function**
3. **Implement API call for new action**

## 🐛 Troubleshooting

### **Common Issues**

#### **Login Problems**
- Check credentials are correct
- Verify backend API is running
- Check network connectivity
- Clear browser cache/localStorage

#### **Forms Not Loading**
- Check API endpoint availability
- Verify authentication token
- Check browser console for errors
- Try refreshing the page

#### **Filters Not Working**
- Clear all filters and try again
- Check for JavaScript errors
- Verify API query parameters
- Refresh the page

#### **Export Not Working**
- Check file download permissions
- Verify API export endpoint
- Try different export format
- Check browser popup blockers

### **Performance Tips**

1. **Limit Results**: Use date filters for large datasets
2. **Clear Cache**: Refresh page if data seems stale
3. **Browser**: Use modern browsers for best performance
4. **Network**: Ensure stable internet connection

## 📞 Support

### **Getting Help**
- **Email**: support@medh.com
- **Documentation**: Check this README
- **Bug Reports**: Create GitHub issue
- **Feature Requests**: Contact development team

### **Training Resources**
- **Video Tutorials**: Available on company portal
- **User Manual**: Detailed step-by-step guide
- **Best Practices**: Recommended workflows
- **FAQ**: Common questions and answers

## 🚀 Future Enhancements

### **Planned Features**
- **Real-time Notifications**: Live updates for new forms
- **Advanced Analytics**: Detailed reporting dashboard
- **Calendar Integration**: Schedule demos directly
- **Mobile App**: Native mobile application
- **AI Insights**: Automated lead scoring
- **Workflow Automation**: Custom approval processes

### **API Improvements**
- **GraphQL**: More efficient data fetching
- **WebSocket**: Real-time updates
- **Caching**: Improved performance
- **Rate Limiting**: Better resource management

---

## 📋 Quick Reference

### **Keyboard Shortcuts**
- `Ctrl/Cmd + K`: Open search
- `Ctrl/Cmd + R`: Refresh data
- `Ctrl/Cmd + E`: Export data
- `Escape`: Close modals/filters

### **Status Meanings**
- **🆕 New**: Just submitted, needs review
- **⏳ Pending**: Under review or processing
- **✅ Confirmed**: Approved and scheduled
- **🔄 Processing**: Currently being handled
- **🎯 Completed**: Successfully finished
- **❌ Cancelled**: Cancelled by customer
- **🚫 Rejected**: Not approved

### **Priority Levels**
- **🔴 Urgent**: Immediate attention required
- **🟡 High**: Important, handle soon
- **🔵 Medium**: Standard priority
- **⚪ Low**: Handle when time permits

This sales dashboard provides a professional, efficient way to manage all form submissions and customer inquiries. The intuitive design ensures that even non-technical users can effectively track leads, manage communications, and drive business growth. 