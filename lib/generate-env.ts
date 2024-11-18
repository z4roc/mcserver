import fs from 'fs';
import path from 'path';
import { config } from '@/qs.config';

// Ensure the API key exists in the config
if (!config.curseforge_api_key) {
    console.error('Error: API key is missing in qs.config.ts');
    process.exit(1);
}

// Define the content of the `.env` file
const envContent = `CF_API_KEY=${config.curseforge_api_key.replace("$", "$$")}\n`;

// Define the `.env` file path
const envFilePath = path.join(process.cwd(), '.env');

// Write the `.env` file
fs.writeFileSync(envFilePath, envContent, 'utf8');
console.log(`.env file has been generated at ${envFilePath}`);
