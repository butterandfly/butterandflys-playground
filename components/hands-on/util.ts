import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getAllMDXIDs(dir: string) {
  const fileNames = fs.readdirSync(dir);
  const ids = fileNames.map((name) => name.replace(/.mdx$/, ''));
  return ids;
}

export function getAllMatterResult(dir: string) {
  const fileNames = fs.readdirSync(dir)
  const matterResultMap: {[key: string]: matter.GrayMatterFile<string>} = {};

  fileNames.forEach((fileName) => {
    const id = fileName.replace(/.mdx$/, '')
    const filePath = path.join(dir, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8')
  
    const matterResult = matter(fileContents);
    matterResultMap[id] = matterResult;
  });
  return matterResultMap;
}

export function getMatterResult(filePath: string) {
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return matter(fileContents);
}