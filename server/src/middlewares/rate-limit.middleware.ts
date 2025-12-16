import rateLimit from 'express-rate-limit';
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos
    message: 'Too many attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});