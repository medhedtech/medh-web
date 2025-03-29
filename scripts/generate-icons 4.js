const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  16, 32, 72, 96, 128, 144, 152, 192, 256, 384, 512
];

const sourceImage = path.join(__dirname, '../src/assets/images/logo/medh_logo.png');
const iconDir = path.join(__dirname, '../public/icons');
const faviconPath = path.join(__dirname, '../src/app/favicon.ico');

// Ensure the icons directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

async function generateIcons() {
  try {
    // Generate favicon (ICO format with multiple sizes)
    await sharp(sourceImage)
      .resize(32, 32)
      .toFile(faviconPath);

    // Generate PNG icons
    for (const size of sizes) {
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(path.join(iconDir, `icon-${size}x${size}.png`));
    }

    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 