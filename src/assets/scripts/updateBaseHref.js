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

  const updateElementPaths = (selector, attribute, prefix) => {
    $(`${selector}[${attribute}^="${prefix}"]`).each((index, element) => {
      const $el = $(element);
      const currentPath = $el.attr(attribute);
      $el.attr(attribute, `v1/${currentPath}`);
    });
  };

  updateElementPaths('link', 'href', 'assets/');
  updateElementPaths('link', 'href', 'styles-');
  updateElementPaths('script', 'src', 'assets');
  updateElementPaths('script', 'src', 'polyfills');
  updateElementPaths('script', 'src', 'main');

  // Save the modified HTML back to the file
  fs.writeFile(filePath, $.html(), 'utf8', (writeErr) => {
    if (writeErr) {
      console.error(`Error writing to file: ${writeErr.message}`);
    } else {
      console.log('Base URL updated successfully.');
    }
  });
});
