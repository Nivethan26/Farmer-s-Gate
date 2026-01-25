import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create receipts subdirectory
const receiptDir = path.join(uploadsDir, 'receipts');
if (!fs.existsSync(receiptDir)) {
    fs.mkdirSync(receiptDir, { recursive: true });
}

// Simple multer configuration with memory storage for testing
const upload = multer({
    storage: multer.memoryStorage(), // Use memory storage for now
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// Simple middleware that processes any multipart form
const uploadReceipt = (req, res, next) => {
    console.log('Upload middleware called');
    console.log('Content-Type:', req.get('Content-Type'));
    
    const multerMiddleware = upload.any();
    multerMiddleware(req, res, (err) => {
        console.log('Multer processing complete');
        console.log('Error:', err);
        console.log('req.body after multer:', req.body);
        console.log('req.files after multer:', req.files);
        
        if (err) {
            console.log('Multer error:', err);
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

export {
    uploadReceipt,
    uploadsDir
};