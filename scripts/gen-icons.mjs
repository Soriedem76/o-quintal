// scripts/gen-icons.mjs
// Run: node scripts/gen-icons.mjs
// Requires: npm install canvas (optional, or use any icon generator)
// This creates simple SVG-based placeholder icons

import fs from 'fs';
import path from 'path';

const iconDir = 'public/icons';
fs.mkdirSync(iconDir, { recursive: true });

// SVG icon template — Q letter with graffiti feel
const makeSVG = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#0D0D0D"/>
  <rect x="${size*0.08}" y="${size*0.08}" width="${size*0.84}" height="${size*0.84}" fill="none" stroke="#D62828" stroke-width="${size*0.04}"/>
  <text x="50%" y="58%" font-family="serif" font-weight="900" font-size="${size*0.55}" fill="#F0EDE6" text-anchor="middle" dominant-baseline="middle">Q</text>
  <line x1="${size*0.58}" y1="${size*0.62}" x2="${size*0.78}" y2="${size*0.82}" stroke="#D62828" stroke-width="${size*0.06}" stroke-linecap="round"/>
</svg>`.trim();

fs.writeFileSync(path.join(iconDir, 'icon-192.svg'), makeSVG(192));
fs.writeFileSync(path.join(iconDir, 'icon-512.svg'), makeSVG(512));

// Also write PNG placeholders as data (1x1 red pixel base64 → just a placeholder)
// For production, replace with proper PNG icons
const placeholder192 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <rect width="192" height="192" fill="#0D0D0D"/>
  <rect x="15" y="15" width="162" height="162" fill="none" stroke="#D62828" stroke-width="8"/>
  <text x="96" y="115" font-family="serif" font-weight="900" font-size="105" fill="#F0EDE6" text-anchor="middle">Q</text>
  <line x1="112" y1="119" x2="150" y2="157" stroke="#D62828" stroke-width="12" stroke-linecap="round"/>
</svg>`;

fs.writeFileSync(path.join(iconDir, 'icon-192.png'), placeholder192); // SVG used as fallback
fs.writeFileSync(path.join(iconDir, 'icon-512.png'), makeSVG(512));

console.log('Icons generated in public/icons/');
console.log('NOTE: Replace with proper PNG icons for production.');
console.log('Use https://realfavicongenerator.net or similar tool.');
