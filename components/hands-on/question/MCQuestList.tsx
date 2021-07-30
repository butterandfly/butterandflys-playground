import { checkAnswer, QuestComponentPros, QuestData, QuestProgressData } from "../quest";
import MD from '../MD'
import MCOption from './MCOption'
import Submit from '../Submit'
import { Piece, QuestBuilder } from "../qmd";

`
<MCQuestList correct="A" totalAttempts="2" >
Which option is correct?
-----
* Option A
* Option B

~~~~~

Which option is **NOT** correct?
-----
* Option 1
* Option 2

</MCQuestList>
`

export interface MCQuestListData extends QuestData {
  questItems: MCQuestItemData[]
  correct: string
}

export interface MCQuestListProgressData extends QuestProgressData {
  attempts: string[]
  currentInput: string // A;B;C
}

export interface MCQuestListProps extends QuestComponentPros {
  quest: MCQuestListData ,
  questProgress: MCQuestListProgressData,
}

export default function MCQuestList({quest, questProgress, onQuestProgressUpdated}: MCQuestListProps) {
  const genQuestList = () => {
    const inputList = questProgress.currentInput.split(';');

    return quest.questItems.map((item, index) => {
      const attempts = questProgress.attempts.map((a) => {
        return a.split(';')[index]
      });

      const itemProgress = {
        currentInput: inputList[index],
        attempts,
        status: questProgress.status,
      }

      const onQuestItemProgressUpdated = (newItemProgress: MCQuestItemProgressData) => {
        const newCurrentInputs = questProgress.currentInput.split(';');
        newCurrentInputs[index] = newItemProgress.currentInput;
        const newCurrentInput = newCurrentInputs.join(';');
        onQuestProgressUpdated({
          ...questProgress,
          currentInput: newCurrentInput,
        });
      };
      return <MCQuestItem key={index} questItem={item} questItemProgress={itemProgress} onQuestItemProgressUpdated={onQuestItemProgressUpdated} />
    });
  }

  const submit = () => {
    const newProg = checkAnswer(quest.correct, questProgress);
    onQuestProgressUpdated(newProg);
  }

  return (
    <div>
      {genQuestList()}
      <Submit onSubmit={submit} quest={quest} questProgress={questProgress} ></Submit>
    </div>
  )
}

interface MCQuestItemData {
  questionContent: string,
  options: string[],
  correct: string,
}

interface MCQuestItemProgressData {
  currentInput: string
  attempts: string[] // A;A;A
  status: string
}

interface MCQuestItemProps{
  questItem: MCQuestItemData,
  questItemProgress: MCQuestItemProgressData,
  onQuestItemProgressUpdated: (questItemProgress: MCQuestItemProgressData) => void,
}

function MCQuestItem({questItem, questItemProgress, onQuestItemProgressUpdated}: MCQuestItemProps) {
  const prog = questItemProgress;

  const changeCurrentInput = (optionVal: string) => {
    const newItemProg: MCQuestItemProgressData = {
      ...questItemProgress,
      currentInput: optionVal,
    };
    onQuestItemProgressUpdated(newItemProg);
  }

  const genOptions = () => {
    return questItem.options.map((mdContent: string, index: number) => {
      const optionVal = genLetterByIndex(index)
      return <MCOption val={optionVal} key={optionVal} correct={questItem.correct}
        onChangeAnswer={() => changeCurrentInput(optionVal)} status={prog.status} 
        currentInput={prog.currentInput} attempts={prog.attempts}>
          {mdContent}
      </MCOption>
    });
  }

  return (
    <div>
      <MD>{questItem.questionContent}</MD>
      <div className="options">
        {genOptions()}
      </div>
      <style jsx>{`
      .options {
        margin-bottom: 16px;
      }
      `}</style>
    </div>
  )
}

export function createMCQuestListData(piece: Piece): MCQuestListData {
  const correctList = piece.props.correct.split(';');
  const itemContents = piece.innerContent.split('\n~~~~~');
  const items = itemContents.map((itemContent, index) => {
    const questAndOptions = itemContent.split('\n-----');
    const optionStr = questAndOptions[1];
    const optionStrings = optionStr.match(/^\* .*$/gm);
    let options: string[] = [];
    if (optionStrings) {
      options = optionStrings.map((str: string) => {
        return str.substring(2);
      });
    }

    return {
      questionContent: questAndOptions[0],
      options: options,
      correct: correctList[index],
    }
  });


  return {
    questType: 'MCQuestList',
    correct: piece.props.correct,
    questItems: items,
    totalAttempts: +piece.props.totalAttempts,
  };
}

export function initMCQuestListProgressData(quest: MCQuestListData): MCQuestListProgressData {
  return {
    questType: quest.questType,
    currentInput: '',
    status: 'still',
    attemptsLeft: quest.totalAttempts,
    totalAttempts: quest.totalAttempts,
    attempts: [],
  }
}

export const MCQuestListBuilder: QuestBuilder = {
  createQuestData: createMCQuestListData,
  initQuestProgressData: initMCQuestListProgressData,
}

function genLetterByIndex(index: number) {
  return String.fromCharCode(65 + index);
}