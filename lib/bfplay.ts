import path from 'path';
import { PlayData, PlayProgressData } from '../components/hands-on/Play';
import { compileQMD, initPartProgressData, PartData, PartProgressesMap } from '../components/hands-on/qmd';
import { getAllMatterResult, getAllMDXIDs, getMatterResult } from '../components/hands-on/util';

export interface BFPlayData extends PlayData {
}

export interface BFPlayProgressData extends PlayProgressData {
}

export interface BFPlayMetaData {
  id: string,
  title: string,
  createDate: string,
  version: string,
  desc: string,
}

const playDirectory = path.join(process.cwd(), 'plays');

export function getAllPlayIDs() {
  return getAllMDXIDs(playDirectory);
}

export function getPlay(playID: string) {
  const fullPath = path.join(playDirectory, `${playID}.mdx`)

  const matterResult = getMatterResult(fullPath);
  const data = matterResult.data;

  const play: PlayData = {
    id: playID,
    title: data.title,
    version: data.version,
    createDate: data.createDate.toString(),
    parts: compileQMD(matterResult.content),
  };
  return play; 
}

export async function initBFPlayProgress(play: BFPlayData) {
  const partProgresses: PartProgressesMap = {};
  Object.values(play.parts).forEach((part: PartData) => {
    partProgresses[part.id]= initPartProgressData(part);
  })

  const prog: BFPlayProgressData = {
    playID: play.id,
    playTitle: play.title,
    version: play.version,
    partProgresses: partProgresses,
  };

  return prog;
}

export function getAllBFPlayMetas() {
  const map = getAllMatterResult(playDirectory)
  const blogMetas = Object.keys(map).map((id) => {
    const data = map[id].data;
    return {
      id,
      title: data.title,
      version: data.version,
      createDate: data.createDate.toString(),
      desc: data.desc,
    } as BFPlayMetaData;
  });
  return blogMetas;
}
