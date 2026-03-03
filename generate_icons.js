const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

const generateIcon = (size, fileName) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#3b82f6'; // Primary blue
    ctx.fillRect(0, 0, size, size);

    // Dollar sign
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size * 0.6}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', size / 2, size / 2);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(publicDir, fileName), buffer);
    console.log(`Generated ${fileName} (${size}x${size})`);
};

// Generate required icons
generateIcon(192, 'pwa-192x192.png');
generateIcon(512, 'pwa-512x512.png');
generateIcon(180, 'apple-touch-icon.png');

// For favicon, we'll just copy the 192 one or generate a small one
generateIcon(32, 'favicon.ico');
