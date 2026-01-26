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

// Configure disk storage for receipts
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, receiptDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'receipt-' + uniqueSuffix + ext);
    }
});

// Multer configuration with disk storage
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
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