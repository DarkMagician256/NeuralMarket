const fs = require('fs');
const path = require('path');

// Try to find zod path
const zodPath = path.resolve(__dirname, '../node_modules/zod');

if (fs.existsSync(zodPath)) {
    console.log('🩹 Patching Zod: Creating v3.js compatibility layer...');

    // Create v3.js pointing to index.js (CJS)
    const v3Content = "module.exports = require('./index.js');";
    fs.writeFileSync(path.join(zodPath, 'v3.js'), v3Content);

    // Create v3.d.ts pointing to index.d.ts
    const v3Types = "export * from './index';";
    fs.writeFileSync(path.join(zodPath, 'v3.d.ts'), v3Types);

    console.log('✅ Zod patched successfully for Langchain compatibility.');
} else {
    console.warn('⚠️ Zod not found in node_modules, skipping patch.');
}
