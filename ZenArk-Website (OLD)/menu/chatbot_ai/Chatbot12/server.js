require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Membaca file statis dari folder 'public'

// Endpoint untuk menangani permintaan chat dari frontend
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        
        // Node.js v18+ sudah mendukung fetch API bawaan
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct:free", // Bisa diganti sesuai kebutuhan
                messages: messages
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        res.status(500).json({ error: { message: "Gagal terhubung ke server AI." } });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan aman di http://localhost:${PORT}`);
});