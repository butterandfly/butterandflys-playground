import Button from '@material-ui/core/Button';
import { AnimationEventHandler } from 'react';
import { animated, useSpring } from 'react-spring';
import { QuestData, QuestProgressData } from './quest';

type SubmitPros = {
  onSubmit: () => void,
  quest: QuestData,
  questProgress: QuestProgressData,
  compareFunc?: ((a: any, b: any) => boolean),
}

export default function Submit({onSubmit, quest, questProgress, compareFunc}: SubmitPros) {
  if (!compareFunc) compareFunc = ((a, b) => (a === b));
  const {attemptsLeft, currentInput, status} = questProgress;
  const isCorrect = (status === 'success');
  let disable = false;
  if (attemptsLeft === 0 || isCorrect) {
    disable = true;
  }

  // Disable when inputs are not enough.
  const answerLen = quest.correct.split(';').length;
  if (!currentInput) disable = true;
  else {
    const currentInputLen = currentInput.split(';').length;
    if (currentInputLen !== answerLen) disable = true;
  }

  return (
    <div className="root">
      <Button className="hack" variant="contained" color="primary" disabled={disable}
        onClick={()=> onSubmit()}>Submit</Button>
      <AttemptsLeft attemptsLeft={attemptsLeft} />
      <Status status={questProgress.status} />
      {/* use .hack class to solve the color problem */}
      <style jsx>{`
        .root :global(.hack) {
          transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        }
        .root {
          margin: 8px 0;
          display: flex;
          flex-flow: row-reverse;
          align-items: center;
        }

        .submit-attempts {
          font-weight: bold;
          padding: 0 16px;
          font-size: small;
          color: gray;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

function Status({status}: any) {
  const springStyle = useSpring({
    to: { opacity: (status === 'still')?0:1 },
    from: { opacity: 0 },
  })


  let statusEmoji = '';
  if (status === 'success') statusEmoji = '🎉';
  if (status === 'failure') statusEmoji = '❌';

  return <animated.div style={springStyle}><span>{statusEmoji}</span></animated.div>
}

function AttemptsLeft({attemptsLeft}: any) {
  return (
    <div className="root">
      {attemptsLeft} attempt<span className="s">s</span>
      <style jsx>{`
        .root {
          font-weight: bold;
          padding: 0 16px;
          font-size: small;
          color: gray;
          font-style: italic;
        }
        .s {
          opacity: ${(attemptsLeft > 1) ? 1 : 0};
        }
      `}</style>
    </div>) 
}