import express from 'express';
import  { verifyJwt, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

//Protected profile endpoint
router.get('/me', verifyJwt, (req, res) => {
    res.status(200).json({
        message: 'authenticated successfully',
        user: {
            id: req.user.id,
            email: req.user.email,
            full_name: req.user.full_name,
            role: req.user.role,
        },
    });
});

//Admin-only test-endpoint
router.get('/admin-only', verifyJwt, requireRole(['admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome Admin! Access granted.' });
});

export default router;