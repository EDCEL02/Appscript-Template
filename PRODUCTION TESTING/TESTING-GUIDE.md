# Testing Guide

This guide covers testing strategies, utilities, and best practices for the Google Apps Script template.

## Testing Overview

Google Apps Script testing can be challenging due to the environment constraints, but this guide provides practical approaches for testing your application.

## Manual Testing Checklist

### Initial Setup Testing

- [ ] **First-time setup**
  - [ ] Access the web app URL
  - [ ] Verify setup form appears
  - [ ] Complete setup with valid data
  - [ ] Confirm successful setup message
  - [ ] Verify redirect to dashboard

- [ ] **Authentication flow**
  - [ ] Test with authorized user
  - [ ] Test with unauthorized user
  - [ ] Test with different user roles (admin, user, viewer)
  - [ ] Verify unauthorized access shows proper error

### Core Functionality Testing

- [ ] **Dashboard**
  - [ ] Dashboard loads without errors
  - [ ] Statistics cards display correct data
  - [ ] Charts render properly
  - [ ] Auto-refresh works
  - [ ] Theme switching works

- [ ] **Data Management**
  - [ ] View data table
  - [ ] Add new record
  - [ ] Edit existing record
  - [ ] Delete record
  - [ ] Search/filter functionality
  - [ ] Pagination works
  - [ ] Export functionality

- [ ] **Settings (Admin only)**
  - [ ] Access settings page as admin
  - [ ] View user list
  - [ ] Add new user
  - [ ] Edit user roles
  - [ ] Delete user
  - [ ] Non-admin users cannot access

### Browser Compatibility Testing

Test the application in different browsers:
- [ ] Google Chrome
- [ ] Mozilla Firefox
- [ ] Microsoft Edge
- [ ] Safari (if on Mac)

### Mobile Responsiveness Testing

- [ ] Test on mobile devices
- [ ] Sidebar navigation works on mobile
- [ ] Forms are usable on mobile
- [ ] Tables are responsive
- [ ] Charts display properly on mobile

## Automated Testing Utilities

### Test Data Generator

```javascript
/**
 * Generate test data for various scenarios
 */
function generateTestData() {
  const testScenarios = {
    // Basic CRUD operations
    basic: {
      records: [
        { id: 'TEST001', name: 'Test Project 1', status: 'Active', date: '2024-01-15', budget: 10000 },
        { id: 'TEST002', name: 'Test Project 2', status: 'Planning', date: '2024-02-01', budget: 15000 }
      ]
    },
    
    // Large dataset for performance testing
    large: {
      records: []
    },
    
    // Edge cases
    edgeCases: {
      records: [
        { id: '', name: '', status: '', date: '', budget: 0 }, // Empty values
        { id: 'LONG' + 'X'.repeat(100), name: 'Very long name'.repeat(10), status: 'Invalid', date: 'invalid-date', budget: -1000 }, // Invalid values
        { id: 'SPECIAL!@#$%', name: 'Name with "quotes" and \'apostrophes\'', status: 'Active', date: '2024-13-45', budget: 999999999 } // Special characters
      ]
    }
  };
  
  // Generate large dataset
  for (let i = 1; i <= 1000; i++) {
    testScenarios.large.records.push({
      id: `PERF${i.toString().padStart(3, '0')}`,
      name: `Performance Test Project ${i}`,
      status: ['Active', 'Planning', 'Completed', 'On Hold'][i % 4],
      date: new Date(2024, (i % 12), (i % 28) + 1).toISOString().split('T')[0],
      budget: Math.floor(Math.random() * 100000) + 5000
    });
  }
  
  return testScenarios;
}
```

### Test Runner

```javascript
/**
 * Simple test runner for Google Apps Script
 */
function runTests() {
  const tests = [
    testAuthentication,
    testDataOperations,
    testUserManagement,
    testConfiguration,
    testPerformance
  ];
  
  const results = {
    total: tests.length,
    passed: 0,
    failed: 0,
    details: []
  };
  
  console.log('Starting test run...');
  
  tests.forEach(test => {
    try {
      console.log(`Running ${test.name}...`);
      const result = test();
      
      if (result.success) {
        results.passed++;
        console.log(`✓ ${test.name} passed`);
      } else {
        results.failed++;
        console.log(`✗ ${test.name} failed: ${result.message}`);
      }
      
      results.details.push({
        test: test.name,
        success: result.success,
        message: result.message || 'Passed',
        duration: result.duration || 0
      });
      
    } catch (error) {
      results.failed++;
      console.log(`✗ ${test.name} error: ${error.toString()}`);
      
      results.details.push({
        test: test.name,
        success: false,
        message: error.toString(),
        duration: 0
      });
    }
  });
  
  console.log(`\nTest Results: ${results.passed}/${results.total} passed`);
  return results;
}
```

### Individual Test Functions

```javascript
/**
 * Test authentication functionality
 */
function testAuthentication() {
  const startTime = Date.now();
  
  try {
    // Test user authorization
    const testEmail = 'test@example.com';
    
    // Should work if user exists
    const authResult = isAuthorizedUser(testEmail);
    
    // Test session management
    const sessionData = {
      email: testEmail,
      role: 'user',
      loginTime: new Date().toISOString()
    };
    
    PropertiesService.getUserProperties().setProperty('TEST_SESSION', JSON.stringify(sessionData));
    const retrievedSession = PropertiesService.getUserProperties().getProperty('TEST_SESSION');
    
    if (!retrievedSession) {
      throw new Error('Session storage failed');
    }
    
    // Clean up
    PropertiesService.getUserProperties().deleteProperty('TEST_SESSION');
    
    return {
      success: true,
      duration: Date.now() - startTime
    };
    
  } catch (error) {
    return {
      success: false,
      message: error.toString(),
      duration: Date.now() - startTime
    };
  }
}

/**
 * Test data operations
 */
function testDataOperations() {
  const startTime = Date.now();
  
  try {
    const testData = {
      id: 'TEST_RECORD',
      name: 'Test Record',
      status: 'Active',
      date: '2024-01-15',
      budget: 10000
    };
    
    // Test create
    const createResult = addRecord(testData);
    if (!createResult.success) {
      throw new Error(`Create failed: ${createResult.message}`);
    }
    
    // Test read
    const records = getAllRecords();
    if (!records.success) {
      throw new Error(`Read failed: ${records.message}`);
    }
    
    const createdRecord = records.data.find(r => r.id === testData.id);
    if (!createdRecord) {
      throw new Error('Created record not found');
    }
    
    // Test update
    const updateData = { ...testData, name: 'Updated Test Record' };
    const updateResult = updateRecord(testData.id, updateData);
    if (!updateResult.success) {
      throw new Error(`Update failed: ${updateResult.message}`);
    }
    
    // Test delete
    const deleteResult = deleteRecord(testData.id);
    if (!deleteResult.success) {
      throw new Error(`Delete failed: ${deleteResult.message}`);
    }
    
    return {
      success: true,
      duration: Date.now() - startTime
    };
    
  } catch (error) {
    // Clean up test data
    try {
      deleteRecord('TEST_RECORD');
    } catch (e) {
      // Ignore cleanup errors
    }
    
    return {
      success: false,
      message: error.toString(),
      duration: Date.now() - startTime
    };
  }
}

/**
 * Test user management
 */
function testUserManagement() {
  const startTime = Date.now();
  
  try {
    const properties = PropertiesService.getScriptProperties();
    
    // Backup current users
    const currentUsers = properties.getProperty('APP_USERS');
    
    // Test adding user
    const testUser = {
      email: 'testuser@example.com',
      name: 'Test User',
      role: 'user',
      active: true
    };
    
    const addResult = addUser(testUser);
    if (!addResult.success) {
      throw new Error(`Add user failed: ${addResult.message}`);
    }
    
    // Test getting users
    const usersResult = getUsers();
    if (!usersResult.success) {
      throw new Error(`Get users failed: ${usersResult.message}`);
    }
    
    // Test updating user
    const updateResult = updateUser(testUser.email, { role: 'admin' });
    if (!updateResult.success) {
      throw new Error(`Update user failed: ${updateResult.message}`);
    }
    
    // Test deleting user
    const deleteResult = deleteUser(testUser.email);
    if (!deleteResult.success) {
      throw new Error(`Delete user failed: ${deleteResult.message}`);
    }
    
    // Restore original users
    if (currentUsers) {
      properties.setProperty('APP_USERS', currentUsers);
    }
    
    return {
      success: true,
      duration: Date.now() - startTime
    };
    
  } catch (error) {
    return {
      success: false,
      message: error.toString(),
      duration: Date.now() - startTime
    };
  }
}

/**
 * Test configuration management
 */
function testConfiguration() {
  const startTime = Date.now();
  
  try {
    const properties = PropertiesService.getScriptProperties();
    
    // Test setting and getting properties
    const testKey = 'TEST_CONFIG';
    const testValue = 'test_value_123';
    
    properties.setProperty(testKey, testValue);
    const retrievedValue = properties.getProperty(testKey);
    
    if (retrievedValue !== testValue) {
      throw new Error('Configuration storage failed');
    }
    
    // Test JSON configuration
    const testConfig = { key1: 'value1', key2: 'value2' };
    properties.setProperty('TEST_JSON_CONFIG', JSON.stringify(testConfig));
    
    const retrievedConfig = JSON.parse(properties.getProperty('TEST_JSON_CONFIG'));
    if (retrievedConfig.key1 !== testConfig.key1) {
      throw new Error('JSON configuration failed');
    }
    
    // Clean up
    properties.deleteProperty(testKey);
    properties.deleteProperty('TEST_JSON_CONFIG');
    
    return {
      success: true,
      duration: Date.now() - startTime
    };
    
  } catch (error) {
    return {
      success: false,
      message: error.toString(),
      duration: Date.now() - startTime
    };
  }
}

/**
 * Test performance with sample data
 */
function testPerformance() {
  const startTime = Date.now();
  
  try {
    // Generate test data
    const testData = generateTestData();
    const sampleRecords = testData.basic.records;
    
    // Measure data operations
    const times = {};
    
    // Test read performance
    const readStart = Date.now();
    getAllRecords();
    times.read = Date.now() - readStart;
    
    // Test write performance (batch)
    const writeStart = Date.now();
    sampleRecords.forEach(record => {
      addRecord(record);
    });
    times.write = Date.now() - writeStart;
    
    // Clean up test records
    sampleRecords.forEach(record => {
      deleteRecord(record.id);
    });
    
    // Check if performance is acceptable (< 5 seconds for basic operations)
    if (times.read > 5000 || times.write > 10000) {
      throw new Error(`Performance degraded - Read: ${times.read}ms, Write: ${times.write}ms`);
    }
    
    return {
      success: true,
      duration: Date.now() - startTime,
      message: `Read: ${times.read}ms, Write: ${times.write}ms`
    };
    
  } catch (error) {
    return {
      success: false,
      message: error.toString(),
      duration: Date.now() - startTime
    };
  }
}
```

## Load Testing

### Performance Test Function

```javascript
/**
 * Load testing for high-volume scenarios
 */
function loadTest(options = {}) {
  const {
    recordCount = 100,
    concurrentOperations = 10,
    operationType = 'read' // read, write, mixed
  } = options;
  
  console.log(`Starting load test: ${recordCount} records, ${concurrentOperations} concurrent operations`);
  
  const startTime = Date.now();
  const results = {
    totalOperations: 0,
    successfulOperations: 0,
    failedOperations: 0,
    averageResponseTime: 0,
    errors: []
  };
  
  try {
    // Generate test data
    const testRecords = [];
    for (let i = 0; i < recordCount; i++) {
      testRecords.push({
        id: `LOAD_TEST_${i}`,
        name: `Load Test Record ${i}`,
        status: 'Active',
        date: '2024-01-15',
        budget: Math.floor(Math.random() * 50000) + 10000
      });
    }
    
    // Execute operations
    const operationTimes = [];
    
    for (let i = 0; i < testRecords.length; i += concurrentOperations) {
      const batch = testRecords.slice(i, i + concurrentOperations);
      
      batch.forEach(record => {
        const opStart = Date.now();
        try {
          switch (operationType) {
            case 'write':
              addRecord(record);
              break;
            case 'read':
              getAllRecords();
              break;
            case 'mixed':
              if (Math.random() > 0.5) {
                addRecord(record);
              } else {
                getAllRecords();
              }
              break;
          }
          
          results.successfulOperations++;
          operationTimes.push(Date.now() - opStart);
          
        } catch (error) {
          results.failedOperations++;
          results.errors.push(error.toString());
        }
        
        results.totalOperations++;
      });
      
      // Small delay between batches
      Utilities.sleep(100);
    }
    
    // Calculate statistics
    if (operationTimes.length > 0) {
      results.averageResponseTime = operationTimes.reduce((a, b) => a + b, 0) / operationTimes.length;
    }
    
    results.totalDuration = Date.now() - startTime;
    results.operationsPerSecond = (results.successfulOperations / results.totalDuration) * 1000;
    
    console.log('Load test completed:', results);
    
    // Cleanup
    testRecords.forEach(record => {
      try {
        deleteRecord(record.id);
      } catch (e) {
        // Ignore cleanup errors
      }
    });
    
    return results;
    
  } catch (error) {
    console.error('Load test failed:', error);
    return {
      ...results,
      error: error.toString()
    };
  }
}
```

## Error Testing

### Error Scenario Tests

```javascript
/**
 * Test error handling scenarios
 */
function testErrorScenarios() {
  const scenarios = [
    {
      name: 'Invalid spreadsheet ID',
      test: () => {
        const properties = PropertiesService.getScriptProperties();
        const originalId = properties.getProperty('DATA_SPREADSHEET_ID');
        properties.setProperty('DATA_SPREADSHEET_ID', 'invalid_id');
        
        try {
          const result = getAllRecords();
          properties.setProperty('DATA_SPREADSHEET_ID', originalId);
          return !result.success; // Should fail
        } catch (error) {
          properties.setProperty('DATA_SPREADSHEET_ID', originalId);
          return true; // Expected to throw
        }
      }
    },
    
    {
      name: 'Missing required fields',
      test: () => {
        try {
          const result = addRecord({}); // Empty record
          return !result.success; // Should fail validation
        } catch (error) {
          return true; // Expected to throw
        }
      }
    },
    
    {
      name: 'Unauthorized user access',
      test: () => {
        try {
          const result = isAuthorizedUser('unauthorized@example.com');
          return !result; // Should return false
        } catch (error) {
          return true; // Or throw error
        }
      }
    },
    
    {
      name: 'Malformed JSON in properties',
      test: () => {
        const properties = PropertiesService.getScriptProperties();
        properties.setProperty('TEST_MALFORMED', 'invalid json {');
        
        try {
          JSON.parse(properties.getProperty('TEST_MALFORMED'));
          properties.deleteProperty('TEST_MALFORMED');
          return false; // Should have failed
        } catch (error) {
          properties.deleteProperty('TEST_MALFORMED');
          return true; // Expected to throw
        }
      }
    }
  ];
  
  const results = scenarios.map(scenario => {
    try {
      const passed = scenario.test();
      return {
        name: scenario.name,
        passed: passed,
        error: null
      };
    } catch (error) {
      return {
        name: scenario.name,
        passed: false,
        error: error.toString()
      };
    }
  });
  
  console.log('Error scenario test results:', results);
  return results;
}
```

## Testing Best Practices

### 1. **Test Data Management**
- Always clean up test data after tests
- Use distinctive identifiers for test records (e.g., TEST_*, LOAD_TEST_*)
- Backup original data before destructive tests

### 2. **Environment Isolation**
- Use separate spreadsheets for testing
- Set different script properties for test environments
- Use conditional logic to identify test mode

### 3. **Error Handling Testing**
- Test all error paths
- Verify error messages are helpful
- Test recovery mechanisms

### 4. **Performance Testing**
- Test with realistic data volumes
- Monitor execution time limits (6 minutes for web apps)
- Test under various load conditions

### 5. **User Experience Testing**
- Test with different user roles
- Verify mobile responsiveness
- Test accessibility features

## Continuous Integration

### Automated Testing Script

```javascript
/**
 * Main function for continuous integration testing
 */
function ciTest() {
  console.log('Starting CI test suite...');
  
  const testSuite = {
    functional: runTests(),
    errors: testErrorScenarios(),
    performance: loadTest({ recordCount: 50, concurrentOperations: 5 })
  };
  
  const summary = {
    timestamp: new Date().toISOString(),
    functional: {
      total: testSuite.functional.total,
      passed: testSuite.functional.passed,
      failed: testSuite.functional.failed
    },
    errors: {
      total: testSuite.errors.length,
      passed: testSuite.errors.filter(t => t.passed).length,
      failed: testSuite.errors.filter(t => !t.passed).length
    },
    performance: {
      operationsPerSecond: testSuite.performance.operationsPerSecond,
      averageResponseTime: testSuite.performance.averageResponseTime,
      successRate: (testSuite.performance.successfulOperations / testSuite.performance.totalOperations) * 100
    }
  };
  
  console.log('CI Test Summary:', JSON.stringify(summary, null, 2));
  
  // Store results for tracking
  const properties = PropertiesService.getScriptProperties();
  const testHistory = JSON.parse(properties.getProperty('TEST_HISTORY') || '[]');
  testHistory.unshift(summary);
  
  // Keep only last 10 test runs
  if (testHistory.length > 10) {
    testHistory.splice(10);
  }
  
  properties.setProperty('TEST_HISTORY', JSON.stringify(testHistory));
  
  return summary;
}
```

This testing guide provides comprehensive coverage for validating your Google Apps Script application, from manual testing checklists to automated test suites and performance monitoring.
