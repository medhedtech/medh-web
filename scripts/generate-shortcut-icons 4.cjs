const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const shortcuts = [
  { name: 'courses', color: '#4FD1C5' },
  { name: 'login', color: '#7ECA9D' }
];

const iconDir = path.join(__dirname, '../public/icons');

// Ensure the icons directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

async function generateShortcutIcons() {
  try {
    for (const shortcut of shortcuts) {
      // Create a 192x192 icon with the specified color
      await sharp({
        create: {
          width: 192,
          height: 192,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        }
      })
        .composite([
          {
            input: Buffer.from(
              `<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
                <circle cx="96" cy="96" r="88" fill="${shortcut.color}"/>
                <text x="96" y="96" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
                  ${shortcut.name.toUpperCase()}
                </text>
              </svg>`
            ),
            top: 0,
            left: 0
          }
        ])
        .toFile(path.join(iconDir, `${shortcut.name}.png`));
    }

    console.log('Shortcut icons generated successfully!');
  } catch (error) {
    console.error('Error generating shortcut icons:', error);
  }
}

generateShortcutIcons(); 