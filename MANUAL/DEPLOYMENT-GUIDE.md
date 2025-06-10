# Deployment Guide

## 🚀 Quick Deployment Steps

### Step 1: Prepare Your Google Apps Script Project

1. **Create New Project**
   - Go to [Google Apps Script](https://script.google.com)
   - Click "New Project"
   - Give it a meaningful name (e.g., "My Web App")

2. **Update Configuration**
   - Replace the content of `Code.gs` with `Code.js`
   - Update `appsscript.json` with the provided configuration
   - Update `.clasp.json` with your script ID (found in URL)

### Step 2: Upload All Template Files

**Required Files Checklist:**
- [ ] `Code.js` → Goes into `Code.gs` in Apps Script
- [ ] `appsscript.json` → Replace existing manifest
- [ ] `appstyles.html` → Upload as HTML file (name: `appstyles`)
- [ ] `frontend-main.html` → Upload as HTML file (name: `frontend-main`)
- [ ] `frontend-sidebar.html` → Upload as HTML file (name: `frontend-sidebar`)
- [ ] `frontend-dashboard-view.html` → Upload as HTML file (name: `frontend-dashboard-view`)
- [ ] `frontend-data-view.html` → Upload as HTML file (name: `frontend-data-view`)
- [ ] `frontend-settings-view.html` → Upload as HTML file (name: `frontend-settings-view`)
- [ ] `frontend-help-view.html` → Upload as HTML file (name: `frontend-help-view`)
- [ ] `frontend-setup-form.html` → Upload as HTML file (name: `frontend-setup-form`)
- [ ] `frontend-unauthorized-view.html` → Upload as HTML file (name: `frontend-unauthorized-view`)
- [ ] `script-authentication-js.html` → Upload as HTML file (name: `script-authentication-js`)
- [ ] `script-initialization-js.html` → Upload as HTML file (name: `script-initialization-js`)
- [ ] `script-sidebar-js.html` → Upload as HTML file (name: `script-sidebar-js`)
- [ ] `script-data-management-js.html` → Upload as HTML file (name: `script-data-management-js`)
- [ ] `script-settings-js.html` → Upload as HTML file (name: `script-settings-js`)
- [ ] `script-auto-refresh-js.html` → Upload as HTML file (name: `script-auto-refresh-js`)
- [ ] `script-main-js.html` → Upload as HTML file (name: `script-main-js`)
- [ ] Backend JavaScript files (copy content into Apps Script .gs files)

**Upload Process:**
1. Click the "+" button next to "Files"
2. Select "HTML" for all `.html` files
3. Copy and paste the content from each template file
4. Save each file with the correct name (without `.html` extension)

### Step 3: Configure Your Data Source

1. **Create Google Sheet**
   ```
   - Create a new Google Sheet
   - Set up columns: ID, Name, Description, Category, Value, Created Date, Created By
   - Copy the sheet ID from the URL
   ```

2. **Update DEFAULT_SHEET_ID**
   ```javascript
   // In Code.js, update this line:
   const DEFAULT_SHEET_ID = "YOUR_ACTUAL_SHEET_ID_HERE";
   ```

### Step 4: Deploy as Web Application

1. **Deploy Settings**
   - Click "Deploy" → "New Deployment"
   - Type: "Web app"
   - Description: "Initial deployment"
   - Execute as: "User accessing the web app"
   - Who has access: "Anyone with Google account" (or as needed)

2. **Authorize Permissions**
   - Click "Deploy"
   - Review and authorize required permissions
   - Copy the web app URL

### Step 5: Initial Setup

1. **Access Your App**
   - Open the deployed web app URL
   - You should see the setup form

2. **Configure Application**
   - Add at least one admin user (your email)
   - Add regular users (optional)
   - Enter your Google Sheets URL
   - Click "Complete Setup"

3. **Verify Setup**
   - You should be redirected to the main dashboard
   - Check that your role shows correctly in the sidebar
   - Test basic functionality

## 🔧 Advanced Configuration

### Custom Branding

**Update App Title and Logo:**
```html
<!-- In main.html -->
<title>Your Company App</title>

<!-- In sidebar.html -->
<h5 class="mb-0">Your App Name</h5>
```

**Customize Colors:**
```css
/* In styles.html */
:root {
  --primary-color: #your-brand-color;
  --secondary-color: #your-secondary-color;
}
```

### Environment-Specific Settings

**Development vs Production:**
```javascript
// In Code.js
const IS_PRODUCTION = true; // Set to false for development

const DEFAULT_SHEET_ID = IS_PRODUCTION 
  ? "production-sheet-id" 
  : "development-sheet-id";
```

### Email Configuration

**Update Contact Information:**
```html
<!-- In help-view.html -->
<a href="mailto:your-support@company.com">your-support@company.com</a>
```

## 🛠️ Using Clasp for Development

### Install Clasp
```powershell
npm install -g @google/clasp
```

### Setup Clasp with Your Project
```powershell
# Login to Google
clasp login

# Clone your existing project
clasp clone YOUR_SCRIPT_ID

# Or create new project
clasp create --title "Your App Name" --type webapp
```

### Development Workflow
```powershell
# Push changes
clasp push

# Deploy new version
clasp deploy --description "Version 1.0.1"

# View logs
clasp logs

# Open in browser
clasp open
```

### Update .clasp.json
```json
{
  "scriptId": "YOUR_ACTUAL_SCRIPT_ID",
  "rootDir": "",
  "scriptExtensions": [".js", ".gs"],
  "htmlExtensions": [".html"],
  "jsonExtensions": [".json"]
}
```

## 📋 Post-Deployment Checklist

### Functionality Testing
- [ ] Authentication works for admin users
- [ ] Authentication works for regular users
- [ ] Unauthorized users see access denied page
- [ ] Data loading works correctly
- [ ] CRUD operations function properly
- [ ] Auto-refresh system works
- [ ] Dark/light mode toggle works
- [ ] CSV export works
- [ ] Charts display correctly
- [ ] Settings can be modified
- [ ] User management works (admin only)

### UI/UX Testing
- [ ] Application loads quickly
- [ ] All navigation links work
- [ ] Forms validate correctly
- [ ] Error messages display appropriately
- [ ] Loading states show during operations
- [ ] Responsive design works on mobile
- [ ] All icons and graphics load
- [ ] Colors and themes work correctly

### Security Testing
- [ ] Non-admin users cannot access admin features
- [ ] Data operations require authentication
- [ ] Settings changes require proper permissions
- [ ] Error messages don't expose sensitive information

## 🔄 Updates and Maintenance

### Deploying Updates
```powershell
# Test changes locally first
clasp push

# Create new deployment for major changes
clasp deploy --description "Version 1.1.0 - New features"

# Or update existing deployment for minor fixes
clasp deploy --deploymentId YOUR_DEPLOYMENT_ID --description "Bug fixes"
```

### Version Management
```javascript
// Add version info to your application
const APP_VERSION = "1.0.0";
const BUILD_DATE = new Date().toISOString();
```

### Backup Strategy
- Regularly export your script files
- Keep backups of your Google Sheets data
- Document any custom modifications
- Maintain a changelog of updates

## 🐛 Common Deployment Issues

### Issue: "Script function not found"
**Solution:** Ensure all function names match between frontend and backend

### Issue: "Permission denied"
**Solution:** Check sharing settings on Google Sheets and script execution permissions

### Issue: "Authentication loop"
**Solution:** Clear browser cache and cookies, re-authorize the application

### Issue: "Charts not displaying"
**Solution:** Verify Chart.js CDN is loading correctly and data format is correct

### Issue: "Auto-refresh not working"
**Solution:** Check console for JavaScript errors and verify event listeners are set up

## 📞 Support and Resources

### Getting Help
- Check the application's built-in help section
- Review console errors in browser developer tools
- Test with a fresh browser session
- Verify all files were uploaded correctly

### Useful Resources
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

### Debug Commands
Open browser console and try:
```javascript
// Check authentication status
window.checkAuthStatus();

// Debug auto-refresh
window.debugAutoRefresh();

// Manually refresh data
window.manualRefresh();
```

---

**Deployment Complete!** 🎉 Your Google Apps Script web application is now live and ready to use.
