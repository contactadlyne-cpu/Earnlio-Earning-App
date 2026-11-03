import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';

try {
  const zip = new AdmZip();
  const backendDir = path.resolve('backend');
  const outputZipPath = path.resolve('public/backend-hostinger.zip');

  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }

  console.log('Zipping backend directory:', backendDir);
  zip.addLocalFolder(backendDir, 'earnlio-hostinger-backend');
  zip.writeZip(outputZipPath);
  console.log('Successfully created:', outputZipPath);
} catch (err) {
  console.error('Error creating backend zip:', err);
}
