import dynamic from 'next/dynamic';
import { Piece, QuestBuilder } from '../qmd';
import { OptionData, RQuestData, RQuestProgressData } from './RQuest';

const RQuest = dynamic(() => import('./RQuest'), {
  ssr: false,
});

export default RQuest;

export function createRQuestData(piece: Piece): RQuestData {
  const optionStrings = piece.innerContent.split('-----\n');
  let options: OptionData[] = [];
  if (optionStrings) {
    options = optionStrings.map((str: string, index: number) => {
      return {
        id: 'rqo-' + 'index' + (index+1),
        content: str,
        initedPos: index + 1,
      }
    });
  }

  return {
    questType: 'RQuest',
    correct: piece.props.correct,
    options: options,
    totalAttempts: +piece.props.totalAttempts,
  };
}

export function initRQuestProgressData(quest: RQuestData): RQuestProgressData {
  const positions = quest.options.map((option) => option.initedPos);
  return {
    questType: quest.questType,
    currentInput: positions.join(','),
    status: 'still',
    attemptsLeft: quest.totalAttempts,
    totalAttempts: quest.totalAttempts,
    attempts: [],
  }
}

export const RQuestBuilder: QuestBuilder = {
  createQuestData: createRQuestData,
  initQuestProgressData: initRQuestProgressData,
}