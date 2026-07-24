const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'LOGO QRIS RUN GOLD.png');
const outputPath = path.join(__dirname, 'public', 'logo.webp');

sharp(inputPath)
  .resize({ width: 800, withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile(outputPath)
  .then(() => {
    console.log('Successfully converted logo to webp');
  })
  .catch(err => {
    console.error('Error converting logo:', err);
  });
