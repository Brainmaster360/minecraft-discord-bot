const http = require('http');
const { exec } = require('child_process');

const PORT = 9000;

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            console.log('🔄 GitHub Webhook Triggered!');
            
            exec('cd ~/minecraft-discord-bot && git pull origin main && pm2 restart minecraft-bot', (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error pulling from GitHub: ${stderr}`);
                    return res.end('Git Pull Failed');
                }
                console.log(`✅ Git Pull Success: ${stdout}`);
                res.end('Git Pull Successful');
            });
        });
    } else {
        res.end('Webhook Server Running.');
    }
});

server.listen(PORT, () => {
    console.log(`Listening for GitHub webhooks on port ${PORT}`);
});
