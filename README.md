# Google Sheets WhatsApp Integration

This repository contains scripts and HTML forms for sending WhatsApp messages via Google Sheets and Google Apps Script. It allows for managing API tokens and endpoints directly within Google Sheets.

## Prerequisites

- Access to Google Sheets.
- Basic familiarity with Google Apps Script.

## Setup Instructions

### Step 1: Create a Google Spreadsheet

1. **Create a new Google Spreadsheet.**
   - Ensure the spreadsheet is set to English language.
   - Rename the first sheet to `Sheet1`.

2. **Setup the columns:**
   - In `Sheet1`, create the following columns:
     - `Column A`: Header should be `Phone`
     - `Column B`: Header should be `WA ID`

### Step 2: Create AppScript

1. **Open the Apps Script environment:**
   - Go to `Extensions` > `Apps Script`.

2. **Create the files:**
   - You will need to create three files in the Apps Script editor. Make sure the file names are case-sensitive.

#### File 1: Code.gs
   - This is the main script file that contains all the Google Apps Script code.
   - Copy and paste the content from the `Code.gs` provided in this repository.

#### File 2: Form.html
   - This HTML file contains the form used to send WhatsApp messages.
   - Copy and paste the content from the `Form.html` provided in this repository.

#### File 3: SettingsForm.html
   - This HTML file is used for setting the API token and endpoint.
   - Copy and paste the content from the `SettingsForm.html` provided in this repository.

## Usage

1. **Set API Token and Endpoint:**
   - Use the `Set Settings` menu item to open the settings form and enter your WhatsApp API token and endpoint.

2. **Sending Messages:**
   - Use the `Send Messages` menu to open the message sending form. Enter the necessary details and click send to dispatch messages to the numbers listed in your Google Sheet.

## Contributing

Contributions are welcome. Please fork this repository and submit a pull request if you have something to add.

## License

Distributed under the MIT License. See `LICENSE` for more information.
