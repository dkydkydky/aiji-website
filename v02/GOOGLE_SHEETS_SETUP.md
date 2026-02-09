# Google Sheets Setup for Get Involved Form

This guide will walk you through setting up Google Sheets to receive form submissions from the "Get Involved" form on your website.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "AIJI Get Involved Submissions"
4. In the first row, add these column headers (exactly as shown):

```
Timestamp | Email | First Name | Last Name | Company Name | Role | Phone | Receive News | Become Funder | Become Partner
```

Your sheet should look like this:

| Timestamp | Email | First Name | Last Name | Company Name | Role | Phone | Receive News | Become Funder | Become Partner |
|-----------|-------|------------|-----------|--------------|------|-------|--------------|---------------|----------------|
|           |       |            |           |              |      |       |              |               |                |

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste the following code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet and sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Prepare the row data
    const rowData = [
      new Date(),                                           // Timestamp
      data.email || '',                                     // Email
      data.firstName || '',                                 // First Name
      data.lastName || '',                                  // Last Name
      data.companyName || '',                              // Company Name
      data.role || '',                                      // Role
      data.phone || '',                                     // Phone
      data.interests.includes('news') ? 'Yes' : 'No',      // Receive News
      data.interests.includes('funder') ? 'Yes' : 'No',    // Become Funder
      data.interests.includes('partner') ? 'Yes' : 'No'    // Become Partner
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Form submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the script works
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        companyName: 'Test Company',
        role: 'Developer',
        phone: '555-1234',
        interests: ['news', 'partner']
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. Click the **Save** icon (💾) or press `Cmd+S` (Mac) / `Ctrl+S` (Windows)
5. Name your project (e.g., "AIJI Form Handler")

## Step 3: Test the Script (Optional but Recommended)

1. In the Apps Script editor, select the `testDoPost` function from the dropdown at the top
2. Click the **Run** button (▶️)
3. If prompted, click **Review permissions** and authorize the script
4. Check your Google Sheet - you should see a test row added with sample data
5. If the test works, delete the test row from your sheet

## Step 4: Deploy as Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type" and choose **Web app**
3. Configure the deployment:
   - **Description**: "AIJI Get Involved Form Handler" (or any description)
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** (this allows anonymous form submissions)
4. Click **Deploy**
5. If prompted, click **Authorize access** and follow the authorization flow
6. **IMPORTANT**: Copy the **Web app URL** that appears - it will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
7. Click **Done**

## Step 5: Update Your Website Code

1. Open the file: `v02/public/script.js`
2. Find this line (around line 4068):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` with your actual Web app URL from Step 4:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
4. Save the file

## Step 6: Test the Form

1. Deploy your website or test locally
2. Click "Get Involved" button
3. Fill out the form with test data
4. Submit the form
5. Check your Google Sheet - you should see a new row with the submitted data

## Troubleshooting

### Form submissions not appearing in the sheet

1. **Check the URL**: Make sure you copied the correct Web app URL (it should end with `/exec`)
2. **Check permissions**: The script must be deployed with "Execute as: Me" and "Who has access: Anyone"
3. **Check the console**: Open browser DevTools (F12) and check the Console tab for errors
4. **Re-deploy**: If you made changes to the Apps Script, you need to create a new deployment:
   - Go to **Deploy** → **Manage deployments**
   - Click the pencil icon (✏️) next to your deployment
   - Change the version to "New version"
   - Click **Deploy**

### Authorization issues

- Make sure you've authorized the script to access your Google Sheets
- If you get permission errors, try re-deploying and re-authorizing

### CORS errors

- This is normal! The script uses `mode: 'no-cors'` which means you won't see detailed error messages
- The form will still work even if you see CORS warnings in the console

## Data Privacy & Security

- The form data is stored in your Google Sheet, which only you can access
- The Apps Script runs under your Google account
- Form submissions are transmitted over HTTPS
- Consider adding a privacy policy to your website explaining how you handle form data

## Viewing Submissions

Your Google Sheet will automatically populate with new rows as users submit the form. Each row includes:

- **Timestamp**: When the form was submitted
- **Email**: User's email address
- **First Name**: User's first name
- **Last Name**: User's last name
- **Company Name**: User's company (if provided)
- **Role**: User's role (if provided)
- **Phone**: User's phone number (if provided)
- **Receive News**: "Yes" if checked, "No" if not
- **Become Funder**: "Yes" if checked, "No" if not
- **Become Partner**: "Yes" if checked, "No" if not

## Advanced: Email Notifications (Optional)

If you want to receive email notifications when someone submits the form, add this function to your Apps Script:

```javascript
function sendEmailNotification(data) {
  const recipient = 'your-email@example.com'; // Change this to your email
  const subject = 'New Get Involved Form Submission';
  const body = `
New form submission received:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Company: ${data.companyName || 'Not provided'}
Role: ${data.role || 'Not provided'}
Phone: ${data.phone || 'Not provided'}

Interests:
- Receive news and updates: ${data.interests.includes('news') ? 'Yes' : 'No'}
- Become a funder: ${data.interests.includes('funder') ? 'Yes' : 'No'}
- Become a partner: ${data.interests.includes('partner') ? 'Yes' : 'No'}

View all submissions: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
  `;
  
  MailApp.sendEmail(recipient, subject, body);
}
```

Then update the `doPost` function to call this after appending the row:

```javascript
// Add this line after sheet.appendRow(rowData);
sendEmailNotification(data);
```

---

## Need Help?

If you encounter any issues:

1. Check the Apps Script execution logs: **Executions** tab in the Apps Script editor
2. Make sure your Google Sheet has the correct column headers
3. Verify the Web app URL is correct in your `script.js` file
4. Test the form with simple data first (just required fields)

Your form should now be fully functional and saving submissions to Google Sheets!
