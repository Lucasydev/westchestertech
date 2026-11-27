import {readdir, readFile, writeFile, mkdir, copyFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.dirname(fileURLToPath(import.meta.url));
const publicDir=path.join(root,"public");
const types={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".webp":"image/webp",".svg":"image/svg+xml"};
const files={};
async function addDirectory(dir){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const file=path.join(dir,entry.name);
    if(entry.isDirectory())await addDirectory(file);
    else{
      const name="/"+path.relative(publicDir,file).split(path.sep).join("/");
      files[name]={type:types[path.extname(file)]??"application/octet-stream",body:(await readFile(file)).toString("base64")};
    }
  }
}
await addDirectory(publicDir);
const worker=await readFile(path.join(root,"worker.mjs"),"utf8");
await mkdir(path.join(root,"dist/server"),{recursive:true});
await writeFile(path.join(root,"dist/server/index.js"),"const WEB_FILES="+JSON.stringify(files)+";\n"+worker);
// Include the optional Sites manifest when building from a Sites checkout.
try {
  await readFile(path.join(root, ".openai/hosting.json"));
  await mkdir(path.join(root, "dist/.openai"), {recursive: true});
  await copyFile(path.join(root, ".openai/hosting.json"), path.join(root, "dist/.openai/hosting.json"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
console.log("Built Worker with "+Object.keys(files).length+" embedded assets.");
