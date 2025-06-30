const fs = require('fs');
const path = require('path');
const https = require('https');

const fonts = [
  {
    name: 'Inter-Regular.ttf',
    url: 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.otf'
  },
  {
    name: 'Inter-Medium.ttf',
    url: 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Medium.otf'
  },
  {
    name: 'Inter-SemiBold.ttf',
    url: 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-SemiBold.otf'
  },
  {
    name: 'Inter-Bold.ttf',
    url: 'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.otf'
  }
];

const fontsDir = path.join(__dirname, '../assets/fonts');

// Create fonts directory if it doesn't exist
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Download each font
fonts.forEach(font => {
  const filePath = path.join(fontsDir, font.name);
  const file = fs.createWriteStream(filePath);

  https.get(font.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${font.name}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {}); // Delete the file if there's an error
    console.error(`Error downloading ${font.name}:`, err.message);
  });
}); 