import Button from '@material-ui/core/Button'
import { Piece, QuestBuilder } from './qmd';
import { QuestProgressData, QuestComponetPros, QuestData } from './quest'

export default function GotIt({questProgress, onQuestProgressUpdated}: QuestComponetPros) {
  // const userData = useUserDataContext();
  // const prog = userData.findQuestProgress!(partID);

  const disabled = ['success', 'failure'].includes(questProgress.status) ? true : false;

  const onSubmit = () => {
    const newQuestProg: QuestProgressData = {
      ...questProgress,
      status: 'success',
      attemptsLeft: 0,
      attempts: [''],
    };
    onQuestProgressUpdated(newQuestProg);
  }

  return (<div className="root">
    <Button onClick={onSubmit} variant="contained" color="primary" disabled={disabled} disableElevation>Got It!</Button>
    <style jsx>{`
      .root {
        text-align: right;
      }
    `}</style>
  </div>)
}

// export function createGotItData(_: Piece): QuestData {
export function createGotItData(): QuestData {
  return {
    questType: 'GotIt',
    correct: '',
    totalAttempts: 1,
  };
}

export function initGotItProgressData(quest: QuestData): QuestProgressData {
  return {
    questType: 'GotIt',
    currentInput: '',
    status: 'still',
    attemptsLeft: quest.totalAttempts,
    totalAttempts: quest.totalAttempts,
    attempts: [],
  }
}

export const GotItBuilder: QuestBuilder = {
  createQuestData: createGotItData,
  initQuestProgressData: initGotItProgressData,
}