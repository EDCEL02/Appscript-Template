# Environment Configuration Template

This file provides templates and examples for configuring your Google Apps Script application for different environments (development, staging, production).

## Configuration Properties

### Required Properties
These properties must be set in Google Apps Script > Project Settings > Script Properties:

```javascript
// Application Basic Settings
APP_NAME=Your Application Name
APP_VERSION=1.0.0
APP_DESCRIPTION=Description of your application

// Setup Status
APP_SETUP_COMPLETE=true

// Spreadsheet Configuration
DATA_SPREADSHEET_ID=your_spreadsheet_id_here
DATA_SHEET_NAME=Data

// User Management
APP_USERS={"admin@yourcompany.com":{"name":"Admin User","role":"admin","active":true}}
```

### Optional Properties
These properties can be configured for additional features:

```javascript
// Auto-refresh Settings
AUTO_REFRESH_INTERVAL=30000
AUTO_REFRESH_ENABLED=true

// Theme Settings
DEFAULT_THEME=light

// Security Settings
SESSION_TIMEOUT=3600000
MAX_LOGIN_ATTEMPTS=5

// Feature Flags
ENABLE_EXPORT=true
ENABLE_EXTERNAL_SHEETS=true
ENABLE_CHARTS=true

// Email Notifications (if implemented)
NOTIFICATION_EMAIL=admin@yourcompany.com
SMTP_SETTINGS={"host":"smtp.gmail.com","port":587}
```

## Environment-Specific Configurations

### Development Environment

```javascript
// Script Properties for Development
{
  "APP_NAME": "MyApp - Development",
  "APP_VERSION": "1.0.0-dev",
  "APP_SETUP_COMPLETE": "true",
  "DATA_SPREADSHEET_ID": "your_dev_spreadsheet_id",
  "DATA_SHEET_NAME": "DevData",
  "AUTO_REFRESH_INTERVAL": "10000",
  "DEBUG_MODE": "true",
  "LOG_LEVEL": "debug"
}
```

### Staging Environment

```javascript
// Script Properties for Staging
{
  "APP_NAME": "MyApp - Staging",
  "APP_VERSION": "1.0.0-rc1",
  "APP_SETUP_COMPLETE": "true",
  "DATA_SPREADSHEET_ID": "your_staging_spreadsheet_id",
  "DATA_SHEET_NAME": "StagingData",
  "AUTO_REFRESH_INTERVAL": "20000",
  "DEBUG_MODE": "false",
  "LOG_LEVEL": "info"
}
```

### Production Environment

```javascript
// Script Properties for Production
{
  "APP_NAME": "MyApp",
  "APP_VERSION": "1.0.0",
  "APP_SETUP_COMPLETE": "true",
  "DATA_SPREADSHEET_ID": "your_production_spreadsheet_id",
  "DATA_SHEET_NAME": "Data",
  "AUTO_REFRESH_INTERVAL": "30000",
  "DEBUG_MODE": "false",
  "LOG_LEVEL": "warn",
  "ENABLE_ANALYTICS": "true"
}
```

## User Role Configuration Examples

### Basic User Roles

```javascript
{
  "admin@company.com": {
    "name": "System Administrator",
    "role": "admin",
    "active": true,
    "created": "2024-01-15T10:30:00Z",
    "permissions": ["read", "write", "delete", "admin"]
  },
  "manager@company.com": {
    "name": "Department Manager",
    "role": "manager",
    "active": true,
    "created": "2024-01-15T11:00:00Z",
    "permissions": ["read", "write"]
  },
  "user@company.com": {
    "name": "Regular User",
    "role": "user",
    "active": true,
    "created": "2024-01-15T11:30:00Z",
    "permissions": ["read"]
  }
}
```

### Department-Based Roles

```javascript
{
  "finance.manager@company.com": {
    "name": "Finance Manager",
    "role": "manager",
    "department": "finance",
    "active": true,
    "dataAccess": ["budget", "expenses", "revenue"]
  },
  "hr.admin@company.com": {
    "name": "HR Administrator",
    "role": "admin",
    "department": "hr",
    "active": true,
    "dataAccess": ["employees", "payroll", "benefits"]
  },
  "it.support@company.com": {
    "name": "IT Support",
    "role": "user",
    "department": "it",
    "active": true,
    "dataAccess": ["assets", "tickets", "systems"]
  }
}
```

## Spreadsheet Configuration Examples

### Single Sheet Configuration

```javascript
// For simple applications with one data sheet
{
  "DATA_SPREADSHEET_ID": "1ABC123DEF456GHI789JKL",
  "DATA_SHEET_NAME": "Data",
  "HEADER_ROW": "1",
  "DATA_START_ROW": "2"
}
```

### Multiple Sheets Configuration

```javascript
// For complex applications with multiple data sheets
{
  "DATA_SPREADSHEET_ID": "1ABC123DEF456GHI789JKL",
  "SHEETS_CONFIG": {
    "projects": {
      "sheetName": "Projects",
      "headerRow": 1,
      "dataStartRow": 2,
      "columns": ["id", "name", "status", "date", "budget"]
    },
    "users": {
      "sheetName": "Users",
      "headerRow": 1,
      "dataStartRow": 2,
      "columns": ["email", "name", "role", "department"]
    },
    "logs": {
      "sheetName": "ActivityLogs",
      "headerRow": 1,
      "dataStartRow": 2,
      "columns": ["timestamp", "user", "action", "details"]
    }
  }
}
```

### External Sheets Configuration

```javascript
// For applications that access multiple spreadsheets
{
  "PRIMARY_SPREADSHEET_ID": "1ABC123DEF456GHI789JKL",
  "EXTERNAL_SHEETS": {
    "reports": {
      "spreadsheetId": "1XYZ789ABC123DEF456GHI",
      "sheetName": "Reports",
      "accessType": "readonly"
    },
    "archive": {
      "spreadsheetId": "1DEF456GHI789JKL123ABC",
      "sheetName": "Archive",
      "accessType": "readwrite"
    }
  }
}
```

## Feature Configuration Examples

### Auto-Refresh Settings

```javascript
{
  // Enable/disable auto-refresh
  "AUTO_REFRESH_ENABLED": "true",
  
  // Refresh interval in milliseconds (30 seconds)
  "AUTO_REFRESH_INTERVAL": "30000",
  
  // Pause refresh when user is inactive for X milliseconds (5 minutes)
  "AUTO_REFRESH_PAUSE_THRESHOLD": "300000",
  
  // Maximum refresh attempts before stopping
  "AUTO_REFRESH_MAX_ATTEMPTS": "10"
}
```

### Chart Configuration

```javascript
{
  "CHARTS_ENABLED": "true",
  "DEFAULT_CHART_TYPE": "bar",
  "CHART_COLORS": {
    "primary": "#007bff",
    "secondary": "#6c757d",
    "success": "#28a745",
    "danger": "#dc3545",
    "warning": "#ffc107",
    "info": "#17a2b8"
  },
  "CHART_ANIMATION": "true"
}
```

### Export Settings

```javascript
{
  "EXPORT_ENABLED": "true",
  "EXPORT_FORMATS": ["csv", "xlsx"],
  "EXPORT_MAX_ROWS": "10000",
  "EXPORT_FILENAME_PREFIX": "data_export"
}
```

## Security Configuration

### Authentication Settings

```javascript
{
  "AUTH_REQUIRED": "true",
  "SESSION_TIMEOUT": "3600000", // 1 hour in milliseconds
  "MAX_LOGIN_ATTEMPTS": "5",
  "LOCKOUT_DURATION": "900000", // 15 minutes in milliseconds
  "REQUIRE_EMAIL_VERIFICATION": "false"
}
```

### Access Control

```javascript
{
  "ALLOWED_DOMAINS": ["company.com", "partner.com"],
  "BLOCKED_USERS": ["blocked@domain.com"],
  "IP_WHITELIST": ["192.168.1.0/24", "10.0.0.0/8"],
  "RATE_LIMITING": {
    "enabled": true,
    "maxRequests": 100,
    "windowMs": 900000 // 15 minutes
  }
}
```

## Custom Field Configuration

### Dynamic Form Fields

```javascript
{
  "CUSTOM_FIELDS": {
    "project_type": {
      "type": "select",
      "label": "Project Type",
      "options": ["Development", "Infrastructure", "Security", "Training"],
      "required": true
    },
    "priority": {
      "type": "select",
      "label": "Priority",
      "options": ["Low", "Medium", "High", "Critical"],
      "default": "Medium"
    },
    "estimated_hours": {
      "type": "number",
      "label": "Estimated Hours",
      "min": 0,
      "max": 1000
    },
    "description": {
      "type": "textarea",
      "label": "Description",
      "maxLength": 1000
    }
  }
}
```

## Deployment Configuration

### Development Deployment

```bash
# Deploy to development
clasp deploy --description "Development - $(date)"

# Set development properties
clasp run setProperties '{"APP_NAME":"MyApp-Dev","DEBUG_MODE":"true"}'
```

### Production Deployment

```bash
# Deploy to production
clasp deploy --description "Production v1.0.0"

# Set production properties
clasp run setProperties '{"APP_NAME":"MyApp","DEBUG_MODE":"false","LOG_LEVEL":"error"}'
```

## Environment Setup Script

Use this script to quickly set up environment-specific configurations:

```javascript
/**
 * Setup script for different environments
 * Run this in Apps Script editor after deployment
 */
function setupEnvironment(env = 'development') {
  const configs = {
    development: {
      APP_NAME: 'MyApp - Development',
      DEBUG_MODE: 'true',
      AUTO_REFRESH_INTERVAL: '10000',
      LOG_LEVEL: 'debug'
    },
    staging: {
      APP_NAME: 'MyApp - Staging',
      DEBUG_MODE: 'false',
      AUTO_REFRESH_INTERVAL: '20000',
      LOG_LEVEL: 'info'
    },
    production: {
      APP_NAME: 'MyApp',
      DEBUG_MODE: 'false',
      AUTO_REFRESH_INTERVAL: '30000',
      LOG_LEVEL: 'error'
    }
  };
  
  const config = configs[env];
  if (!config) {
    throw new Error(`Unknown environment: ${env}`);
  }
  
  const properties = PropertiesService.getScriptProperties();
  properties.setProperties(config);
  
  console.log(`Environment ${env} configured successfully`);
}
```

## Configuration Validation

Add this function to validate your configuration:

```javascript
function validateConfiguration() {
  const properties = PropertiesService.getScriptProperties();
  const required = [
    'APP_NAME',
    'DATA_SPREADSHEET_ID',
    'APP_SETUP_COMPLETE'
  ];
  
  const missing = required.filter(key => !properties.getProperty(key));
  
  if (missing.length > 0) {
    throw new Error(`Missing required properties: ${missing.join(', ')}`);
  }
  
  console.log('Configuration validation passed');
  return true;
}
```
