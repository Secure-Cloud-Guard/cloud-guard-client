const fs = require('fs');
const cheerio = require('cheerio');

if (process.argv.length < 3) {
  console.error('Usage: node updateBaseHref.js <path-to-html-file>');
  process.exit(1);
}

const filePath = process.argv[2];

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  // Load HTML content into Cheerio
  const $ = cheerio.load(data);

  // Find the <base> tag with href="/" and update its href attribute
  const baseTag = $('base[href="/"]');
  if (baseTag.length > 0) {
    baseTag.attr('href', '/v1');

    // Save the modified HTML back to the file
    fs.writeFile(filePath, $.html(), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error(`Error writing to file: ${writeErr.message}`);
      } else {
        console.log('Base href updated successfully.');
      }
    });
  } else {
    console.log('No <base> tag with href="/" found in the HTML file.');
  }
});
