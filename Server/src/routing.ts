import * as express from 'express';
import {Response, Request, RequestHandler} from 'express';
import * as path from 'path';
import * as jwtExpress from 'express-jwt';
import * as jwt from 'jsonwebtoken';
import { NextFunction } from 'connect';

import {FilterService} from './filterService';
import { FileService } from './filesService';
import { SpriteMetaService } from './spriteMetaService';
import { PreviewService } from './previewService';
import { SpriteInfo } from './spriteInfo';
import { GoogleSevice } from './google-util';
import { AccessService, Permission } from './accessService';


export class Routing {

    users = [
        { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: 'Admin' },
        { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: 'User' }
    ];

    constructor(app: express.Express) {

        const enableGoogleAuth = process.env.ENABLE_GOOGLE_AUTH || true;
        const artPath = process.env.ART_PATH || 'public/art';
        const previewPath = process.env.PREVIEW_PATH || 'public/preview';
        const port = process.env.PORT || 3000;
        const fullArtPath = path.join(__dirname, artPath);
        const fullPreviewPath = path.join(__dirname, previewPath);
        const projectMetaService = new SpriteMetaService();
        const fileService = new FileService(fullArtPath, projectMetaService);
        const previewService = new PreviewService(fullArtPath, fullPreviewPath);

        const filterService = new FilterService();
        const googleService = enableGoogleAuth ? new GoogleSevice() : null;
        const accessService = new AccessService();

        let spritesList: SpriteInfo[];


        app.post('/auth', (req, res, next) => {
                console.log('auth');
                this.authenticate(req.body)
                    .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
                    .catch(err => next(err));
            }
        );

        app.get('/config', (req: Request, res: Response) => {
            res.send({
                enableGoogleAuth,
                googleAuthUrl: enableGoogleAuth ? googleService.getGoogleUrl() : ''
            });
        });


        if (enableGoogleAuth) {
            app.post('/google-auth', (req: Request, res: Response) => {

                const code = req.body['code'];
                if (!code) {
                    res.status(401).send('Invalid code');
                }

                googleService.getGoogleAccountFromCode(code)
                    .catch((error) => {
                        console.log(error);
                        res.status(401).send(error);
                    }).then((account: {hd: string, email: string}) => {
                    console.log(account);

                    const userPermissions = accessService.getUserPermissions(account.email);

                    if (!userPermissions) {
                        accessService.grantPermissions(account.email, Permission.View);
                    }

                    const hasPermissions = accessService.hasPermission(account.email, Permission.View);

                    const token = jwt.sign({ sub: account.email, role: 'Admin' }, 'shhhhhhared-secret');
                    console.log(token);

                    res.status(hasPermissions ? 200 : 403).send(hasPermissions ? {token} : { error: 'access denied' });
                });
            });
        }



        app.get('/search', [this.authorize(), (req: Request, res: Response) => {
            const filtered = req.query ? filterService.filter(spritesList, req.query) : spritesList;
            res.send(filtered);
        }] as RequestHandler[]);

        app.get('/list', [this.authorize(), (req: Request, res: Response) => {
            res.send(spritesList);
        }] as RequestHandler[]);

        app.use('/art', express.static(path.join(__dirname, 'public/art/')));
        app.use('/preview', express.static(path.join(__dirname, 'public/preview/')));

        app.post('/upload', (req: Request, res: Response) => {
            if (!req.files || !req.files['fileKey']) {
                console.log('No file');
                res.status(503).send({error: 'No file'});
                return;
            }
            const fileKey = req.files['fileKey'];
            const files = (Array.isArray(fileKey) ? fileKey : [fileKey]) as any[];

            const filesPromises: Promise<SpriteInfo>[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                filesPromises.push(fileService.saveSprite(file));
            }
            (async () => {
                const sprites = await Promise.all(filesPromises);
                await previewService.updatePreviews(sprites, true);
            })();
        });

        app.get('/art', [this.authorize(), express.static(path.join(__dirname, 'public/client/'))] as RequestHandler[]);
        app.get('/preview', [this.authorize(), express.static(path.join(__dirname, 'public/client/'))] as RequestHandler[]);

        app.use(express.static(path.join(__dirname, 'public/client/')));

        app.get('/*', (req: Request, res: Response) => {
            //res.redirect(urlGoogle());
            res.sendFile(path.join(__dirname, 'public/client/index.html'));
        });

        (async function() {
            // Get sprites list
            spritesList = await fileService.getFilePaths();
            console.log(`got files list: ${spritesList.length} files`);

            previewService.updatePreviews(spritesList, true);
            app.listen(port, () => {
                console.log(`Listening on port ${port}!`);
            });
        })();
    }


    async authenticate(userCreds: {username: string, password: string}) {
        const user = this.users.find(u => u.username === userCreds.username && u.password === userCreds.password);
        if (user) {
            const token = jwt.sign({ sub: user.id, role: user.role }, 'shhhhhhared-secret');
            const { password, ...userWithoutPassword } = user;
            return {
                ...userWithoutPassword,
                token
            };
        }
    }

    authorize(roles: any[] = []) {
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

}
