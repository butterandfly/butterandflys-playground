import GotIt, { createGotItData, initGotItProgressData } from './GotIt';
import {Axiom, Definition, Theorem} from './MathBox';
import BFQuest from './question/BFQuest';
import {MCQuest} from './question/MCQuest';
import Solution from './Solution';
import {MCQuestBuilder} from './question/MCQuest'
import { BFQuestBuilder } from './question/BFQuest';
import { Idea } from './InfoBox';

import { QuestData, QuestProgressData } from "./quest"
import FlashcardList from './card/FlashcardList';
import MCQuestList, { MCQuestListBuilder } from './question/MCQuestList';

export type PartType = 'GotIt' | 'Quest';

export type PartData = {
  id: number,
  quest: QuestData,
  type: PartType,
  content?: string,
  pieces: Piece[],
}

export type PartsMap = {
  [key: number]: PartData
}

export type PartProgressData = {
  partID: number,
  isLocked: boolean,
  isFinished: boolean,
  questProgress?: QuestProgressData,
}

export interface PartProgressesMap {
  [key: number]: PartProgressData
}

export type PieceType = 'md' | 'component'

export interface Piece {
  type: PieceType,
  content: string,
  componentName: string,
  innerContent: string,
  props: {[key: string]: string},
}

export interface QuestBuilder {
  createQuestData: (piece: Piece) => QuestData,
  initQuestProgressData: (node: any) => QuestProgressData,
}


export const mdxComponents: {[key: string]: any} = {
  MCQuest: MCQuest,
  BFQuest: BFQuest,
  Solution: Solution,
  GotIt: GotIt,
  Definition: Definition,
  Theorem: Theorem,
  Axiom: Axiom,
  Idea: Idea,
  FlashcardList: FlashcardList,
  MCQuestList: MCQuestList,
}

export const questComponents = [
  'MCQuest',
  'BFQuest',
  'MCQuestList',
];

export const innerContentTakers = [
  'Solution',
  'Definition',
  'Theorem',
  'Axiom',
  'Idea',
  'FlashcardList',
]


export const buildersMap: {[key: string]: QuestBuilder} = {
  'MCQuest': MCQuestBuilder,
  'BFQuest': BFQuestBuilder,
  'MCQuestList': MCQuestListBuilder,
}

const partContainers = ['GotIt', 'Quest'];
const partContainerREStr = `^\[\[(${partContainers.join('|')})$[\\s\\S]*?^(${partContainers.join('|')})\]\]$`;
const partContainerRE = new RegExp(partContainerREStr, 'gm');

export function compileQMD(content: string) {
  // Get parts
  const partContents = content.match(partContainerRE);
  const parts: PartsMap = {};
  if (!partContents) {
    return parts;
  }

  for (let i = 0; i < partContents.length; i++) {
    const partID = i + 1;
    const partData = createPartData(partID, partContents[i]);
    parts[partID] = partData;
  }
  return parts;
}

function createPartData(partID: number, outerContent: string): PartData {
  // Tell the type
  let type: PartType = 'GotIt';
  if (outerContent.trim().startsWith(`[[Quest`)) {
    type = 'Quest';
  }

  // Get inner content
  let content = outerContent.replace(/^\[\[(GotIt|Quest)$/gm, '');
  content = content.replace(/^(GotIt|Quest)\]\]$/gm, '');
  
  // Gen pieces data
  const pieces = getPieces(content, Object.keys(mdxComponents));

  let quest: QuestData;
  // GotIt part
  if (type === 'GotIt') {
    quest = createGotItData();
  } else if (type === 'Quest') {
    const questPiece = pieces.find((piece) => {
      return questComponents.includes(piece.componentName);
    })
    if (!questPiece) throw new Error('There is no quest in part:\n' + content);
    quest = buildersMap[questPiece.componentName].createQuestData(questPiece);
  } else {
    throw new Error('Unknown part type: ' + type);
  }

  return {
    id: partID,
    type,
    content,
    pieces,
    quest,
  };
}

export function getPieces(partContent: string, validComps: string[]): Piece[] {
  const compsStr = validComps.join('|');
  const noWrapCompRE = `(^<(${compsStr})( |([^>]*))\\/>)`
  const wrapCompRE = `(^((<(${compsStr}))( |([^\\/>]*))>([^])*?<\\/(${compsStr})>))`
  const regex = new RegExp(noWrapCompRE + '|' + wrapCompRE, 'gms');

  // Split to pieces
  const reactComps = partContent.match(regex);
  if (!reactComps) {
    return [createMDPiece(partContent)];
  }

  // Set place-holder, record the component
  const temp = partContent.replace(regex, '${placeholder}$')
  const mds = temp.split('${placeholder}$');

  // Rebuild the pieces array
  const pieceArray: Piece[] = [];
  for (let i = 0; i < reactComps.length; i++) {
    const mdContent = mds[i].trim();
    if (mdContent) {
      pieceArray.push(createMDPiece(mdContent));
    }

    const compContent = reactComps[i];
    pieceArray.push({
      type: 'component',
      content: compContent,
      componentName: getComponentName(compContent),
      props: getProps(compContent),
      innerContent: getInnerContent(compContent),
    });
  }
  const mdContent = mds[reactComps.length].trim();
  if (mdContent) {
    pieceArray.push(createMDPiece(mdContent));
  }

  return pieceArray;
}

// Create a markdown piece data.
function createMDPiece(content: string): Piece {
  return {
    type: 'md',
    content: content,
    componentName: 'MD',
    innerContent: content,
    props: {},
  }
}

export function getComponentName(compContent: string) {
  const matches = compContent.match(/^<\w+/) || [];
  if (matches.length < 1) return '';

  return matches[0].substring(1);
}

function getProps(compContent: string) {
  const tagContent = (compContent.match(/<([^>]*)>/))![0];

  const pairs: {[key: string]: string} = {};
  (tagContent.match(/[a-zA-Z0-9]+=\"([^"]*)\"/gm) || []).forEach((pair: string) => {
    const data = pair.split('='); 
    pairs[data[0]] = data[1].replace(/"/g, '');
  });

  return pairs;
}

function getInnerContent(compContent: string) {
  const compName = getComponentName(compContent);
  const tag1 = new RegExp(`^<${compName}[^>]*>`, 'gm');
  const tag2 = new RegExp(`^<\\/${compName}>`, 'gm');
  return compContent.replace(tag1, '').replace(tag2, '');
}

export function initPartProgressData(partData: PartData) {
  const progress: PartProgressData  =  {
    partID: partData.id,
    isFinished: false,
    isLocked: (partData.id !== 1)
  }

  if (partData.type === 'GotIt') {
    progress.questProgress = initGotItProgressData(partData.quest);
  } else {
    const type = partData.quest.questType;
    const initFunc = buildersMap[type].initQuestProgressData;
    progress.questProgress = initFunc(partData.quest);
  }

  return progress;
}