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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
