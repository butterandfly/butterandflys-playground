import Submit from '../Submit'
import { QuestComponentPros, QuestData, QuestProgressData, checkAnswer } from '../quest';
import { Piece, QuestBuilder } from '../qmd';
import MCOption from './MCOption'

export interface MCQuestData extends QuestData {
  correct: string;
  options: string[];
  questionContent?: string;
}

export interface MCQuestProgressData extends QuestProgressData {
  currentInput: string;
  attempts: string[];
}

function genLetterByIndex(index: number) {
  return String.fromCharCode(65 + index);
}

export interface MCQuestProps extends QuestComponentPros {
  quest: MCQuestData,
}


export function MCQuest({quest, questProgress, onQuestProgressUpdated}: MCQuestProps) {
  const prog = questProgress;

  const changeCurrentInput = (optionVal: string) => {
    const newQuestProg: QuestProgressData = {
      ...prog,
      currentInput: optionVal,
    };
    onQuestProgressUpdated(newQuestProg);
  }

  const submit = () => {
    const newProg = checkAnswer(quest.correct, prog);
    onQuestProgressUpdated(newProg);
  }


  const genOptions = () => {
    return quest.options.map((mdContent: string, index: number) => {
      const optionVal = genLetterByIndex(index)
      return <MCOption val={optionVal} key={optionVal} correct={quest.correct}
        onChangeAnswer={() => changeCurrentInput(optionVal)} status={prog.status} 
        currentInput={prog.currentInput} attempts={prog.attempts}>
          {mdContent}
      </MCOption>
    });
  }

  return (
    <div>
      {genOptions()}
      <Submit onSubmit={submit} quest={quest} questProgress={prog} ></Submit>
    </div>
  )
}



`
<MCQuestEditor correct="A" totalAttempts="2" >
* Option A
* Option B
</MCQuestEditor>
`;

`
<MCQuestEditor correct="A" totalAttempts="2" >
Which option is correct?
-----
* Option A
* Option B
</MCQuestEditor>
`

export function createMCQuestData(piece: Piece): MCQuestData {
  const optionStrings = piece.innerContent.match(/^\* .*$/gm);
  let options: string[] = [];
  if (optionStrings) {
    options = optionStrings.map((str: string) => {
      return str.substring(2);
    });
  }

  return {
    questType: 'MCQuest',
    correct: piece.props.correct,
    options: options,
    totalAttempts: +piece.props.totalAttempts,
  };
}

export function initMCQuestProgressData(quest: MCQuestData): MCQuestProgressData {
  return {
    questType: quest.questType,
    currentInput: '',
    status: 'still',
    attemptsLeft: quest.totalAttempts,
    totalAttempts: quest.totalAttempts,
    attempts: [],
  }
}

export const MCQuestBuilder: QuestBuilder = {
  createQuestData: createMCQuestData,
  initQuestProgressData: initMCQuestProgressData,
}