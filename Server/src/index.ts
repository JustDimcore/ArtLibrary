import express from "express";
import path from "path";
import { FileService } from "./filesService";

// App init
var app = express();

// Get files list
const directoryPath = path.join(__dirname, 'art');
const fileService = new FileService(directoryPath);
fileService.getFilePaths().forEach(file => console.log(file));

// Start listening
app.get('/', (req: any, res: any) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});