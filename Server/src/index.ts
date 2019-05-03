import express, { Request, Response } from "express";
import path from "path";
import { FileService } from "./filesService";
import cors from 'cors';

// App init
var artPath = 'public/art';
const port = process.env.PORT || 3000;
var app = express();

async function init() {
  // Get files list
  const directoryPath = path.join(__dirname, artPath);
  const fileService = new FileService(directoryPath);
  const filesList = await fileService.getFilePaths();
  console.log(`got files list: ${filesList.length} files`);

  // Start listening
  app.use(cors());

  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public/client/index.html'));
  });

  app.get('/search', (req: Request, res: Response) => {
    var query = req.query['query'];
    var searchParams = !query ? null : query.split(',')
      .map((q: string) => q.trim().toLowerCase())
      .filter((q: string) => q);
    var result = searchParams ? filesList.filter(sprite => searchParams.some((q: string) => sprite.name.toLowerCase().includes(q))) : filesList;
    res.send(result);
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