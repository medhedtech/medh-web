const fs = require('fs');
const path = require('path');

// Create the instructors directory if it doesn't exist
const instructorsDir = path.join(__dirname, '../public/assets/images/instructors');
if (!fs.existsSync(instructorsDir)) {
  fs.mkdirSync(instructorsDir, { recursive: true });
}

// Generate placeholder SVG images for instructors
for (let i = 1; i <= 8; i++) {
  const svgContent = `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f0f0f0"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#666" text-anchor="middle" dominant-baseline="middle">
    Instructor ${i}
  </text>
</svg>
  `;
  
  fs.writeFileSync(path.join(instructorsDir, `instructor-${i}.jpg`), svgContent);
  console.log(`Created placeholder image for instructor-${i}.jpg`);
}

console.log('All placeholder images generated successfully!'); 