import app from './app.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import os from 'os';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Ensure upload directories exist
const uploadDir = path.join(os.tmpdir(), 'uploads/job');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server');
  console.error(error);
  process.exit(1);
});
