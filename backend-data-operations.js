// ===========================================
// SAMPLE DATA CRUD OPERATIONS
// ===========================================

/**
 * Sample data structure - customize this for your needs
 */

// CREATE - Add new record
function addDataRecord(data) {
  // Authentication check
  var userStatus = getUserAuthStatus();
  if (!userStatus.isAuthenticated) {
    throw new Error('Unauthorized: You must be logged in to add data');
  }
  
  if (!ss) { 
    throw new Error("Spreadsheet object (ss) is not initialized. Cannot add data.");
  }
  
  const sheet = ss.getSheetByName('Data'); // Change 'Data' to your sheet name
  if (!sheet) throw new Error('Data sheet not found');

  // Generate unique ID (customize as needed)
  const lastRow = sheet.getLastRow();
  const newId = lastRow > 1 ? lastRow : 1;
  
  // Add new row with data (customize columns as needed)
  sheet.appendRow([
    newId,                    // ID
    data.name || '',          // Name
    data.description || '',   // Description
    data.category || '',      // Category
    data.value || '',         // Value
    new Date(),              // Created Date
    userStatus.userEmail     // Created By
  ]);

  updateItemNumbersAndRemoveWhiteSpaces('Data');
  return { success: true, message: "Record added successfully", id: newId };
}

// READ - Get all records with filtering
function getDataRecords(categoryFilter = "All", searchKeyword = "") {
  // Authentication check
  var userStatus = getUserAuthStatus();
  if (!userStatus.isAuthenticated) {
    throw new Error('Unauthorized: You must be logged in to view data');
  }
  
  const sheet = ss.getSheetByName('Data');
  if (!sheet) throw new Error('Data sheet not found');

  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Remove and store header

  // Get column indices (customize based on your sheet structure)
  const categoryColumnIndex = headers.findIndex(header => header === "Category");
  const nameColumnIndex = headers.findIndex(header => header === "Name");
  const descriptionColumnIndex = headers.findIndex(header => header === "Description");

  // Extract unique categories for filter dropdown
  const allCategories = new Set();
  data.forEach(row => {
    const category = row[categoryColumnIndex];
    if (category && category.toString().trim() !== "") {
      allCategories.add(category.toString().trim());
    }
  });
  const uniqueCategories = Array.from(allCategories).sort();

  // Filter and format data
  const records = data
    .map((row, index) => {
      const record = { sheetRow: index + 2 }; // +2 because we removed header and rows are 1-indexed
      headers.forEach((header, colIndex) => {
        record[header] = row[colIndex];
      });
      return record;
    })
    .filter(record => {
      // Skip empty rows
      const hasContent = Object.values(record).some(value => 
        value !== null && value !== undefined && value.toString().trim() !== ""
      );
      if (!hasContent) return false;

      // Apply category filter
      const matchCategory = categoryFilter === 'All' || record['Category'] === categoryFilter;
      
      // Apply keyword search
      const matchKeyword = !searchKeyword || 
        record['Name'].toString().toLowerCase().includes(searchKeyword.toLowerCase()) ||
        record['Description'].toString().toLowerCase().includes(searchKeyword.toLowerCase());

      return matchCategory && matchKeyword;
    });

  return {
    records: records,
    categories: uniqueCategories
  };
}

// UPDATE - Edit existing record
function editDataRecord(rowIndex, newData) {
  // Authentication check
  var userStatus = getUserAuthStatus();
  if (!userStatus.isAuthenticated) {
    throw new Error('Unauthorized: You must be logged in to edit data');
  }
  
  const sheet = ss.getSheetByName('Data');
  if (!sheet) throw new Error('Data sheet not found');

  // Update row with new data (customize columns as needed)
  const values = [
    newData.id || '',
    newData.name || '',
    newData.description || '',
    newData.category || '',
    newData.value || '',
    newData.createdDate || '',
    newData.modifiedBy || userStatus.userEmail
  ];

  sheet.getRange(rowIndex, 1, 1, values.length).setValues([values]);
  updateItemNumbersAndRemoveWhiteSpaces('Data');
  
  return { success: true, message: "Record updated successfully" };
}

// DELETE - Remove records
function deleteDataRecords(rowIndices) {
  // Authentication check
  var userStatus = getUserAuthStatus();
  if (!userStatus.isAuthenticated) {
    throw new Error('Unauthorized: You must be logged in to delete data');
  }
  
  const sheet = ss.getSheetByName('Data');
  if (!sheet) throw new Error('Data sheet not found');
  
  // Sort descending to avoid shifting rows
  rowIndices.sort((a, b) => b - a);
  rowIndices.forEach(idx => {
    sheet.deleteRow(idx);
  });
  
  updateItemNumbersAndRemoveWhiteSpaces('Data');
  return { success: true, message: "Records deleted successfully" };
}

// UTILITY - Export data as CSV
function exportDataAsCSV(filterOptions = {}) {
  // Authentication check
  var userStatus = getUserAuthStatus();
  if (!userStatus.isAuthenticated) {
    throw new Error('Unauthorized: You must be logged in to export data');
  }
  
  const data = getDataRecords(filterOptions.category, filterOptions.search);
  
  if (!data.records || data.records.length === 0) {
    throw new Error('No data to export');
  }
  
  // Convert to CSV format
  const headers = Object.keys(data.records[0]).filter(key => key !== 'sheetRow');
  let csvContent = headers.join(',') + '\n';
  
  data.records.forEach(record => {
    const row = headers.map(header => {
      const value = record[header] || '';
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csvContent += row.join(',') + '\n';
  });
  
  return {
    success: true,
    filename: `data_export_${new Date().toISOString().split('T')[0]}.csv`,
    content: csvContent
  };
}
