import {PartData, PartProgressesMap, PartsMap} from '../components/hands-on/qmd'
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { compileQMD, initPartProgressData } from '../components/hands-on/qmd';
import { PlayData, PlayProgressData } from '../components/hands-on/Play';

export interface W4FData extends PlayData {
}

export interface W4FProgressData extends PlayProgressData {
}

export interface W4FMetaData {
  id: string,
  title: string,
  createDate: string,
  version: string,
}


const w4fDirectory = path.join(process.cwd(), 'w4fs');

export function getAllW4FMetas() {
  const fileNames = fs.readdirSync(w4fDirectory)
  const w4fIDs = fileNames.map((fileName) => fileName.replace(/.mdx$/, ''));

  const w4fMetas = w4fIDs.map((w4fID) => {
    const dataPath = path.join(w4fDirectory, w4fID + '.mdx');
    const fileContents = fs.readFileSync(dataPath, 'utf8')
  
    const matterResult = matter(fileContents);
    const data = matterResult.data;
    return {
      id: w4fID,
      title: data.title,
      version: data.version,
      createDate: data.createDate.toString(),
    } as W4FMetaData;
  });
  return w4fMetas;
}

export function getAllW4FIDs() {
  const fileNames = fs.readdirSync(w4fDirectory);
  const ids = fileNames.map((name) => name.replace(/.mdx$/, ''));
  return ids;
}


export function getW4F(w4fID: string): W4FData {
  const fullPath = path.join(w4fDirectory, `${w4fID}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents);
  const data = matterResult.data;

  const w4f: W4FData = {
    id: w4fID,
    title: data.title,
    version: data.version,
    createDate: data.createDate.toString(),
    parts: compileQMD(matterResult.content),
  };
  return w4f; 
}

export async function initW4FProgress(w4f: W4FData) {
  const partProgresses: PartProgressesMap = {};
  Object.values(w4f.parts).forEach((part: PartData) => {
    partProgresses[part.id]= initPartProgressData(part);
  })

  const w4fProg: W4FProgressData = {
    playID: w4f.id,
    playTitle: w4f.title,
    version: w4f.version,
    partProgresses: partProgresses,
  };

  return w4fProg;
}