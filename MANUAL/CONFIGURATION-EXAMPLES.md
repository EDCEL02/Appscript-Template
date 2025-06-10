# Configuration Examples

## Environment Configuration

### Development Setup
```javascript
// In Code.js - Development Configuration
const IS_PRODUCTION = false;
const DEFAULT_SHEET_ID = "1234567890abcdef_DEVELOPMENT_SHEET_ID";
const DEBUG_MODE = true;

// Enable additional logging in development
function logDebug(message, data = null) {
  if (DEBUG_MODE) {
    console.log('[DEBUG]', message, data);
  }
}
```

### Production Setup
```javascript
// In Code.js - Production Configuration
const IS_PRODUCTION = true;
const DEFAULT_SHEET_ID = "1234567890abcdef_PRODUCTION_SHEET_ID";
const DEBUG_MODE = false;

// Minimal logging in production
function logDebug(message, data = null) {
  // No logging in production
}
```

## Google Sheets Structure Examples

### Basic Data Sheet Structure
```
Column A: ID (Auto-generated, e.g., 1, 2, 3...)
Column B: Name (Text, required)
Column C: Description (Text, optional)
Column D: Category (Text, from predefined list)
Column E: Value (Number or text)
Column F: Created Date (Date, auto-generated)
Column G: Created By (Email, auto-generated)
Column H: Status (Active/Inactive)
```

### Extended Data Sheet Structure
```
Column A: ID
Column B: Name
Column C: Description
Column D: Category
Column E: Value
Column F: Priority (High/Medium/Low)
Column G: Due Date
Column H: Assigned To
Column I: Status
Column J: Created Date
Column K: Created By
Column L: Modified Date
Column M: Modified By
```

## Customization Examples

### Adding New Data Fields

1. **Update Backend Data Operations**
```javascript
// In backend-data-operations.js
function addDataRecord(data) {
  // Add your new fields here
  sheet.appendRow([
    newId,
    data.name || '',
    data.description || '',
    data.category || '',
    data.value || '',
    data.priority || 'Medium',        // New field
    data.dueDate || '',               // New field
    data.assignedTo || '',            // New field
    'Active',                         // Status
    new Date(),                       // Created Date
    userStatus.userEmail              // Created By
  ]);
}
```

2. **Update Frontend Form**
```html
<!-- In data-view.html modal -->
<div class="row">
  <div class="col-md-6 mb-3">
    <label for="recordPriority" class="form-label">Priority</label>
    <select class="form-select" id="recordPriority">
      <option value="High">High</option>
      <option value="Medium" selected>Medium</option>
      <option value="Low">Low</option>
    </select>
  </div>
  <div class="col-md-6 mb-3">
    <label for="recordDueDate" class="form-label">Due Date</label>
    <input type="date" class="form-control" id="recordDueDate">
  </div>
</div>
```

3. **Update Table Headers**
```html
<!-- In data-view.html table -->
<th>Priority <i class="bi bi-arrow-down-up sort-icon" data-column="priority"></i></th>
<th>Due Date <i class="bi bi-arrow-down-up sort-icon" data-column="dueDate"></i></th>
```

### Custom User Roles

```javascript
// In backend-authentication.js
function getUserAuthStatus() {
  // ... existing code ...
  
  // Add custom role logic
  var isManager = managerEmailArray.includes(currentUser);
  var isViewer = viewerEmailArray.includes(currentUser);
  
  return {
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin,
    isManager: isManager,
    isViewer: isViewer,
    userEmail: currentUser,
    // ... rest of the return object
  };
}
```

### Custom Themes

```css
/* In styles.html - Custom Brand Theme */
:root {
  --primary-color: #2c5aa0;     /* Your brand blue */
  --secondary-color: #7f8c8d;   /* Neutral gray */
  --success-color: #27ae60;     /* Green for success */
  --warning-color: #f39c12;     /* Orange for warnings */
  --danger-color: #e74c3c;      /* Red for errors */
  --info-color: #3498db;        /* Light blue for info */
  
  /* Custom brand gradients */
  --brand-gradient: linear-gradient(135deg, #2c5aa0 0%, #3498db 100%);
}

/* Custom card styling */
.brand-card {
  background: var(--brand-gradient);
  color: white;
  border: none;
}

.brand-card .card-header {
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
```

## Integration Examples

### Email Notifications

```javascript
// Add to backend-data-operations.js
function sendNotificationEmail(recipient, subject, message) {
  try {
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Notification from Your App</h2>
          <p>${message}</p>
          <p><a href="${getWebAppUrl()}">Open Application</a></p>
        </div>
      `
    });
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: error.message };
  }
}

function getWebAppUrl() {
  return ScriptApp.getService().getUrl();
}
```

### Slack Integration

```javascript
// Add to backend for Slack notifications
function sendSlackNotification(message) {
  const SLACK_WEBHOOK_URL = 'YOUR_SLACK_WEBHOOK_URL';
  
  const payload = {
    text: message,
    username: 'Your App Bot',
    icon_emoji: ':robot_face:'
  };
  
  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  try {
    UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
    return { success: true };
  } catch (error) {
    console.error('Slack notification error:', error);
    return { success: false, message: error.message };
  }
}
```

### Google Calendar Integration

```javascript
// Add calendar event creation
function createCalendarEvent(eventData) {
  try {
    const calendar = CalendarApp.getDefaultCalendar();
    const event = calendar.createEvent(
      eventData.title,
      new Date(eventData.startTime),
      new Date(eventData.endTime),
      {
        description: eventData.description,
        location: eventData.location,
        guests: eventData.attendees
      }
    );
    
    return { 
      success: true, 
      eventId: event.getId(),
      eventUrl: event.getHtmlLink()
    };
  } catch (error) {
    console.error('Calendar error:', error);
    return { success: false, message: error.message };
  }
}
```

## Advanced Features Examples

### File Upload to Google Drive

```javascript
// Backend function for file uploads
function uploadToGoogleDrive(base64Data, fileName, mimeType) {
  try {
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      mimeType,
      fileName
    );
    
    const folder = DriveApp.getFolderById('YOUR_FOLDER_ID');
    const file = folder.createFile(blob);
    
    return {
      success: true,
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      fileName: file.getName()
    };
  } catch (error) {
    console.error('File upload error:', error);
    return { success: false, message: error.message };
  }
}
```

### Advanced Data Validation

```javascript
// Custom validation rules
function validateDataRecord(data) {
  const errors = [];
  
  // Required field validation
  if (!data.name || data.name.trim().length < 3) {
    errors.push('Name must be at least 3 characters long');
  }
  
  // Email validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  // Date validation
  if (data.dueDate && new Date(data.dueDate) < new Date()) {
    errors.push('Due date cannot be in the past');
  }
  
  // Numeric validation
  if (data.value && isNaN(parseFloat(data.value))) {
    errors.push('Value must be a valid number');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}
```

### Multi-language Support

```javascript
// Internationalization setup
const TRANSLATIONS = {
  en: {
    'app.title': 'Your Application',
    'nav.dashboard': 'Dashboard',
    'nav.data': 'Data Management',
    'button.save': 'Save',
    'button.cancel': 'Cancel'
  },
  es: {
    'app.title': 'Su Aplicación',
    'nav.dashboard': 'Panel de Control',
    'nav.data': 'Gestión de Datos',
    'button.save': 'Guardar',
    'button.cancel': 'Cancelar'
  }
};

function translate(key, language = 'en') {
  return TRANSLATIONS[language][key] || key;
}
```

## Performance Optimization Examples

### Caching Strategy

```javascript
// Cache frequently accessed data
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = CacheService.getScriptCache();

function getCachedData(key, fetchFunction) {
  let data = cache.get(key);
  
  if (data) {
    return JSON.parse(data);
  }
  
  data = fetchFunction();
  cache.put(key, JSON.stringify(data), CACHE_DURATION / 1000);
  
  return data;
}

// Usage
function getDataRecords() {
  return getCachedData('dataRecords', () => {
    // Expensive data fetch operation
    return fetchDataFromSheet();
  });
}
```

### Batch Operations

```javascript
// Efficient batch updates
function updateMultipleRecords(updates) {
  const sheet = ss.getSheetByName('Data');
  const range = sheet.getDataRange();
  const values = range.getValues();
  
  // Apply all updates
  updates.forEach(update => {
    if (values[update.rowIndex]) {
      values[update.rowIndex][update.columnIndex] = update.newValue;
    }
  });
  
  // Single write operation
  range.setValues(values);
  
  return { success: true, updatedCount: updates.length };
}
```

These examples provide a solid foundation for customizing and extending the template according to your specific needs.
