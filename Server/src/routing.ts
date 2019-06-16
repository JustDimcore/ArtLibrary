import * as express from 'express';
import {Request, RequestHandler, Response} from 'express';
import * as path from 'path';

import {FilterService} from './filterService';
import {FileService} from './filesService';
import {SpriteMetaService} from './spriteMetaService';
import {PreviewService} from './previewService';
import {SpriteInfo} from './spriteInfo';
import {AccessService} from './accessService';


export class Routing {

    constructor(app: express.Express) {

        const enableGoogleAuth = !!process.env.ENABLE_GOOGLE_AUTH || true;
        const artPath = process.env.ART_PATH || 'public/art';
        const previewPath = process.env.PREVIEW_PATH || 'public/preview';
        const port = process.env.PORT || 3000;
        const fullArtPath = path.join(__dirname, artPath);
        const fullPreviewPath = path.join(__dirname, previewPath);
        const projectMetaService = new SpriteMetaService();
        const fileService = new FileService(fullArtPath, projectMetaService);
        const previewService = new PreviewService(fullArtPath, fullPreviewPath);

        const filterService = new FilterService();
        const accessService = new AccessService(app, enableGoogleAuth);

        let spritesList: SpriteInfo[];
        let tagsCache: string[] = [];


        app.get('/config', (req: Request, res: Response) => {
            res.send(accessService.getAuthConfig());
        });

        app.get('/tags', [accessService.authorize(), (req: Request, res: Response) => {
            res.send(tagsCache);
        }] as RequestHandler[]);

        app.get('/search', [accessService.authorize(), (req: Request, res: Response) => {
            const filtered = req.query ? filterService.filter(spritesList, req.query) : spritesList;
            res.send(filtered);
        }] as RequestHandler[]);

        app.get('/list', [accessService.authorize(), (req: Request, res: Response) => {
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
                
                const tags = sprites
                    .filter(s => s.projectMeta && s.projectMeta.tags)
                    .map(s => s.projectMeta.tags)
                    .reduce((a, b) => a.concat(b), []);

                // add tags
                tagsCache = tagsCache.concat(tags);
                // leave unique tags only
                tagsCache = Array.from(new Set(tagsCache));
            })();
        });

        app.get('/art', [accessService.authorize(), express.static(path.join(__dirname, 'public/client/'))] as RequestHandler[]);
        app.get('/preview', [accessService.authorize(), express.static(path.join(__dirname, 'public/client/'))] as RequestHandler[]);

        app.use(express.static(path.join(__dirname, 'public/client/')));

        app.get('/*', (req: Request, res: Response) => {
            //res.redirect(urlGoogle());
            res.sendFile(path.join(__dirname, 'public/client/index.html'));
        });

        (async () => {
            // Get sprites list
            spritesList = await fileService.getFilePaths();
            console.log(`got files list: ${spritesList.length} files`);

            await previewService.updatePreviews(spritesList, true);

            const tags = spritesList
                .filter(s => s.projectMeta && s.projectMeta.tags)
                .map(s => s.projectMeta.tags)
                .reduce((a, b) => a.concat(b), []);

            // leave unique tags only
            tagsCache = Array.from(new Set<string>(tags));
            
            app.listen(port, () => {
                console.log(`Listening on port ${port}!`);
            });
        })();
    }
}
