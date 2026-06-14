const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/fetch', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).json({ status: false, message: 'URL kosong' });

        const response = await axios.get(`https://api.danzy.web.id/api/download/instagram?url=${encodeURIComponent(url)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Referer': 'https://google.com/',
                'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site'
            },
            timeout: 15000
        });

        res.json(response.data);
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Gagal mengambil data dari server API target';
        res.status(error.response?.status || 500).json({ status: false, message: errorMsg });
    }
});

app.get('/api/download', async (req, res) => {
    const fileUrl = req.query.url;
    const type = req.query.type || 'video';
    if (!fileUrl) return res.status(400).send('URL konten tidak valid');

    try {
        const response = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': 'https://www.instagram.com/'
            }
        });
        
        const filename = `instagram_${Date.now()}`;
        let ext = '.mp4';
        if (type === 'mp3') ext = '.mp3';
        if (type === 'photo') ext = '.jpeg';
        
        res.setHeader('Content-Disposition', `attachment; filename="${filename}${ext}"`);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send('Gagal mengunduh file media');
    }
});

module.exports = app;
