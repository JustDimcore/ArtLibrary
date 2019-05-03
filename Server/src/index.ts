import express, { Request, Response } from "express";
import path from "path";
import { FileService } from "./filesService";
import cors from 'cors';
import { SpriteMetaService } from "./spriteMetaService";
import { FilterService } from "./filterService";

// App init
var artPath = 'public/art';
const port = process.env.PORT || 3000;
var app = express();

async function init() {
  // Get files list
  const directoryPath = path.join(__dirname, artPath);
  const projectMetaService = new SpriteMetaService();
  const fileService = new FileService(directoryPath, projectMetaService);
  const filterService = new FilterService();
  const filesList = await fileService.getFilePaths();
  console.log(`got files list: ${filesList.length} files`);

  // Start listening
  app.use(cors());

  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public/client/index.html'));
  });

  app.get('/search', (req: Request, res: Response) => {
    const filtered = req.query ? filterService.filter(filesList, req.query) : filesList;    
    res.send(filtered);
  });

  app.get('/list', (req: Request, res: Response) => {
    res.send(filesList);
  })

  app.use('/art', express.static(path.join(__dirname, 'public/art/')));

  app.use(express.static(path.join(__dirname, 'public/client/')));

  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
}

init().then();