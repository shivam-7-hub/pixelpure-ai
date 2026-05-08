const https = require('https');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { image } = req.body;
    const api_key = process.env.REPLICATE_API_KEY;

    const postData = JSON.stringify({
        version: "da8df5e8c9735d4817a3a30c5e1b12b5e7d41f09cf6e0777e48b871c828d57d7",
        input: { image: image, upscale: 2, face_enhance: true }
    });

    const options = {
        hostname: 'api.replicate.com',
        path: '/v1/predictions',
        method: 'POST',
        headers: {
            'Authorization': `Token ${api_key}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => res.status(response.statusCode).json(JSON.parse(data)));
    });

    request.on('error', (e) => res.status(500).json({ error: e.message }));
    request.write(postData);
    request.end();
}

