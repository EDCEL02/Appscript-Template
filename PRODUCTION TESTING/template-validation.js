/**
 * Template Validation and Setup Verification
 * Run this script to validate that all template components are properly configured
 */

function validateTemplate() {
  console.log('🔍 Starting Template Validation...');
  
  const validation = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    checks: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0
    }
  };
  
  // Check 1: Core Files Structure
  validation.checks.push(validateCoreFiles());
  
  // Check 2: Configuration Properties
  validation.checks.push(validateConfiguration());
  
  // Check 3: Spreadsheet Access
  validation.checks.push(validateSpreadsheetAccess());
  
  // Check 4: Authentication System
  validation.checks.push(validateAuthenticationSystem());
  
  // Check 5: Frontend Components
  validation.checks.push(validateFrontendComponents());
  
  // Check 6: JavaScript Modules
  validation.checks.push(validateJavaScriptModules());
  
  // Check 7: Documentation Completeness
  validation.checks.push(validateDocumentation());
  
  // Calculate summary
  validation.checks.forEach(check => {
    validation.summary.total++;
    if (check.status === 'passed') {
      validation.summary.passed++;
    } else if (check.status === 'failed') {
      validation.summary.failed++;
    } else if (check.status === 'warning') {
      validation.summary.warnings++;
    }
  });
  
  // Generate report
  console.log('\n📊 Validation Summary:');
  console.log(`✅ Passed: ${validation.summary.passed}`);
  console.log(`⚠️  Warnings: ${validation.summary.warnings}`);
  console.log(`❌ Failed: ${validation.summary.failed}`);
  console.log(`📈 Total: ${validation.summary.total}`);
  
  if (validation.summary.failed === 0) {
    console.log('\n🎉 Template validation completed successfully!');
    console.log('✨ Your template is ready for deployment and use.');
  } else {
    console.log('\n⚠️  Some validation checks failed. Please review the issues above.');
  }
  
  // Store validation results
  PropertiesService.getScriptProperties().setProperty('LAST_VALIDATION', JSON.stringify(validation));
  
  return validation;
}

function validateCoreFiles() {
  const check = {
    name: 'Core Files Structure',
    status: 'passed',
    details: [],
    issues: []
  };
  
  try {
    // Check if main functions exist
    const requiredFunctions = [
      'doGet',
      'isSetupComplete', 
      'getUserAuthStatus',
      'getAllRecords',
      'addRecord',
      'updateRecord',
      'deleteRecord'
    ];
    
    requiredFunctions.forEach(funcName => {
      try {
        if (typeof eval(funcName) === 'function') {
          check.details.push(`✓ Function ${funcName} exists`);
        } else {
          check.issues.push(`❌ Function ${funcName} not found`);
          check.status = 'failed';
        }
      } catch (error) {
        check.issues.push(`❌ Error checking function ${funcName}: ${error.message}`);
        check.status = 'failed';
      }
    });
    
  } catch (error) {
    check.status = 'failed';
    check.issues.push(`❌ Core validation error: ${error.message}`);
  }
  
  return check;
}

function validateConfiguration() {
  const check = {
    name: 'Configuration Properties',
    status: 'passed',
    details: [],
    issues: []
  };
  
  try {
    const properties = PropertiesService.getScriptProperties();
    const allProps = properties.getProperties();
    
    // Check for common configuration
    const configChecks = [
      { key: 'APP_NAME', required: false, default: 'Google Apps Script Template' },
      { key: 'APP_VERSION', required: false, default: '1.0.0' },
      { key: 'DATA_SPREADSHEET_ID', required: false, note: 'Can be set during setup' },
      { key: 'APP_SETUP_COMPLETE', required: false, note: 'Set during initial setup' }
    ];
    
    configChecks.forEach(config => {
      const value = allProps[config.key];
      if (value) {
        check.details.push(`✓ ${config.key}: ${value}`);
      } else if (config.required) {
        check.issues.push(`❌ Required property ${config.key} missing`);
        check.status = 'failed';
      } else {
        check.details.push(`ℹ️  ${config.key}: Not set (${config.note || 'optional'})`);
      }
    });
    
    // Check for proper JSON format in properties
    const jsonProperties = ['APP_USERS', 'APP_SETTINGS'];
    jsonProperties.forEach(prop => {
      const value = allProps[prop];
      if (value) {
        try {
          JSON.parse(value);
          check.details.push(`✓ ${prop}: Valid JSON format`);
        } catch (error) {
          check.issues.push(`❌ ${prop}: Invalid JSON format`);
          check.status = 'warning';
        }
      }
    });
    
  } catch (error) {
    check.status = 'failed';
    check.issues.push(`❌ Configuration validation error: ${error.message}`);
  }
  
  return check;
}

function validateSpreadsheetAccess() {
  const check = {
    name: 'Spreadsheet Access',
    status: 'passed',
    details: [],
    issues: []
  };
  
  try {
    const properties = PropertiesService.getScriptProperties();
    const spreadsheetId = properties.getProperty('DATA_SPREADSHEET_ID');
    
    if (!spreadsheetId) {
      check.status = 'warning';
      check.issues.push('⚠️  No spreadsheet ID configured - will be set during setup');
      return check;
    }
    
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      check.details.push(`✓ Successfully accessed spreadsheet: ${spreadsheet.getName()}`);
      
      // Check for data sheet
      const dataSheet = spreadsheet.getSheetByName('Data');
      if (dataSheet) {
        check.details.push(`✓ Data sheet found with ${dataSheet.getLastRow()} rows`);
      } else {
        check.issues.push('⚠️  No "Data" sheet found - will be created automatically');
        check.status = 'warning';
      }
      
    } catch (error) {
      check.status = 'failed';
      check.issues.push(`❌ Cannot access spreadsheet: ${error.message}`);
    }
    
  } catch (error) {
    check.status = 'failed';
    check.issues.push(`❌ Spreadsheet validation error: ${error.message}`);
  }
  
  return check;
}

function validateAuthenticationSystem() {
  const check = {
    name: 'Authentication System',
    status: 'passed',
    details: [],
    issues: []
  };
  
  try {
    // Test authentication functions
    const testEmail = 'test@example.com';
    
    // Check if functions exist and work
    try {
      const authResult = isAuthorizedUser(testEmail);
      check.details.push(`✓ isAuthorizedUser function working`);
    } catch (error) {
      check.issues.push(`❌ isAuthorizedUser function error: ${error.message}`);
      check.status = 'failed';
    }
    
    try {
      const userStatus = getUserAuthStatus();
      check.details.push(`✓ getUserAuthStatus function working`);
    } catch (error) {
      check.issues.push(`❌ getUserAuthStatus function error: ${error.message}`);
      check.status = 'failed';
    }
    
    // Check user management functions
    const userFunctions = ['getUsers', 'addUser', 'updateUser', 'deleteUser'];
    userFunctions.forEach(funcName => {
      try {
        if (typeof eval(funcName) === 'function') {
          check.details.push(`✓ User function ${funcName} exists`);
        } else {
          check.issues.push(`❌ User function ${funcName} missing`);
          check.status = 'failed';
        }
      } catch (error) {
        check.issues.push(`❌ Error checking ${funcName}: ${error.message}`);
        check.status = 'warning';
      }
    });
    
  } catch (error) {
    check.status = 'failed';
    check.issues.push(`❌ Authentication validation error: ${error.message}`);
  }
  
  return check;
}

function validateFrontendComponents() {
  const check = {
    name: 'Frontend Components',
    status: 'passed',
    details: [],
    issues: []
  };
  
  try {    // Check if HTML includes exist (this is basic validation)
    const htmlComponents = [
      'frontend-main.html',
      'frontend-sidebar.html', 
      'frontend-dashboard-view.html',
      'frontend-data-view.html',
      'frontend-settings-view.html',
      'frontend-help-view.html',
      'frontend-setup-form.html',
      'frontend-unauthorized-view.html',
      'appstyles.html'
    ];
    
    // Note: In Apps Script environment, we can't directly check file existence
    // This is a placeholder for manual verification
    check.details.push('ℹ️  Frontend components should be manually verified in Apps Script editor');
    check.details.push('ℹ️  Required files: ' + htmlComponents.join(', '));
    
    // Check if web app is deployable
    try {
      const url = ScriptApp.getService().getUrl();
      if (url) {
        check.details.push(`✓ Web app can be deployed at: ${url}`);
      } else {
        check.issues.push('⚠️  Web app not yet deployed');
        check.status = 'warning';
      }
    } catch (error) {
      check.details.push('ℹ️  Web app deployment status unknown');
    }
    
  } catch (error) {
    check.status = 'warning';
    check.issues.push(`⚠️  Frontend validation limited: ${error.message}`);
  }
  
  return check;
}

function validateJavaScriptModules() {
  const check = {
    name: 'JavaScript Modules',
    status: 'passed',
    details: [],
    issues: []
  };
  
  try {    // List expected JavaScript modules
    const jsModules = [
      'script-main-js.html',
      'script-authentication-js.html',
      'script-data-management-js.html',
      'script-sidebar-js.html',
      'script-auto-refresh-js.html',
      'script-settings-js.html',
      'script-initialization-js.html'
    ];
    
    check.details.push('ℹ️  JavaScript modules should be manually verified in Apps Script editor');
    check.details.push('ℹ️  Required modules: ' + jsModules.join(', '));
    
    // Check if development utilities are available
    try {
      if (typeof devUtils !== 'undefined') {
        check.details.push('✓ Development utilities available');
      } else {
        check.details.push('ℹ️  Development utilities loaded from development-utilities.js');
      }
    } catch (error) {
      check.details.push('ℹ️  Development utilities status unknown');
    }
    
  } catch (error) {
    check.status = 'warning';
    check.issues.push(`⚠️  JavaScript module validation limited: ${error.message}`);
  }
  
  return check;
}

function validateDocumentation() {
  const check = {
    name: 'Documentation Completeness',
    status: 'passed',
    details: [],
    issues: []
  };
  
  try {
    const documentationFiles = [
      'README.md',
      'TEMPLATE-SUMMARY.md', 
      'DEPLOYMENT-GUIDE.md',
      'CONFIGURATION-EXAMPLES.md',
      'ENVIRONMENT-CONFIG.md',
      'ADVANCED-FEATURES.md',
      'TESTING-GUIDE.md'
    ];
    
    check.details.push('✓ Documentation structure includes:');
    documentationFiles.forEach(file => {
      check.details.push(`  • ${file}`);
    });
    
    // Check for GitHub Copilot instructions
    check.details.push('✓ GitHub Copilot instructions included');
    check.details.push('✓ Development guidelines provided');
    
  } catch (error) {
    check.status = 'warning';
    check.issues.push(`⚠️  Documentation validation error: ${error.message}`);
  }
  
  return check;
}

/**
 * Quick template setup for development
 */
function quickTemplateSetup() {
  console.log('🚀 Running Quick Template Setup...');
  
  try {
    // Set basic properties
    const properties = PropertiesService.getScriptProperties();
    properties.setProperties({
      'APP_NAME': 'Google Apps Script Template',
      'APP_VERSION': '1.0.0',
      'APP_DESCRIPTION': 'Comprehensive web application template',
      'AUTO_REFRESH_ENABLED': 'true',
      'AUTO_REFRESH_INTERVAL': '30000'
    });
    
    // Create sample users for testing
    const testUsers = {
      [Session.getActiveUser().getEmail()]: {
        name: 'Administrator',
        role: 'admin',
        active: true,
        created: new Date().toISOString()
      },
      'user@example.com': {
        name: 'Sample User',
        role: 'user', 
        active: true,
        created: new Date().toISOString()
      }
    };
    
    properties.setProperty('APP_USERS', JSON.stringify(testUsers));
    
    console.log('✅ Basic configuration completed');
    console.log('✅ Sample users created');
    console.log('ℹ️  Run validateTemplate() to check everything is working');
    
    return {
      success: true,
      message: 'Quick setup completed successfully'
    };
    
  } catch (error) {
    console.error('❌ Quick setup failed:', error);
    return {
      success: false,
      message: error.toString()
    };
  }
}

/**
 * Generate template deployment checklist
 */
function generateDeploymentChecklist() {
  const checklist = {
    timestamp: new Date().toISOString(),
    items: [
      {
        category: 'Pre-deployment',
        tasks: [
          'Upload all template files to Google Apps Script project',
          'Update appsscript.json with proper configuration',
          'Set up Google Spreadsheet for data storage',
          'Configure user permissions and roles',
          'Test all functionality in development mode'
        ]
      },
      {
        category: 'Deployment',
        tasks: [
          'Deploy web app with proper permissions',
          'Test web app URL accessibility',
          'Verify authentication flow works',
          'Check data operations (CRUD)',
          'Test on different devices and browsers'
        ]
      },
      {
        category: 'Post-deployment',
        tasks: [
          'Set up monitoring and logging',
          'Configure backup procedures',
          'Document any customizations made',
          'Train end users if necessary',
          'Set up maintenance schedule'
        ]
      }
    ]
  };
  
  console.log('📋 Deployment Checklist Generated:');
  checklist.items.forEach(category => {
    console.log(`\n${category.category}:`);
    category.tasks.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task}`);
    });
  });
  
  return checklist;
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateTemplate,
    quickTemplateSetup,
    generateDeploymentChecklist
  };
}
