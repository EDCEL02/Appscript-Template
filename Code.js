// ===========================================
// MAIN BACKEND ENTRY POINT
// ===========================================

// Configuration & Properties Service
const DEFAULT_SHEET_ID = "1U1EDKLutupcAJxQ62q3cPTDWyr5OMTCawD8kTZ7KJhk";
const SHEET_ID_PROPERTY_KEY = '0'; 
let SPREADSHEET_ID; 
let ss;

/**
 * Main entry point for the web app
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('frontend-main')
    .evaluate()
    .setTitle('Appscript Template')
    .setFaviconUrl('https://your-favicon-url.com/favicon.png')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Include HTML files
 */
function include(filename) {
  return HtmlService.createTemplateFromFile(filename)
    .evaluate()
    .getContent();
}

/**
 * Get the spreadsheet title for display
 */
function getSpreadsheetTitle() {
  if (ss) {
    return ss.getName();
  }
  return "Spreadsheet title not available";
}

/**
 * Get the spreadsheet URL for opening in new tab
 */
function getSpreadsheetUrl() {
  if (ss) {
    return ss.getUrl();
  }
  return null;
}

/**
 * Get the current sheet ID for display
 */
function getSheetLink() {
  const storedId = PropertiesService.getUserProperties().getProperty(SHEET_ID_PROPERTY_KEY);
  if (_isValidSheetId(storedId)) {
    return storedId;
  }
  PropertiesService.getUserProperties().setProperty(SHEET_ID_PROPERTY_KEY, DEFAULT_SHEET_ID);
  return DEFAULT_SHEET_ID;
}

/**
 * Set a new sheet link/ID
 */
function setSheetLink(userInput) {
  const newId = _extractSheetIDFromInput(userInput);

  if (newId) {
    PropertiesService.getUserProperties().setProperty(SHEET_ID_PROPERTY_KEY, newId);
    initializeGlobalSpreadsheetVariables();
    return `Spreadsheet ID updated to: ${newId}`;
  } else {
    throw new Error("Invalid Google Sheets URL or ID provided");
  }
}

/**
 * Initialize global spreadsheet variables
 */
function initializeGlobalSpreadsheetVariables() {
  let idFromProperties = PropertiesService.getUserProperties().getProperty(SHEET_ID_PROPERTY_KEY);

  if (_isValidSheetId(idFromProperties)) {
    SPREADSHEET_ID = idFromProperties;
  } else {
    SPREADSHEET_ID = DEFAULT_SHEET_ID;
    PropertiesService.getUserProperties().setProperty(SHEET_ID_PROPERTY_KEY, DEFAULT_SHEET_ID);
  }

  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log(`Successfully opened spreadsheet: ${ss.getName()}`);
  } catch (e) {
    console.error(`Error opening spreadsheet with ID ${SPREADSHEET_ID}:`, e);
    throw new Error(`Cannot access spreadsheet. Please check permissions or provide a valid spreadsheet URL.`);
  }
}

// Initialize on startup
initializeGlobalSpreadsheetVariables();

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Update item numbers and remove empty rows
 */
function updateItemNumbersAndRemoveWhiteSpaces(sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;

  let data = sheet.getDataRange().getValues(); 

  // Delete empty rows from bottom to top
  for (let i = data.length - 1; i > 0; i--) {
    const row = data[i];
    const hasContent = row.some(cell => cell !== null && cell !== undefined && cell.toString().trim() !== '');
    if (!hasContent) {
      sheet.deleteRow(i + 1);
    }
  }

  // Get fresh data after deletions
  data = sheet.getDataRange().getValues();

  // Renumber column A from top to bottom starting at 1
  for (let i = 1; i < data.length; i++) {
    sheet.getRange(i + 1, 1).setValue(i);
  }
}

/**
 * Check if a string looks like a valid Google Sheet ID
 */
function _isValidSheetId(id) {
  return id && typeof id === 'string' && /^[-\w]{25,60}$/.test(id) && !id.includes('/');
}

/**
 * Extract Sheet ID from various forms of user input (URL or ID)
 */
function _extractSheetIDFromInput(input) {
  if (typeof input !== 'string' || input.trim() === '') return null;
  
  const urlMatch = input.match(/spreadsheets\/d\/([-\w]{25,})/i);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }
  
  if (_isValidSheetId(input)) {
    return input;
  }
  
  return null;
}
