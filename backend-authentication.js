// ===========================================
// AUTHENTICATION & USER MANAGEMENT
// ===========================================

/**
 * Check if initial setup is complete
 */
function isSetupComplete() {
  var scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty('SETUP_DATE') !== null;
}

/**
 * Perform initial setup with provided values
 */
function performInitialSetup(adminEmails, userEmails, sheetsLink, userData) {
  try {
    // Validate inputs
    if (!adminEmails || !sheetsLink) {
      return { success: false, message: "Admin emails and Google Sheets link are required" };
    }
    
    // Parse user data
    let parsedUserData;
    try {
      parsedUserData = JSON.parse(userData);
    } catch (e) {
      return { success: false, message: "Invalid user data format" };
    }
    
    // Validate admin data
    if (!parsedUserData.admins || !Array.isArray(parsedUserData.admins) || parsedUserData.admins.length === 0) {
      return { success: false, message: "At least one admin user is required" };
    }
    
    // Validate admin email formats
    for (let admin of parsedUserData.admins) {
      if (!admin.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email.trim())) {
        return { success: false, message: "Invalid admin email format: " + (admin.email || "empty") };
      }
    }
    
    // Validate regular user email formats if provided
    if (parsedUserData.users && Array.isArray(parsedUserData.users)) {
      for (let user of parsedUserData.users) {
        if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim())) {
          return { success: false, message: "Invalid user email format: " + user.email };
        }
      }
    }
    
    // Validate Google Sheets link
    try {
      var spreadsheet = SpreadsheetApp.openByUrl(sheetsLink);
      if (!spreadsheet) {
        throw new Error("Invalid spreadsheet URL");
      }
    } catch (e) {
      return { success: false, message: "Invalid Google Sheets URL or insufficient permissions" };
    }
    
    // Create script properties with new structure
    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty('ADMIN_USERS', JSON.stringify({ admins: parsedUserData.admins }));
    scriptProperties.setProperty('REGULAR_USERS', JSON.stringify({ regularusers: parsedUserData.users || [] }));
    scriptProperties.setProperty('GOOGLE_SHEETS_LINK', sheetsLink);
    scriptProperties.setProperty('SETUP_DATE', new Date().toISOString());
    
    return { success: true, message: "Setup completed successfully" };
  } catch (error) {
    return { success: false, message: "Setup failed: " + error.message };
  }
}

/**
 * Get user authentication status and role
 */
function getUserAuthStatus() {
  var scriptProperties = PropertiesService.getScriptProperties();
  
  // Check if setup is complete
  if (!isSetupComplete()) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      requiresSetup: true,
      userEmail: Session.getActiveUser().getEmail(),
      message: "Initial setup required"
    };
  }
  
  var currentUser = Session.getActiveUser().getEmail();
  
  // Get admin users from the new structure
  var adminUsersJson = scriptProperties.getProperty('ADMIN_USERS');
  var adminUsers = adminUsersJson ? JSON.parse(adminUsersJson) : { admins: [] };
  var adminEmailArray = adminUsers.admins ? adminUsers.admins.map(admin => admin.email.trim()) : [];
  
  // Get regular users from the new structure
  var regularUsersJson = scriptProperties.getProperty('REGULAR_USERS');
  var regularUsers = regularUsersJson ? JSON.parse(regularUsersJson) : { regularusers: [] };
  var regularEmailArray = regularUsers.regularusers ? regularUsers.regularusers.map(user => user.email.trim()) : [];
  
  // Check if user is admin
  var isAdmin = adminEmailArray.includes(currentUser);
  
  // Check if user is regular user
  var isRegularUser = regularEmailArray.includes(currentUser);
  
  // User is authenticated if they are either admin or regular user
  var isAuthenticated = isAdmin || isRegularUser;
  
  return {
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin,
    isRegularUser: isRegularUser,
    userEmail: currentUser,
    requiresSetup: false,
    message: isAuthenticated ? "User authenticated" : "User not authorized"
  };
}

/**
 * Get the appropriate content to show based on user's role and authentication status
 */
function getContentVisibility() {
  var authStatus = getUserAuthStatus();
  
  var visibility = {
    setupContainer: false,
    adminContent: false,
    userContent: false,
    adminAndUserView: false,
    unauthorizedContent: false,
    analyticsContent: false
  };
  
  if (authStatus.requiresSetup) {
    visibility.setupContainer = true;
  } else if (!authStatus.isAuthenticated) {
    visibility.unauthorizedContent = true;
  } else {
    // User is authenticated
    if (authStatus.isAdmin) {
      visibility.adminContent = true;
      visibility.adminAndUserView = true;
    } else {
      visibility.userContent = true;
      visibility.adminAndUserView = true;
    }
    visibility.analyticsContent = true;
  }
  
  return {
    visibility: visibility,
    userInfo: authStatus
  };
}

/**
 * Get script properties for admin view and settings dashboard
 */
function getScriptProperties() {
  // Check if user is admin
  var authStatus = getUserAuthStatus();
  if (!authStatus.isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  var scriptProperties = PropertiesService.getScriptProperties();
  var properties = scriptProperties.getProperties();
  
  return {
    setupDate: properties.SETUP_DATE || 'Not set',
    adminUsers: properties.ADMIN_USERS || '{}',
    regularUsers: properties.REGULAR_USERS || '{}',
    googleSheetsLink: properties.GOOGLE_SHEETS_LINK || 'Not set'
  };
}

/**
 * Reset the application by clearing all script properties
 */
function resetApplication() {
  var authStatus = getUserAuthStatus();
  if (!authStatus.isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  try {
    var scriptProperties = PropertiesService.getScriptProperties();
    
    // Get all property keys and delete them one by one
    var allProperties = scriptProperties.getProperties();
    var keys = Object.keys(allProperties);
    
    for (var i = 0; i < keys.length; i++) {
      scriptProperties.deleteProperty(keys[i]);
    }
    
    return { success: true, message: "Application reset successfully. All settings and users have been cleared." };
  } catch (error) {
    console.error('Reset failed:', error);
    return { success: false, message: "Reset failed: " + error.toString() };
  }
}

// ===========================================
// USER MANAGEMENT FUNCTIONS (ADMIN ONLY)
// ===========================================

/**
 * Add a new user to the system (admin only)
 */
function addUser(name, email, role) {
  var authStatus = getUserAuthStatus();
  if (!authStatus.isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  try {
    // Validate input
    if (!name || !email || !role) {
      return { success: false, message: "Name, email, and role are required" };
    }
    
    // Validate email format
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: "Invalid email format" };
    }
    
    // Validate role
    if (role !== 'admin' && role !== 'user') {
      return { success: false, message: "Role must be 'admin' or 'user'" };
    }
    
    var scriptProperties = PropertiesService.getScriptProperties();
    
    // Check if email already exists in admin users
    var adminUsers = JSON.parse(scriptProperties.getProperty('ADMIN_USERS') || '{"admins": []}');
    var emailExistsInAdmins = adminUsers.admins.some(user => user.email.toLowerCase() === email.toLowerCase());
    
    // Check if email already exists in regular users
    var regularUsers = JSON.parse(scriptProperties.getProperty('REGULAR_USERS') || '{"regularusers": []}');
    var emailExistsInRegular = regularUsers.regularusers.some(user => user.email.toLowerCase() === email.toLowerCase());
    
    // Prevent duplicate emails across all roles
    if (emailExistsInAdmins || emailExistsInRegular) {
      return { success: false, message: "Email already exists in the system" };
    }
    
    var newUser = { name: name.trim(), email: email.toLowerCase().trim() };
    
    if (role === 'admin') {
      adminUsers.admins.push(newUser);
      scriptProperties.setProperty('ADMIN_USERS', JSON.stringify(adminUsers));
    } else {
      regularUsers.regularusers.push(newUser);
      scriptProperties.setProperty('REGULAR_USERS', JSON.stringify(regularUsers));
    }
    
    return { success: true, message: "User added successfully" };
    
  } catch (error) {
    console.error('Add user error:', error);
    return { success: false, message: "Failed to add user: " + error.toString() };
  }
}

/**
 * Remove a user from the system (admin only)
 */
function removeUser(email) {
  var authStatus = getUserAuthStatus();
  if (!authStatus.isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  var scriptProperties = PropertiesService.getScriptProperties();
  
  // Try to remove from admin users
  var adminUsers = JSON.parse(scriptProperties.getProperty('ADMIN_USERS') || '{"admins": []}');
  var originalAdminCount = adminUsers.admins.length;
  adminUsers.admins = adminUsers.admins.filter(user => user.email !== email);
  
  if (adminUsers.admins.length < originalAdminCount) {
    scriptProperties.setProperty('ADMIN_USERS', JSON.stringify(adminUsers));
    return { success: true, message: "Admin user removed successfully" };
  }
  
  // Try to remove from regular users
  var regularUsers = JSON.parse(scriptProperties.getProperty('REGULAR_USERS') || '{"regularusers": []}');
  var originalRegularCount = regularUsers.regularusers.length;
  regularUsers.regularusers = regularUsers.regularusers.filter(user => user.email !== email);
  
  if (regularUsers.regularusers.length < originalRegularCount) {
    scriptProperties.setProperty('REGULAR_USERS', JSON.stringify(regularUsers));
    return { success: true, message: "Regular user removed successfully" };
  }
  
  return { success: false, message: "User not found" };
}

/**
 * Get all users in the system (admin only)
 */
function getAllUsers() {
  var authStatus = getUserAuthStatus();
  if (!authStatus.isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
  
  var scriptProperties = PropertiesService.getScriptProperties();
  var adminUsers = JSON.parse(scriptProperties.getProperty('ADMIN_USERS') || '{"admins": []}');
  var regularUsers = JSON.parse(scriptProperties.getProperty('REGULAR_USERS') || '{"regularusers": []}');
  
  return {
    admins: adminUsers.admins || [],
    regularUsers: regularUsers.regularusers || []
  };
}
