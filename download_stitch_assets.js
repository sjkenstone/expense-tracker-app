const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectId = '6801864706041711356';
const screens = [
    { name: 'Transaction History', id: 'b62d3c594c9e43489b2d374e48650c98' },
    { name: 'Expense Dashboard', id: 'ba9f460c0cac47799ac298de8c0909e6' },
    { name: 'Reports & Stats', id: 'e21f1fcac3b94b13835708f286c791aa' },
    { name: 'Add Expense', id: 'e987ebe26c744768a83971a2a44fd027' },
    { name: 'User Profile & Settings', id: 'ef1619d596544e789adcd557dc6cdf46' }
];

const runCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, { 
            env: { 
                ...process.env, 
                STITCH_PROJECT_ID: projectId,
                CLOUDSDK_CONFIG: "C:\\Users\\User\\.stitch-mcp\\config",
                GOOGLE_APPLICATION_CREDENTIALS: "C:\\Users\\User\\.stitch-mcp\\config\\application_default_credentials.json",
                GOOGLE_CLOUD_PROJECT: "stitch-exp-tracker-26969",
                GCLOUD_PROJECT: "stitch-exp-tracker-26969"
            },
            maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large outputs
        }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${cmd}`);
                console.error(stderr);
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
};

const processScreen = async (screen) => {
    console.log(`Processing screen: ${screen.name} (${screen.id})`);
    const safeName = screen.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const basePath = path.join('stitch-assets', safeName);

    try {
        // 1. Get Code
        console.log(`  Fetching code for ${screen.name}...`);
        // Windows cmd.exe requires double quotes for JSON and escaping internal quotes
        const jsonArg = JSON.stringify({ 
            projectId: projectId, 
            screenId: screen.id 
        }).replace(/"/g, '\\"');
        const cmdCode = `npx @_davideast/stitch-mcp tool get_screen_code -d "${jsonArg}"`;
        
        const codeOutput = await runCommand(cmdCode);
        
        // Parse the tool output. It's usually JSON wrapped in some CLI output or raw JSON.
        // The tool output is likely the "content" array from the tool result.
        // However, npx output might include other logs. We need to find the JSON part.
        // Assuming the command outputs pure JSON or the last line is JSON.
        // Let's try to parse the whole stdout first.
        let codeData;
        try {
            // Find the JSON object in the output
            const jsonMatch = codeOutput.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                codeData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in output');
            }
        } catch (e) {
            console.error(`  Failed to parse code output for ${screen.name}:`, e.message);
            return;
        }

        if (codeData.htmlContent) {
            fs.writeFileSync(`${basePath}.html`, codeData.htmlContent);
            console.log(`  Saved code to ${basePath}.html`);
        } else {
            console.error(`  Unexpected code format for ${screen.name}`);
            console.log('  DEBUG: Code Output JSON keys:', Object.keys(codeData));
        }

        // 2. Get Image
        console.log(`  Fetching image for ${screen.name}...`);
        const cmdImage = `npx @_davideast/stitch-mcp tool get_screen_image -d "${jsonArg}"`;
        const imageOutput = await runCommand(cmdImage);
        
        let imageData;
        try {
            const jsonMatch = imageOutput.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                imageData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in output');
            }
        } catch (e) {
            console.error(`  Failed to parse image output for ${screen.name}:`, e.message);
            return;
        }

        // Expecting base64 string in screenshotBase64
        if (imageData.screenshotBase64) {
            // Check if it's base64 (might be prefixed with data:image/png;base64,)
            let base64 = imageData.screenshotBase64;
            if (base64.startsWith('data:image')) {
                base64 = base64.split(',')[1];
            }
            const buffer = Buffer.from(base64, 'base64');
            fs.writeFileSync(`${basePath}.png`, buffer);
            console.log(`  Saved image to ${basePath}.png`);
        } else {
            console.error(`  Unexpected image format for ${screen.name}`);
            console.log('  DEBUG: Image Output JSON keys:', Object.keys(imageData));
        }

    } catch (err) {
        console.error(`  Failed to process ${screen.name}:`, err.message);
    }
};

const main = async () => {
    for (const screen of screens) {
        await processScreen(screen);
    }
    console.log('All screens processed.');
};

main();
