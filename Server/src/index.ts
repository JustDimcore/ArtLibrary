import express, { Request, Response } from "express";
import path from "path";
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from "express-fileupload";

import { FileService } from "./filesService";
import { SpriteMetaService } from "./spriteMetaService";
import { FilterService } from "./filterService";
import { PreviewService } from "./previewService";
import { NextFunction } from "connect";
import { SpriteInfo } from "./spriteInfo";
import { GoogleSevice } from "./google-util";
import { AccessService, Permission } from "./accessService";


// App init
const artPath = process.env.ART_PATH || 'public/art';
const previewPath = process.env.PREVIEW_PATH || 'public/preview';
const port = process.env.PORT || 3000;
const app = express();
const fullArtPath = path.join(__dirname, artPath);
const fullPreviewPath = path.join(__dirname, previewPath);
const projectMetaService = new SpriteMetaService();
const fileService = new FileService(fullArtPath, projectMetaService);
const filterService = new FilterService();
const previewService = new PreviewService(fullArtPath, fullPreviewPath);

const enableGoogleAuth = process.env.ENABLE_GOOGLE_AUTH || true;
const googleService = enableGoogleAuth ? new GoogleSevice() : null;

const accessService = new AccessService();

let spritesList: SpriteInfo[];

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());

app.get('/config', (req: Request, res: Response) => {
  res.send({
    enableGoogleAuth,
    googleAuthUrl: enableGoogleAuth ? googleService.getGoogleUrl() : ''
  });
});

app.post('/google-auth', (req: Request, res: Response) => {

  console.log(req.body);
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

      res.status(hasPermissions ? 200 : 403).send(hasPermissions ? account : { error: 'access denied' });
    });
});

app.get('/search', (req: Request, res: Response) => {
  const filtered = req.query ? filterService.filter(spritesList, req.query) : spritesList;    
  res.send(filtered);
});

app.get('/list', (req: Request, res: Response) => {
  res.send(spritesList);
});

app.use('/art', express.static(path.join(__dirname, 'public/art/')));
app.use('/preview', express.static(path.join(__dirname, 'public/preview/')));

app.post('/upload', (req: Request, res: Response) => {
  if(!req.files || !req.files['fileKey'])
  {
    console.log(req);
    res.status(503).send({error: 'No file'});
    return;
  }
  console.log(req.files);
  const fileKey = req.files['fileKey'];
  const files = (Array.isArray(fileKey) ? fileKey : [fileKey]) as any[];

  const filesPromises: Promise<SpriteInfo>[] = [];
  for(let i = 0; i < files.length; i++) {
    const file = files[i];
    filesPromises.push(fileService.saveSprite(file));
  }
  (async () => {
    const res = await Promise.all(filesPromises);
    previewService.updatePreviews(res, true);
  })();
});

app.use(express.static(path.join(__dirname, 'public/client/')));

app.get('/*', (req: Request, res: Response) => {
  //res.redirect(urlGoogle());
  res.sendFile(path.join(__dirname, 'public/client/index.html'));
});

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


(async function() {
  // Get sprites list
  spritesList = await fileService.getFilePaths();
  console.log(`got files list: ${spritesList.length} files`);

  previewService.updatePreviews(spritesList, true);
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
})();

function logErrors(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  res.status(500);
  res.render('error', { error: err });
}
