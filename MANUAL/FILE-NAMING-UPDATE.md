# File Naming Convention Update

## Overview

This document describes the file naming convention updates made to ensure compatibility with Google Apps Script's upload requirements.

## Updated File Structure

### Frontend HTML Files
All frontend HTML files have been renamed with the `frontend-` prefix:

| Old Filename | New Filename |
|-------------|-------------|
| `main.html` | `frontend-main.html` |
| `sidebar.html` | `frontend-sidebar.html` |
| `dashboard-view.html` | `frontend-dashboard-view.html` |
| `data-view.html` | `frontend-data-view.html` |
| `settings-view.html` | `frontend-settings-view.html` |
| `help-view.html` | `frontend-help-view.html` |
| `setup-form.html` | `frontend-setup-form.html` |
| `unauthorized-view.html` | `frontend-unauthorized-view.html` |

### JavaScript Module Files
All JavaScript module files have been renamed with the `script-` prefix:

| Old Filename | New Filename |
|-------------|-------------|
| `main-js.html` | `script-main-js.html` |
| `authentication-js.html` | `script-authentication-js.html` |
| `data-management-js.html` | `script-data-management-js.html` |
| `sidebar-js.html` | `script-sidebar-js.html` |
| `auto-refresh-js.html` | `script-auto-refresh-js.html` |
| `settings-js.html` | `script-settings-js.html` |
| `initialization-js.html` | `script-initialization-js.html` |

### Styling Files
The main styling file has been renamed:

| Old Filename | New Filename |
|-------------|-------------|
| `styles.html` | `appstyles.html` |

### Backend Files
Backend files remain unchanged:

- `Code.js` (Main entry point)
- `backend-authentication.js`
- `backend-data-operations.js` 
- `backend-development-utilities.js`

## Updated References

### In Code.js
The main entry point now references the correct HTML file:
```javascript
function doGet(e) {
  return HtmlService.createTemplateFromFile('frontend-main')
    .evaluate()
    .setTitle('Your App Title')
    .setFaviconUrl('https://your-favicon-url.com/favicon.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
```

### In frontend-main.html
All include statements have been updated:
```html
<!-- Styles -->
<?!= include('appstyles'); ?>

<!-- Frontend Views -->
<?!= include('frontend-sidebar'); ?>
<?!= include('frontend-dashboard-view'); ?>
<?!= include('frontend-data-view'); ?>
<?!= include('frontend-settings-view'); ?>
<?!= include('frontend-help-view'); ?>
<?!= include('frontend-setup-form'); ?>
<?!= include('frontend-unauthorized-view'); ?>

<!-- JavaScript Modules -->
<?!= include('script-authentication-js'); ?>
<?!= include('script-initialization-js'); ?>
<?!= include('script-sidebar-js'); ?>
<?!= include('script-data-management-js'); ?>
<?!= include('script-settings-js'); ?>
<?!= include('script-auto-refresh-js'); ?>
<?!= include('script-main-js'); ?>
```

## Deployment Instructions

When uploading to Google Apps Script:

1. **For HTML files**: Remove the `.html` extension when creating files in Apps Script
   - `frontend-main.html` → Create HTML file named `frontend-main`
   - `script-main-js.html` → Create HTML file named `script-main-js`
   - etc.

2. **For JavaScript files**: Copy content into `.gs` files or keep as `.js` files
   - `Code.js` → Create Script file named `Code`
   - `backend-authentication.js` → Create Script file named `backend-authentication`
   - etc.

3. **Configuration files**: Upload as-is
   - `appsscript.json` → Replace the existing manifest
   - `.clasp.json` → For local development only

## Benefits of This Naming Convention

1. **Clear Organization**: `frontend-` and `script-` prefixes make file types immediately obvious
2. **Google Apps Script Compatibility**: Works with Apps Script's file upload system
3. **Logical Grouping**: Related files are grouped together alphabetically
4. **Easier Maintenance**: Clear naming reduces confusion during development

## Documentation Updates

All documentation files have been updated to reflect the new naming convention:
- ✅ README.md
- ✅ DEPLOYMENT-GUIDE.md
- ✅ DIRECTORY-STRUCTURE.md
- ✅ TEMPLATE-SUMMARY.md
- ✅ PROJECT-COMPLETION.md
- ✅ template-validation.js

## Migration Notes

If you have an existing deployment using the old naming convention:
1. Create new files with the new names in Google Apps Script
2. Copy content from old files to new files
3. Update the main entry point in Code.js
4. Test all functionality
5. Delete old files once confirmed working
