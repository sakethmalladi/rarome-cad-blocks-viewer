// services/dwgConverter.js
const { exec } = require('child_process');
const path = require('path');

async function convertDwgToDxf(inputPath, outputDir) {
  const outputPath = path.join(outputDir, `${path.basename(inputPath, '.dwg')}.dxf`);
  return new Promise((resolve, reject) => {
    exec(`TeighaFileConverter "${inputPath}" "${outputPath}"`, (error) => {
      if (error) reject(error);
      else resolve(outputPath);
    });
  });
}

module.exports = { convertDwgToDxf };