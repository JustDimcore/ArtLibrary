import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {Request, RequestHandler, Response} from 'express';
import {GoogleService} from './googleService';
import * as jwtExpress from 'express-jwt';
import {NextFunction} from 'connect';

export enum Permission {
    View,
    Upload,
    ForceDelete,
    GivePermissions
}

export class AccessService {

    private _permissions: {[email: string]: Permission[]} = {};
    private _googleService: GoogleService;

    constructor(private _app: express.Express, private _enableGoogleAuth: boolean) {
        if (_enableGoogleAuth) {
            this._googleService = new GoogleService();
            this.processGoogleAuth();
        }
    }

    public getAuthConfig() {
        return {
            enableGoogleAuth : this._enableGoogleAuth,
            googleAuthUrl: this._enableGoogleAuth ? this._googleService.getGoogleUrl() : ''
        };
    }

    private processGoogleAuth() {

        this._app.post('/google-auth', async(req: Request, res: Response) => {

            const code = req.body['code'];
            if (!code) {
                res.status(401).send('Invalid code');
            }

            const account: {hd: string, email: string} = await this._googleService.getGoogleAccountFromCode(code)
                .catch((error) => {
                    console.log(error);
                    res.status(401).send(error);
                });

            console.log(account);

            const userPermissions = this.getUserPermissions(account.email);
            if (!userPermissions) {
                this.grantPermissions(account.email, Permission.View);
            }

            const hasPermissions = this.hasPermission(account.email, Permission.View);

            const token = jwt.sign({ sub: account.email, role: 'Admin' }, 'shhhhhhared-secret');

            res.status(hasPermissions ? 200 : 403).send(hasPermissions ? {token} : { error: 'access denied' });
        });
    }

    public authorize(roles: any[] = []) {
        // roles param can be a single role string (e.g. Role.User or 'User')
        // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
        if (typeof roles === 'string') {
            roles = [roles];
        }

        return [
            // authenticate JWT token and attach user to request object (req.user)
            jwtExpress({ secret: 'shhhhhhared-secret' }),

            // authorize based on user role
            (req: any, res: Response, next: NextFunction) => {
                if (roles.length && !roles.includes(req.user.role)) {
                    // user's role is not authorized
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                // authentication and authorization successful
                next();
            }
        ];
    }

    private getUserPermissions(email: string): Permission[] {
        return this._permissions[email];
    }

    private grantPermissions(email: string, permissions: Permission | Permission[]) {
        let userPermissions = this.getUserPermissions(email);
        if (!userPermissions) {
            userPermissions = [];
            this._permissions[email] = userPermissions;
        }
        if (Array.isArray(permissions)) {
            permissions.forEach(p => this.grantPermission(p, userPermissions));
        } else {
            this.grantPermission(permissions, userPermissions);
        }
    }

    private grantPermission(permission: Permission, list: Permission[]) {
        if (!list.includes(permission)) {
            list.push(permission);
        }
    }

    private hasPermission(email: string, permission: Permission) {
        const userPermissions = this.getUserPermissions(email);
        if (!userPermissions) {
            return false;
        }

        return userPermissions.includes(permission);
    }    
}
