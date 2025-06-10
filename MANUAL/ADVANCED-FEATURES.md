# Advanced Features and Extensions

This document covers advanced features, customization options, and extension patterns for the Google Apps Script template.

## Advanced Authentication

### Multi-Domain Authentication

```javascript
// In backend-authentication.js, extend the isAuthorizedUser function
function isAuthorizedDomain(email) {
  const properties = PropertiesService.getScriptProperties();
  const allowedDomains = properties.getProperty('ALLOWED_DOMAINS');
  
  if (!allowedDomains) return true; // No domain restriction
  
  const domains = JSON.parse(allowedDomains);
  const userDomain = email.split('@')[1];
  
  return domains.includes(userDomain);
}
```

### OAuth Integration

```javascript
// Advanced OAuth with external services
function authenticateWithExternalService() {
  const clientId = PropertiesService.getScriptProperties().getProperty('OAUTH_CLIENT_ID');
  const clientSecret = PropertiesService.getScriptProperties().getProperty('OAUTH_CLIENT_SECRET');
  
  // Implement OAuth flow for external API access
  // This example shows the structure for OAuth integration
  
  return {
    success: true,
    token: 'access_token_here',
    expiresIn: 3600
  };
}
```

## Advanced Data Operations

### Batch Operations

```javascript
// In backend-data-operations.js, add batch processing capabilities
function batchUpdateRecords(updates) {
  try {
    const sheet = getDataSheet();
    if (!sheet) {
      throw new Error('Data sheet not found');
    }
    
    const results = [];
    
    // Process updates in batches to avoid timeout
    const batchSize = 50;
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      
      batch.forEach(update => {
        try {
          const result = updateRecord(update.id, update.data);
          results.push({ id: update.id, success: true, result });
        } catch (error) {
          results.push({ id: update.id, success: false, error: error.toString() });
        }
      });
      
      // Add small delay between batches
      Utilities.sleep(100);
    }
    
    return {
      success: true,
      results: results,
      processed: results.length
    };
    
  } catch (error) {
    console.error('Batch update error:', error);
    return {
      success: false,
      message: error.toString()
    };
  }
}
```

### Data Validation and Sanitization

```javascript
// Advanced data validation
function validateAndSanitizeData(data, schema) {
  const sanitized = {};
  const errors = [];
  
  Object.keys(schema).forEach(field => {
    const rules = schema[field];
    let value = data[field];
    
    // Type validation
    if (rules.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push(`${field} must be a valid email address`);
      }
    }
    
    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push(`${field} is required`);
    }
    
    // Length validation
    if (rules.maxLength && value && value.toString().length > rules.maxLength) {
      errors.push(`${field} must be ${rules.maxLength} characters or less`);
    }
    
    // Custom validation
    if (rules.validate && typeof rules.validate === 'function') {
      const customResult = rules.validate(value);
      if (customResult !== true) {
        errors.push(customResult || `${field} is invalid`);
      }
    }
    
    // Sanitization
    if (value) {
      if (rules.type === 'string') {
        value = value.toString().trim();
      } else if (rules.type === 'number') {
        value = parseFloat(value);
        if (isNaN(value)) {
          errors.push(`${field} must be a valid number`);
        }
      }
    }
    
    sanitized[field] = value;
  });
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    data: sanitized
  };
}

// Example schema
const projectSchema = {
  name: { type: 'string', required: true, maxLength: 100 },
  email: { type: 'email', required: true },
  budget: { 
    type: 'number', 
    required: true,
    validate: (value) => value > 0 ? true : 'Budget must be greater than 0'
  },
  status: {
    type: 'string',
    required: true,
    validate: (value) => ['Active', 'Planning', 'Completed', 'On Hold'].includes(value) 
      ? true : 'Invalid status'
  }
};
```

## Advanced UI Components

### Dynamic Form Builder

```javascript
// In data-management-js.html, add dynamic form generation
function generateDynamicForm(formConfig) {
  let formHTML = '<form id="dynamicForm" class="needs-validation" novalidate>';
  
  formConfig.fields.forEach(field => {
    formHTML += generateFieldHTML(field);
  });
  
  formHTML += `
    <div class="form-group">
      <button type="submit" class="btn btn-primary">
        <i class="fas fa-save me-2"></i>Save
      </button>
      <button type="button" class="btn btn-secondary ms-2" onclick="closeDynamicForm()">
        Cancel
      </button>
    </div>
  </form>`;
  
  return formHTML;
}

function generateFieldHTML(field) {
  const { type, name, label, options, required, placeholder } = field;
  
  let fieldHTML = `<div class="form-group mb-3">
    <label for="${name}" class="form-label">${label}${required ? ' *' : ''}</label>`;
  
  switch (type) {
    case 'select':
      fieldHTML += `<select class="form-select" id="${name}" name="${name}" ${required ? 'required' : ''}>
        <option value="">Choose...</option>`;
      options.forEach(option => {
        fieldHTML += `<option value="${option}">${option}</option>`;
      });
      fieldHTML += '</select>';
      break;
      
    case 'textarea':
      fieldHTML += `<textarea class="form-control" id="${name}" name="${name}" 
        rows="3" placeholder="${placeholder || ''}" ${required ? 'required' : ''}></textarea>`;
      break;
      
    case 'date':
      fieldHTML += `<input type="date" class="form-control" id="${name}" name="${name}" 
        ${required ? 'required' : ''}">`;
      break;
      
    case 'number':
      fieldHTML += `<input type="number" class="form-control" id="${name}" name="${name}" 
        placeholder="${placeholder || ''}" ${required ? 'required' : ''}">`;
      break;
      
    default:
      fieldHTML += `<input type="text" class="form-control" id="${name}" name="${name}" 
        placeholder="${placeholder || ''}" ${required ? 'required' : ''}">`;
  }
  
  fieldHTML += '</div>';
  return fieldHTML;
}
```

### Advanced Charts and Visualizations

```javascript
// Enhanced chart functionality with multiple chart types
function createAdvancedChart(containerId, data, options = {}) {
  const ctx = document.getElementById(containerId).getContext('2d');
  
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    }
  };
  
  const chartOptions = { ...defaultOptions, ...options };
  
  return new Chart(ctx, {
    type: data.type || 'bar',
    data: data,
    options: chartOptions
  });
}

// Multi-series chart data processor
function processChartData(rawData, config) {
  const { xField, yFields, groupBy } = config;
  
  if (groupBy) {
    // Group data by specified field
    const grouped = rawData.reduce((acc, item) => {
      const group = item[groupBy];
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});
    
    // Create datasets for each group
    const datasets = Object.keys(grouped).map((group, index) => ({
      label: group,
      data: grouped[group].map(item => item[yFields[0]]),
      backgroundColor: getChartColor(index),
      borderColor: getChartColor(index),
      borderWidth: 2
    }));
    
    return {
      labels: rawData.map(item => item[xField]),
      datasets: datasets
    };
  } else {
    // Simple single series chart
    return {
      labels: rawData.map(item => item[xField]),
      datasets: [{
        label: yFields[0],
        data: rawData.map(item => item[yFields[0]]),
        backgroundColor: getChartColors(rawData.length),
        borderWidth: 2
      }]
    };
  }
}
```

## Advanced Security Features

### Rate Limiting

```javascript
// Implement rate limiting for API calls
function rateLimitCheck(userId, endpoint) {
  const cache = CacheService.getScriptCache();
  const key = `rate_limit_${userId}_${endpoint}`;
  
  const current = cache.get(key);
  const limit = 100; // requests per hour
  const window = 3600; // 1 hour in seconds
  
  if (current) {
    const data = JSON.parse(current);
    if (data.count >= limit) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    data.count++;
    cache.put(key, JSON.stringify(data), window);
  } else {
    cache.put(key, JSON.stringify({ count: 1, timestamp: Date.now() }), window);
  }
  
  return true;
}
```

### Audit Logging

```javascript
// Comprehensive audit logging
function logActivity(action, details = {}) {
  try {
    const user = Session.getActiveUser().getEmail();
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      timestamp: timestamp,
      user: user,
      action: action,
      details: details,
      ip: getUserIP(), // Implement IP detection if needed
      userAgent: getUserAgent() // Implement user agent detection if needed
    };
    
    // Store in audit log sheet
    const logSheet = getAuditLogSheet();
    if (logSheet) {
      logSheet.appendRow([
        timestamp,
        user,
        action,
        JSON.stringify(details)
      ]);
    }
    
    // Also store in script properties for quick access
    const properties = PropertiesService.getScriptProperties();
    const recentLogs = JSON.parse(properties.getProperty('RECENT_AUDIT_LOGS') || '[]');
    recentLogs.unshift(logEntry);
    
    // Keep only last 100 entries in properties
    if (recentLogs.length > 100) {
      recentLogs.splice(100);
    }
    
    properties.setProperty('RECENT_AUDIT_LOGS', JSON.stringify(recentLogs));
    
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
}

function getAuditLogSheet() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty('DATA_SPREADSHEET_ID');
  
  if (!spreadsheetId) return null;
  
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    let sheet = spreadsheet.getSheetByName('AuditLog');
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet('AuditLog');
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'User', 'Action', 'Details']]);
    }
    
    return sheet;
  } catch (error) {
    console.error('Error accessing audit log sheet:', error);
    return null;
  }
}
```

## Advanced Integrations

### External API Integration

```javascript
// Generic API client with retry logic
function apiClient(url, options = {}) {
  const maxRetries = 3;
  let attempt = 0;
  
  function makeRequest() {
    try {
      const response = UrlFetchApp.fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        payload: options.payload ? JSON.stringify(options.payload) : undefined,
        muteHttpExceptions: true
      });
      
      const responseData = {
        code: response.getResponseCode(),
        data: JSON.parse(response.getContentText()),
        headers: response.getHeaders()
      };
      
      if (responseData.code >= 200 && responseData.code < 300) {
        return responseData;
      } else {
        throw new Error(`API request failed with status ${responseData.code}`);
      }
      
    } catch (error) {
      attempt++;
      if (attempt < maxRetries) {
        Utilities.sleep(1000 * attempt); // Exponential backoff
        return makeRequest();
      } else {
        throw error;
      }
    }
  }
  
  return makeRequest();
}
```

### Webhook Integration

```javascript
// Webhook handler for external notifications
function handleWebhook(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Validate webhook signature if required
    if (!validateWebhookSignature(e.postData.contents, e.parameter.signature)) {
      return ContentService.createTextOutput('Invalid signature').setMimeType(ContentService.MimeType.TEXT);
    }
    
    // Process webhook data
    processWebhookData(data);
    
    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return ContentService.createTextOutput('Error').setMimeType(ContentService.MimeType.TEXT);
  }
}

function validateWebhookSignature(payload, signature) {
  const secret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
  if (!secret) return true; // No validation if no secret set
  
  const computedSignature = Utilities.computeHmacSha256Signature(payload, secret);
  const computedHex = Utilities.base64Encode(computedSignature);
  
  return signature === computedHex;
}
```

## Performance Optimization

### Caching Strategies

```javascript
// Multi-level caching system
function getCachedData(key, fetchFunction, cacheTime = 300) {
  // Try script cache first (fastest)
  const scriptCache = CacheService.getScriptCache();
  let cached = scriptCache.get(key);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Try user cache
  const userCache = CacheService.getUserCache();
  cached = userCache.get(key);
  
  if (cached) {
    const data = JSON.parse(cached);
    // Refresh script cache
    scriptCache.put(key, cached, cacheTime);
    return data;
  }
  
  // Fetch fresh data
  const data = fetchFunction();
  const serialized = JSON.stringify(data);
  
  // Store in both caches
  scriptCache.put(key, serialized, cacheTime);
  userCache.put(key, serialized, cacheTime * 2); // Longer user cache
  
  return data;
}
```

### Database Query Optimization

```javascript
// Optimized sheet operations
function optimizedSheetRead(sheetName, range = null) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  
  if (!range) {
    // Get only used range to avoid reading empty cells
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    
    if (lastRow === 0 || lastCol === 0) return [];
    
    range = sheet.getRange(1, 1, lastRow, lastCol);
  }
  
  const values = range.getValues();
  
  // Convert to objects for easier manipulation
  const headers = values[0];
  const data = values.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  return data;
}
```

## Deployment and Monitoring

### Health Check Endpoint

```javascript
// Health check for monitoring
function healthCheck() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: PropertiesService.getScriptProperties().getProperty('APP_VERSION'),
    checks: {}
  };
  
  // Check spreadsheet access
  try {
    const sheet = getDataSheet();
    health.checks.spreadsheet = sheet ? 'ok' : 'failed';
  } catch (error) {
    health.checks.spreadsheet = 'failed';
    health.status = 'unhealthy';
  }
  
  // Check cache service
  try {
    CacheService.getScriptCache().put('health_check', 'ok', 60);
    health.checks.cache = 'ok';
  } catch (error) {
    health.checks.cache = 'failed';
  }
  
  // Check properties service
  try {
    PropertiesService.getScriptProperties().getProperty('APP_NAME');
    health.checks.properties = 'ok';
  } catch (error) {
    health.checks.properties = 'failed';
    health.status = 'unhealthy';
  }
  
  return health;
}
```

### Performance Monitoring

```javascript
// Performance monitoring
function performanceMonitor(functionName, fn) {
  const startTime = Date.now();
  
  try {
    const result = fn();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log performance metrics
    logPerformance(functionName, duration, true);
    
    return result;
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log error metrics
    logPerformance(functionName, duration, false, error.toString());
    
    throw error;
  }
}

function logPerformance(functionName, duration, success, error = null) {
  const properties = PropertiesService.getScriptProperties();
  const metrics = JSON.parse(properties.getProperty('PERFORMANCE_METRICS') || '{}');
  
  if (!metrics[functionName]) {
    metrics[functionName] = {
      calls: 0,
      totalDuration: 0,
      avgDuration: 0,
      errors: 0,
      lastCall: null
    };
  }
  
  const metric = metrics[functionName];
  metric.calls++;
  metric.totalDuration += duration;
  metric.avgDuration = metric.totalDuration / metric.calls;
  metric.lastCall = new Date().toISOString();
  
  if (!success) {
    metric.errors++;
    metric.lastError = error;
  }
  
  // Keep only last 1000 calls worth of data
  if (metric.calls > 1000) {
    metric.calls = 1000;
    metric.totalDuration = metric.avgDuration * 1000;
  }
  
  properties.setProperty('PERFORMANCE_METRICS', JSON.stringify(metrics));
}
```

This advanced features documentation provides comprehensive examples for extending the Google Apps Script template with enterprise-level capabilities including security, performance optimization, monitoring, and advanced integrations.
