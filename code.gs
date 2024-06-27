function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('WhatsApp Sender')
    .addItem('Send Messages', 'showSidebar')
    .addItem('Set Settings', 'promptForSettings') // Menu item for settings
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Form')
    .setTitle('Send WhatsApp Message')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function promptForSettings() {
  const html = HtmlService.createHtmlOutputFromFile('SettingsForm')
    .setWidth(400)
    .setHeight(250);
  SpreadsheetApp.getUi().showModalDialog(html, 'Set API Token and Endpoint');
}

function setSettings(token, endpoint) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  sheet.getRange('D1').setValue(token); // Save token to cell D1
  sheet.getRange('E1').setValue(endpoint); // Save endpoint to cell E1
}

function getSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  return {
    token: sheet.getRange('D1').getValue(),
    endpoint: sheet.getRange('E1').getValue()
  };
}

function stopSendingMessages() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('stopSending', 'true'); // Set the stop flag
}

function sendWhatsAppMessages(templateName, languageCode, imageUrl, startRow, endRow, delaySeconds) {
  const settings = getSettings();
  const token = settings.token;
  const endpoint = settings.endpoint;

  if (!token || !endpoint) {
    SpreadsheetApp.getUi().alert('API Token or Endpoint is not set. Please set them first.');
    return "Settings not complete";
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Sheet1');
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('stopSending', 'false'); // Reset the stop flag
  startRow = parseInt(startRow);
  endRow = parseInt(endRow);
  const delay = parseInt(delaySeconds) * 1000;
  const statusCell = sheet.getRange("C1");

  statusCell.setValue("Starting to send messages...");

  for (let i = startRow; i <= endRow; i++) {
    if (scriptProperties.getProperty('stopSending') === 'true') {
      statusCell.setValue("Sending stopped by user at message " + (i - startRow));
      return "Sending stopped by user.";
    }

    const phoneNumber = sheet.getRange(i, 1).getValue();

    if (!phoneNumber || !templateName || !languageCode || !imageUrl) {
      sheet.getRange(i, 2).setValue("Error: Missing required information");
      continue;
    }

    const formattedPhoneNumber = `+${phoneNumber}`;
    const messageData = {
      "messaging_product": "whatsapp",
      "to": formattedPhoneNumber,
      "type": "template",
      "template": {
        "name": templateName,
        "language": {
          "code": languageCode
        },
        "components": [
          {
            "type": "header",
            "parameters": [
              {
                "type": "image",
                "image": {
                  "link": imageUrl
                }
              }
            ]
          }
        ]
      }
    };

    const options = {
      "method": "post",
      "headers": {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      "payload": JSON.stringify(messageData),
      "muteHttpExceptions": true
    };

    try {
      const response = UrlFetchApp.fetch(endpoint, options);
      const responseJson = JSON.parse(response.getContentText());

      if (response.getResponseCode() === 200) {
        const messageId = responseJson.messages[0].id;
        sheet.getRange(i, 2).setValue(messageId);
        statusCell.setValue(`Sending message ${i - startRow + 1} of ${endRow - startRow + 1}...`);
      } else {
        sheet.getRange(i, 2).setValue("Failed to send: " + response.getContentText());
      }
    } catch (error) {
      sheet.getRange(i, 2).setValue("Error: " + error.toString());
    }

    Utilities.sleep(delay);
  }

  statusCell.setValue("All messages have been sent.");
  return "Attempt to send messages completed.";
}
