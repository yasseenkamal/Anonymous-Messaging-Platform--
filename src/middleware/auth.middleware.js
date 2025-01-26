import userModel from '../DB/model/User.model.js';
import { asyncHandler } from '../utils/error/error.js';
import { verifyToken } from '../utils/security/token.js';
import { generateDecryption } from '../utils/security/encryption.js';

export const userRoles = {
    user: 'user',
    admin: 'admin'
}


export const authentication = () => {
    return asyncHandler(async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization) {
            return next(new Error('Authorization header is missing', { cause: 401 }));
        }

        const [bearer, token] = authorization.split(" ");
        if (!bearer || !token) {
            return next(new Error('Invalid token format. Use Bearer <token>', { cause: 401 }));
        }

        let signature;
        switch (bearer.toLowerCase()) {
            case 'admin':
                signature = process.env.TOKEN_SIGNATURE_ADMIN;
                break;
            case 'bearer':
                signature = process.env.TOKEN_SIGNATURE;
                break;
            default:
                return next(new Error('Invalid bearer type. Use "Bearer" or "Admin"', { cause: 401 }));
        }

        const decoded = verifyToken({ token, signature });
        if (!decoded || !decoded.id) {
            return next(new Error('Invalid token payload', { cause: 401 }));
        }

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return next(new Error('Account not registered', { cause: 404 }));
        }

        if (user.changePasswordTime?.getTime() >= decoded.iat * 1000) {
            return next(new Error('Invalid credentials', { cause: 400 }));
        }

        user.phone = generateDecryption({
            cipher: user.phone,
            signature: process.env.ENCRYPTION_SIGNATURE,
        });

        req.user = user;
        next();
    });
};


export const authorization = (accessRoles = []) => {
    return asyncHandler(async (req, res, next) => {

        if (!accessRoles.includes(req.user.role)) {
            return next(new Error('unauthorized account', { cause: 403 }))

        }
        return next()

    })
}
