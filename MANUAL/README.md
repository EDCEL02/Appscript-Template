# Google Apps Script Web Application Template

A comprehensive, production-ready template for building Google Apps Script web applications with authentication, dashboard, CRUD operations, and modern UI components. Based on the Globe DSCS project, this template provides everything needed to create enterprise-level data management applications.

## 🌟 Features

### Core Functionality
- **User Authentication & Authorization** - Role-based access control (Admin/User/Viewer)
- **Dynamic Google Sheets Integration** - Connect to any Google Spreadsheet
- **CRUD Operations** - Create, Read, Update, Delete data with validation
- **Auto-refresh System** - Intelligent automatic data synchronization with user activity detection
- **Real-time Charts** - Interactive data visualization with Chart.js and theme support
- **CSV Export** - Download filtered data as CSV files
- **Responsive Design** - Bootstrap 5-based UI that works on all devices

### Advanced Features
- **Dark/Light Mode** - Toggle between themes with preference persistence
- **Advanced Filtering** - Multi-criteria search and filter capabilities
- **Pagination** - Efficient handling of large datasets
- **User Management** - Admin can add/remove users dynamically
- **Settings Management** - Configurable application preferences
- **Error Handling** - Comprehensive error handling and user feedback
- **Loading States** - User-friendly loading indicators and transitions
- **Development Utilities** - Built-in testing and debugging tools
- **Performance Monitoring** - Built-in performance tracking and optimization

## 🚀 Quick Start

### Prerequisites
- Google account with Google Apps Script access
- Google Sheets for data storage
- Basic knowledge of HTML, CSS, and JavaScript

### Setup Instructions

1. **Create New Google Apps Script Project**
   ```
   - Go to https://script.google.com
   - Click "New Project"
   - Replace Code.gs content with Code.js from this template
   ```

2. **Upload Template Files**
   ```
   - Copy all .html files to your Apps Script project
   - Copy all .js files (except Code.js which goes in Code.gs)
   - Update appsscript.json with the provided configuration
   ```

3. **Configure Your Application**
   ```
   - Update DEFAULT_SHEET_ID in Code.js with your Google Sheet ID
   - Modify app title and branding in main.html
   - Customize data structure in backend-data-operations.js
   ```

4. **Deploy as Web App**
   ```
   - Click "Deploy" → "New Deployment"
   - Choose "Web app" as type
   - Set execution as "User accessing the web app"
   - Set access to "Anyone with Google account" or as needed
   - Click "Deploy"
   ```

5. **Initial Setup**
   ```
   - Open the deployed web app URL
   - Complete the initial setup form
   - Add admin users and configure Google Sheets connection
   - Start using your application!
   ```

## 📁 File Structure

```
├── Code.js                      # Main backend entry point
├── appsscript.json              # Apps Script configuration
├── package.json                 # Project metadata and scripts
├── .clasp.json                  # Clasp configuration (update with your script ID)
│
├── Backend Files/
│   ├── backend-authentication.js    # User auth and management
│   └── backend-data-operations.js   # CRUD operations
│
├── Frontend Views/
│   ├── main.html                    # Main HTML structure
│   ├── sidebar.html                 # Navigation sidebar
│   ├── dashboard-view.html          # Dashboard interface
│   ├── data-view.html              # Data management interface
│   ├── settings-view.html          # Settings page
│   ├── help-view.html              # Help documentation
│   ├── setup-form.html             # Initial setup form
│   └── unauthorized-view.html      # Access denied page
│
├── Styling/
│   └── styles.html                 # CSS styles and themes
│
└── JavaScript/
    ├── authentication-js.html      # Authentication logic
    ├── initialization-js.html      # Setup and initialization
    ├── sidebar-js.html             # Navigation functionality
    ├── data-management-js.html     # Data CRUD operations
    ├── settings-js.html            # Settings management
    ├── auto-refresh-js.html        # Auto-refresh system
    └── main-js.html                # Main application logic
```

## 🔧 Customization Guide

### Data Structure
Modify the data structure in `backend-data-operations.js`:
```javascript
// Update column headers and data fields
sheet.appendRow([
  newId,                    // ID
  data.yourField1 || '',    // Your Field 1
  data.yourField2 || '',    // Your Field 2
  // Add more fields as needed
]);
```

### UI Theming
Customize the appearance in `styles.html`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* Update color variables */
}
```

### User Roles
Extend user roles in `backend-authentication.js`:
```javascript
// Add new role types and permissions
function getUserAuthStatus() {
  // Add custom role logic
}
```

### Navigation
Add new sections in `sidebar.html`:
```html
<li class="nav-item">
  <a class="nav-link" onclick="showSection('yourView', this)">
    <i class="bi bi-your-icon me-2"></i>
    <span>Your Section</span>
  </a>
</li>
```

## 🛠️ Development

### Local Development with Clasp
```bash
# Install clasp globally
npm install -g @google/clasp

# Login to Google Apps Script
clasp login

# Clone existing project
clasp clone YOUR_SCRIPT_ID

# Push changes
clasp push

# Deploy
clasp deploy --description "Your deployment description"
```

### Project Scripts
```bash
# Install dependencies
npm install

# Push to Google Apps Script
npm run push

# Deploy new version
npm run deploy

# View logs
npm run logs
```

## 📊 Data Management

### Google Sheets Setup
Your Google Sheet should have these columns for the default data structure:
- Column A: ID (auto-generated)
- Column B: Name
- Column C: Description  
- Column D: Category
- Column E: Value
- Column F: Created Date
- Column G: Created By

### CRUD Operations
The template provides complete CRUD functionality:
- **Create**: Add new records with validation
- **Read**: Filter, search, and paginate data
- **Update**: Edit existing records
- **Delete**: Remove single or multiple records

## 🔐 Security & Authentication

### User Management
- **Admin Users**: Full access to all features including user management
- **Regular Users**: Access to data viewing and basic operations
- **Unauthorized Users**: Shown access denied page

### Best Practices
- Always validate user permissions on the backend
- Use script properties for sensitive configuration
- Implement proper error handling
- Log important actions for auditing

## 🎨 UI Components

### Available Components
- **Cards**: Information containers with headers and bodies
- **Tables**: Sortable, filterable data tables with pagination
- **Charts**: Interactive charts using Chart.js
- **Modals**: Pop-up forms for data entry and confirmation
- **Notifications**: Toast-style messages for user feedback
- **Loading States**: Spinners and progress indicators

### Bootstrap Integration
The template uses Bootstrap 5.3+ for:
- Responsive grid system
- Form components
- Navigation components
- Utility classes

## 🔄 Auto-Refresh System

### Configuration
```javascript
// Customize refresh intervals
const REFRESH_INTERVALS = {
  fast: 15000,    // 15 seconds
  normal: 30000,  // 30 seconds (default)
  slow: 60000     // 1 minute
};
```

### Features
- **Smart Refreshing**: Pauses during user interaction
- **View-Specific**: Only refreshes the active view
- **Background Awareness**: Pauses when tab is not visible
- **Configurable**: Users can set custom intervals

## 📚 Complete Documentation

This template includes comprehensive documentation to help you get started and extend the application:

### Quick Start
- **TEMPLATE-SUMMARY.md** - Overview and quick start guide
- **DEPLOYMENT-GUIDE.md** - Step-by-step deployment instructions
- **README.md** - This file with basic setup and usage

### Configuration & Customization
- **CONFIGURATION-EXAMPLES.md** - Extensive customization examples
- **ENVIRONMENT-CONFIG.md** - Environment-specific setup templates
- **ADVANCED-FEATURES.md** - Enterprise-level features and extensions

### Development & Testing
- **TESTING-GUIDE.md** - Comprehensive testing strategies and utilities
- **development-utilities.js** - Built-in development and testing tools
- **.github/copilot-instructions.md** - Development guidelines for GitHub Copilot

### File Structure
```
📁 Template/
├── 📄 Core Backend Files
│   ├── Code.js                     # Main backend entry point
│   ├── backend-authentication.js   # User authentication system  
│   ├── backend-data-operations.js  # CRUD operations with validation
│   └── development-utilities.js    # Testing and development tools
│
├── 📄 Frontend Views
│   ├── main.html                   # Primary application interface
│   ├── dashboard-view.html         # Statistics and charts dashboard
│   ├── data-view.html             # Data management interface
│   ├── settings-view.html         # User and system settings
│   ├── setup-form.html            # Initial application setup
│   ├── help-view.html             # Help and FAQ section
│   ├── sidebar.html               # Navigation sidebar
│   └── unauthorized-view.html     # Access denied page
│
├── 📄 JavaScript Modules
│   ├── main-js.html               # Core application logic
│   ├── authentication-js.html     # Login/logout functionality
│   ├── data-management-js.html    # Data operations and charts
│   ├── sidebar-js.html            # Navigation and theme controls
│   ├── auto-refresh-js.html       # Intelligent refresh system
│   ├── settings-js.html           # Settings management
│   └── initialization-js.html     # Setup and initialization
│
├── 📄 Styling & Configuration
│   ├── styles.html                # Complete CSS with theming
│   ├── appsscript.json           # Apps Script manifest
│   ├── .clasp.json               # Deployment configuration
│   └── package.json              # Project metadata
│
└── 📄 Documentation
    ├── README.md                  # This file
    ├── TEMPLATE-SUMMARY.md        # Quick start and overview
    ├── DEPLOYMENT-GUIDE.md        # Deployment instructions
    ├── CONFIGURATION-EXAMPLES.md  # Customization examples
    ├── ENVIRONMENT-CONFIG.md      # Environment setup
    ├── ADVANCED-FEATURES.md       # Enterprise features
    ├── TESTING-GUIDE.md          # Testing strategies
    └── .github/copilot-instructions.md # Development guidelines
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 991px
- **Desktop**: > 992px

### Mobile Optimizations
- Collapsible sidebar navigation
- Touch-friendly button sizes
- Responsive tables with horizontal scroll
- Optimized form layouts

## 🚀 Deployment

### Production Checklist
- [ ] Update `DEFAULT_SHEET_ID` with your production sheet
- [ ] Configure proper user permissions
- [ ] Test all CRUD operations
- [ ] Verify authentication flow
- [ ] Test responsive design on multiple devices
- [ ] Set up proper error monitoring

### Version Management
```bash
# Create new deployment
clasp deploy --description "Version 1.0.0 - Initial release"

# List deployments
clasp deployments

# Update existing deployment
clasp deploy --deploymentId YOUR_DEPLOYMENT_ID
```

## 🐛 Troubleshooting

### Common Issues

**Authentication Problems**
- Verify user emails are correctly formatted
- Check script properties are set correctly
- Ensure Google Sheets permissions are configured

**Data Loading Issues**
- Verify Google Sheets ID is correct
- Check sheet name matches code expectations
- Ensure proper column structure

**UI Problems**
- Clear browser cache and cookies
- Check console for JavaScript errors
- Verify all files are uploaded correctly

### Debug Mode
Enable debug mode by adding to console:
```javascript
window.debugAutoRefresh(); // Check auto-refresh status
window.checkAuthStatus();  // Check authentication
```

## 📝 License

MIT License - feel free to use this template for your projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

## 📞 Support

For questions and support:
- Create an issue in the repository
- Check the help documentation in the application
- Review the troubleshooting section above

---

**Happy Coding!** 🎉
