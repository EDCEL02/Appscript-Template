# 📊 Database Setup Instructions

## ⚠️ Important Notice

**This is NOT the actual database for your application.** This folder contains only the template structure that you need to create in Google Sheets.

## 🚀 Setup Instructions

### Step 1: Create a New Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create a new spreadsheet
3. Rename it to something meaningful (e.g., "My App Data", "Project Database", etc.)

### Step 2: Set Up the Data Sheet

1. **Rename the first sheet** from "Sheet1" to **"Data"** (this is important!)

2. **Add the following column headers** in Row 1:

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|
   | ID | Name | Description | Category | Value | Created Date | Created By |

3. **Format the headers** (optional but recommended):
   - Select Row 1
   - Make it bold
   - Add background color
   - Center align the text

### Step 3: Sample Data (Optional)

You can add some sample data to test your application:

| ID | Name | Description | Category | Value | Created Date | Created By |
|----|------|-------------|----------|-------|--------------|------------|
| 1 | Sample Project | This is a sample project | Development | 10000 | 2024-01-15 | admin@company.com |
| 2 | Test Item | Testing the application | Testing | 5000 | 2024-01-16 | user@company.com |

### Step 4: Get Your Spreadsheet ID

1. Copy the URL of your Google Spreadsheet
2. Extract the ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
   ```
3. The ID is the long string between `/d/` and `/edit`

### Step 5: Configure Your Application

**Option A: During Initial Setup (Recommended)**
- When you first access your deployed web app, you'll see a setup form
- Paste your complete Google Sheets URL in the "Google Sheets Link" field
- Complete the rest of the setup

**Option B: Manual Configuration**
- Open your Google Apps Script project
- In `Code.js`, update the `DEFAULT_SHEET_ID` variable:
  ```javascript
  const DEFAULT_SHEET_ID = "YOUR_ACTUAL_SPREADSHEET_ID_HERE";
  ```

## 📋 Important Requirements

### Column Structure Requirements
- **Column A (ID)**: Must be named "ID" - used for auto-numbering
- **Column B (Name)**: Must be named "Name" - required field
- **Column C (Description)**: Must be named "Description" - optional field
- **Column D (Category)**: Must be named "Category" - used for filtering
- **Column E (Value)**: Must be named "Value" - can store numbers or text
- **Column F (Created Date)**: Must be named "Created Date" - auto-populated
- **Column G (Created By)**: Must be named "Created By" - auto-populated with user email

### Sheet Name Requirements
- The data sheet **MUST** be named **"Data"** (case-sensitive)
- Do not rename this sheet after setup

### Permissions Requirements
- Your Google Apps Script must have access to your spreadsheet
- All users of your application need at least "Viewer" access to the spreadsheet
- Admin users should have "Editor" access

## 🔧 Advanced Configuration

### Adding Custom Columns

If you want to add more columns, you can extend the structure:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| ID | Name | Description | Category | Value | Priority | Status | Created Date | Created By |

**Remember to update your application code** in `backend-data-operations.js` to handle the new columns.

### Multiple Sheets Setup

For advanced applications, you might want additional sheets:

- **Data** - Main data (required)
- **Categories** - Predefined categories
- **Users** - User information
- **Logs** - Activity logs
- **Settings** - Application settings

## 🚨 Troubleshooting

### Common Issues

**"Data sheet not found" error:**
- Ensure your sheet is named exactly "Data" (case-sensitive)
- Check that the spreadsheet ID is correct

**"Permission denied" error:**
- Verify your Google Apps Script has access to the spreadsheet
- Check sharing settings on your Google Sheet

**"No data loading" issue:**
- Ensure column headers match exactly (including case)
- Check that Row 1 contains headers and data starts from Row 2

**"Cannot write data" error:**
- Verify you have edit permissions on the spreadsheet
- Check if the sheet is protected or restricted

## 📞 Need Help?

1. **Check the Setup Form**: Use the application's built-in setup form for automatic configuration
2. **Review Documentation**: Check the main README.md for detailed setup instructions
3. **Test Connection**: Use the development utilities to test your sheet connection
4. **Validate Setup**: Run the template validation functions in your Apps Script console

## ✅ Verification Checklist

Before proceeding, make sure:

- [ ] Google Spreadsheet is created
- [ ] Sheet is named "Data" exactly
- [ ] All required column headers are in place
- [ ] Spreadsheet ID is copied correctly
- [ ] Permissions are set appropriately
- [ ] Application is configured with the correct sheet ID

---

**Ready to Go!** 🎉 

Once your Google Spreadsheet is set up and configured in your application, you can start using all the features including data management, charts, and user access controls.
