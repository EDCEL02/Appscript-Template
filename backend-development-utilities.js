/**
 * Development and Testing Utilities for Google Apps Script Template
 * These functions help with development, testing, and debugging
 */

/**
 * Development utilities for testing and debugging
 */
function DevUtils() {
  
  /**
   * Create sample data for testing
   */
  function createSampleData() {
    try {
      const sheet = getDataSheet();
      if (!sheet) {
        throw new Error('Data sheet not found');
      }
      
      // Clear existing data (except headers)
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clear();
      }
      
      // Sample data based on common business scenarios
      const sampleData = [
        ['PROJ001', 'Website Redesign', 'Development', 'Active', '2024-01-15', 50000, 'John Doe'],
        ['PROJ002', 'Mobile App Development', 'Development', 'Planning', '2024-02-01', 75000, 'Jane Smith'],
        ['PROJ003', 'Server Infrastructure', 'Infrastructure', 'Active', '2024-01-20', 25000, 'Mike Johnson'],
        ['PROJ004', 'Database Migration', 'Infrastructure', 'Completed', '2024-01-10', 15000, 'Sarah Wilson'],
        ['PROJ005', 'Security Audit', 'Security', 'Active', '2024-01-25', 30000, 'David Brown'],
        ['PROJ006', 'User Training Program', 'Training', 'Planning', '2024-03-01', 10000, 'Lisa Davis'],
        ['PROJ007', 'API Integration', 'Development', 'Active', '2024-02-15', 40000, 'Tom Miller'],
        ['PROJ008', 'Performance Optimization', 'Optimization', 'On Hold', '2024-02-20', 20000, 'Anna Taylor'],
        ['PROJ009', 'Cloud Migration', 'Infrastructure', 'Planning', '2024-03-15', 60000, 'Chris Anderson'],
        ['PROJ010', 'Quality Assurance Setup', 'Testing', 'Active', '2024-02-10', 35000, 'Mark Thompson']
      ];
      
      // Add sample data to sheet
      if (sampleData.length > 0) {
        sheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
      }
      
      return {
        success: true,
        message: `Created ${sampleData.length} sample records`,
        data: sampleData
      };
      
    } catch (error) {
      console.error('Error creating sample data:', error);
      return {
        success: false,
        message: error.toString()
      };
    }
  }
  
  /**
   * Reset the application to initial state
   */
  function resetApplication() {
    try {
      const properties = PropertiesService.getScriptProperties();
      
      // Clear all script properties except setup
      const allProperties = properties.getProperties();
      const keysToDelete = Object.keys(allProperties).filter(key => key !== 'APP_SETUP_COMPLETE');
      
      if (keysToDelete.length > 0) {
        properties.deleteProperty(keysToDelete);
      }
      
      // Reset setup status
      properties.setProperty('APP_SETUP_COMPLETE', 'false');
      
      // Clear user sessions
      const userProperties = PropertiesService.getUserProperties();
      userProperties.deleteProperty('USER_SESSION');
      
      return {
        success: true,
        message: 'Application reset successfully. Setup required on next access.'
      };
      
    } catch (error) {
      console.error('Error resetting application:', error);
      return {
        success: false,
        message: error.toString()
      };
    }
  }
  
  /**
   * Generate test users for development
   */
  function createTestUsers() {
    try {
      const properties = PropertiesService.getScriptProperties();
      
      const testUsers = {
        'admin@test.com': {
          name: 'Test Admin',
          role: 'admin',
          active: true,
          created: new Date().toISOString()
        },
        'user@test.com': {
          name: 'Test User',
          role: 'user',
          active: true,
          created: new Date().toISOString()
        },
        'viewer@test.com': {
          name: 'Test Viewer',
          role: 'viewer',
          active: true,
          created: new Date().toISOString()
        }
      };
      
      properties.setProperty('APP_USERS', JSON.stringify(testUsers));
      
      return {
        success: true,
        message: 'Test users created successfully',
        users: Object.keys(testUsers)
      };
      
    } catch (error) {
      console.error('Error creating test users:', error);
      return {
        success: false,
        message: error.toString()
      };
    }
  }
  
  /**
   * Get application diagnostics
   */
  function getDiagnostics() {
    try {
      const properties = PropertiesService.getScriptProperties();
      const userProperties = PropertiesService.getUserProperties();
      
      const diagnostics = {
        timestamp: new Date().toISOString(),
        setup: {
          isComplete: properties.getProperty('APP_SETUP_COMPLETE') === 'true',
          spreadsheetId: properties.getProperty('DATA_SPREADSHEET_ID'),
          appName: properties.getProperty('APP_NAME')
        },
        users: {
          count: 0,
          admins: 0,
          activeUsers: 0
        },
        sheets: {
          accessible: false,
          lastRow: 0,
          lastColumn: 0
        },
        session: {
          currentUser: Session.getActiveUser().getEmail(),
          hasUserSession: !!userProperties.getProperty('USER_SESSION')
        }
      };
      
      // Check users
      const usersData = properties.getProperty('APP_USERS');
      if (usersData) {
        const users = JSON.parse(usersData);
        diagnostics.users.count = Object.keys(users).length;
        diagnostics.users.admins = Object.values(users).filter(u => u.role === 'admin').length;
        diagnostics.users.activeUsers = Object.values(users).filter(u => u.active).length;
      }
      
      // Check sheet accessibility
      try {
        const sheet = getDataSheet();
        if (sheet) {
          diagnostics.sheets.accessible = true;
          diagnostics.sheets.lastRow = sheet.getLastRow();
          diagnostics.sheets.lastColumn = sheet.getLastColumn();
        }
      } catch (e) {
        diagnostics.sheets.error = e.toString();
      }
      
      return {
        success: true,
        diagnostics: diagnostics
      };
      
    } catch (error) {
      console.error('Error getting diagnostics:', error);
      return {
        success: false,
        message: error.toString()
      };
    }
  }
  
  /**
   * Export configuration for backup
   */
  function exportConfiguration() {
    try {
      const properties = PropertiesService.getScriptProperties();
      const allProperties = properties.getProperties();
      
      const config = {
        exportDate: new Date().toISOString(),
        properties: allProperties,
        spreadsheetUrl: allProperties.DATA_SPREADSHEET_ID ? 
          `https://docs.google.com/spreadsheets/d/${allProperties.DATA_SPREADSHEET_ID}/edit` : null
      };
      
      return {
        success: true,
        configuration: config
      };
      
    } catch (error) {
      console.error('Error exporting configuration:', error);
      return {
        success: false,
        message: error.toString()
      };
    }
  }
  
  // Public API
  return {
    createSampleData: createSampleData,
    resetApplication: resetApplication,
    createTestUsers: createTestUsers,
    getDiagnostics: getDiagnostics,
    exportConfiguration: exportConfiguration
  };
}

// Expose development utilities globally
const devUtils = DevUtils();

/**
 * Quick setup function for development
 * Run this in the Apps Script editor for quick testing setup
 */
function quickDevSetup() {
  console.log('Starting quick development setup...');
  
  // Reset application
  const resetResult = devUtils.resetApplication();
  console.log('Reset result:', resetResult);
  
  // Create test users
  const usersResult = devUtils.createTestUsers();
  console.log('Users result:', usersResult);
  
  // Mark setup as complete
  PropertiesService.getScriptProperties().setProperty('APP_SETUP_COMPLETE', 'true');
  
  // Create sample data
  const dataResult = devUtils.createSampleData();
  console.log('Sample data result:', dataResult);
  
  console.log('Quick development setup complete!');
  console.log('You can now access the web app with test users:');
  console.log('- admin@test.com (admin role)');
  console.log('- user@test.com (user role)');
  console.log('- viewer@test.com (viewer role)');
}

/**
 * Get diagnostics information - useful for troubleshooting
 */
function runDiagnostics() {
  const result = devUtils.getDiagnostics();
  console.log('Application Diagnostics:', JSON.stringify(result, null, 2));
  return result;
}
