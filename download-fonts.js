const fs = require('fs');
const path = require('path');
const https = require('https');

// Create fonts directory if it doesn't exist
const fontsDir = path.join(__dirname, 'src', 'assets', 'fonts');
const montserratDir = path.join(fontsDir, 'montserrat');
const poppinsDir = path.join(fontsDir, 'poppins');
const hindDir = path.join(fontsDir, 'hind');

// Create directories if they don't exist
[fontsDir, montserratDir, poppinsDir, hindDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Font URLs and file names
const fonts = [
  // Hind fonts
  {
    url: 'https://fonts.gstatic.com/s/hind/v17/5aU69_a8oxmIdGl4BDGwgDI.woff2',
    filename: path.join(hindDir, 'Hind-Light.woff2'),
    weight: '300'
  },
  {
    url: 'https://fonts.gstatic.com/s/hind/v17/5aU69_a8oxmIdGd4BDGwgDJm_A.woff2',
    filename: path.join(hindDir, 'Hind-Regular.woff2'),
    weight: '400'
  },
  {
    url: 'https://fonts.gstatic.com/s/hind/v17/5aU69_a8oxmIdGh4BDGwgDJm_A.woff2',
    filename: path.join(hindDir, 'Hind-Medium.woff2'),
    weight: '500'
  },
  {
    url: 'https://fonts.gstatic.com/s/hind/v17/5aU69_a8oxmIdGh4BDGwgDJm_A.woff2',
    filename: path.join(hindDir, 'Hind-SemiBold.woff2'),
    weight: '600'
  },
  {
    url: 'https://fonts.gstatic.com/s/hind/v17/5aU69_a8oxmIdGh4BDGwgDJm_A.woff2',
    filename: path.join(hindDir, 'Hind-Bold.woff2'),
    weight: '700'
  },
  
  // Montserrat fonts
  {
    url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.woff2',
    filename: path.join(montserratDir, 'Montserrat-Regular.woff2'),
    weight: '400'
  },
  {
    url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw5aXo.woff2',
    filename: path.join(montserratDir, 'Montserrat-Medium.woff2'),
    weight: '500'
  },
  {
    url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu173w5aXo.woff2',
    filename: path.join(montserratDir, 'Montserrat-SemiBold.woff2'),
    weight: '600'
  },
  {
    url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aXo.woff2',
    filename: path.join(montserratDir, 'Montserrat-Bold.woff2'),
    weight: '700'
  },
  
  // Poppins fonts
  {
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDz8Z1xlFQ.woff2',
    filename: path.join(poppinsDir, 'Poppins-Light.woff2'),
    weight: '300'
  },
  {
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
    filename: path.join(poppinsDir, 'Poppins-Regular.woff2'),
    weight: '400'
  },
  {
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2',
    filename: path.join(poppinsDir, 'Poppins-Medium.woff2'),
    weight: '500'
  },
  {
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2',
    filename: path.join(poppinsDir, 'Poppins-SemiBold.woff2'),
    weight: '600'
  },
  {
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2',
    filename: path.join(poppinsDir, 'Poppins-Bold.woff2'),
    weight: '700'
  }
];

// Download function
const downloadFont = (font) => {
  return new Promise((resolve, reject) => {
    const filePath = font.filename;
    const file = fs.createWriteStream(filePath);
    
    console.log(`Downloading ${path.basename(font.filename)} (${font.weight})...`);
    
    https.get(font.url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${path.basename(font.filename)}: HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded ${path.basename(font.filename)}`);
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
      console.error(`Error downloading ${path.basename(font.filename)}:`, error.message);
    }
  }
  
  console.log('Font download process completed.');
  console.log(`Check the directory: ${fontsDir}`);
};

downloadAllFonts(); 