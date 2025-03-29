const fs = require('fs');
const path = require('path');
const https = require('https');

// Create fonts directory if it doesn't exist
const fontsDir = path.join(__dirname, 'src', 'assets', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
  console.log(`Created directory: ${fontsDir}`);
}

// Font URLs and file names
const fonts = [
  {
    url: 'https://fonts.gstatic.com/s/hind/v17/5aU69_a8oxmIdGl4BDGwgDI.woff2',
    filename: 'Hind-Light.woff2',
    weight: '300'
  },
  {
    url: 'https://fonts.gstatic.com/s/hind/v17/5aU69_a8oxmIdGd4BDGwgDJm_A.woff2',
    filename: 'Hind-Regular.woff2',
    weight: '400'
  },
  {
    url: 'https://fonts.gstatic.com/s/hind/v17/5aU69_a8oxmIdGh4BDGwgDJm_A.woff2',
    filename: 'Hind-Medium.woff2',
    weight: '500'
  },
  {
    url: 'https://fonts.gstatic.com/s/hind/v17/5aU69_a8oxmIdGh4BDGwgDJm_A.woff2',
    filename: 'Hind-SemiBold.woff2',
    weight: '600'
  },
  {
    url: 'https://fonts.gstatic.com/s/hind/v17/5aU69_a8oxmIdGh4BDGwgDJm_A.woff2',
    filename: 'Hind-Bold.woff2',
    weight: '700'
  }
];

// Download function
const downloadFont = (font) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(fontsDir, font.filename);
    const file = fs.createWriteStream(filePath);
    
    console.log(`Downloading ${font.filename} (${font.weight})...`);
    
    https.get(font.url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${font.filename}: HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded ${font.filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
};

// Download all fonts
const downloadAllFonts = async () => {
  console.log('Starting font downloads...');
  
  for (const font of fonts) {
    try {
      await downloadFont(font);
    } catch (error) {
      console.error(`Error downloading ${font.filename}:`, error.message);
    }
  }
  
  console.log('Font download process completed.');
  console.log(`Check the directory: ${fontsDir}`);
};

downloadAllFonts(); 