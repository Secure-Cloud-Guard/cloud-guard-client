const fs = require('fs');

// Check if the file path is provided as a command-line argument
if (process.argv.length !== 3) {
  console.error('Usage: node script.js <file-path>');
  process.exit(1);
}

const filePath = process.argv[2];

// Read the file
fs.readFile(filePath, 'utf8', (readErr, data) => {
  if (readErr) {
    console.error(`Error reading file: ${readErr.message}`);
    return;
  }

  // Perform string replacements
  const updatedFile = data
    .replace(/http:\/\/localhost:4300/g, 'https://cloud-guard.app')
    .replace(/http:\/\/localhost:4200/g, 'https://auth.cloud-guard.app/');

  // Write the modified content back to the file
  fs.writeFile(filePath, updatedFile, 'utf8', (writeErr) => {
    if (writeErr) {
      console.error(`Error writing to file: ${writeErr.message}`);
    } else {
      console.log('URLs updated successfully.');
    }
  });
});
