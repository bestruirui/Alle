#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envVars = {
    D1_DATABASE_ID: process.env.D1_DATABASE_ID,
    ENABLE_AI_EXTRACT: process.env.ENABLE_AI_EXTRACT,
    EXTRACT_MODEL: process.env.EXTRACT_MODEL,
    JWT_MIN_TTL: process.env.JWT_MIN_TTL,
    JWT_MAX_TTL: process.env.JWT_MAX_TTL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
};

const configPath = path.join(__dirname, '..', 'wrangler.jsonc');
const envLocalPath = path.join(__dirname, '..', '.env.local');

const configContent = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configContent);

if (config.vars) {
    ['ENABLE_AI_EXTRACT', 'EXTRACT_MODEL', 'JWT_MIN_TTL', 'JWT_MAX_TTL']
        .forEach(key => {
            if (envVars[key]) config.vars[key] = envVars[key];
        });
}

if (config.d1_databases?.[0]?.database_id && envVars.D1_DATABASE_ID) {
    config.d1_databases[0].database_id = envVars.D1_DATABASE_ID;
}

fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'), 'utf-8');
console.log(`✓ 更新 wrangler.jsonc`);

const envLocalVars = {
    OPENAI_API_KEY: envVars.OPENAI_API_KEY,
    OPENAI_BASE_URL: envVars.OPENAI_BASE_URL,
    USERNAME: envVars.USERNAME,
    PASSWORD: envVars.PASSWORD,
};

const envFileContent = Object.entries(envLocalVars)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n') + '\n';

if (envFileContent.trim()) {
    fs.writeFileSync(envLocalPath, envFileContent, 'utf-8');
    console.log(`✓ 生成 .env.local`);
}
