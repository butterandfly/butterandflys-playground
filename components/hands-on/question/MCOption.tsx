import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MD from '../MD'

type MCOptionProps = {
  val: string;
  onChangeAnswer: any;
  children?: any;
  status: string;
  attempts: string[];
  currentInput: string;
  correct: string;
}

export default function MCOption({val, onChangeAnswer, children, status, attempts, currentInput, correct}: MCOptionProps) {
  const checked = (currentInput === val)
  let borderClass = '';
  if (attempts.includes(val)) {
    if (val === correct) borderClass = 'correct';
    else borderClass = 'wrong'
  }

  let disable = false;
  if (['success', 'failure'].includes(status)) disable = true;

  return (
    <div className={`root ${borderClass}`}>
      <FormControlLabel
        value={val}
        onChange={() => onChangeAnswer(val)}
        checked={checked}
        control={<Radio color="primary" name="val" />}
        disabled={disable}
        label={
          <MD>{children}</MD>
        }
      />
      <style jsx>{`
        .root {
          display: flex;
          padding: 8px 8px;
        }

        .root :global(p) {
          margin: 0;
        }

        .correct {
          /* border: 2px solid seagreen; */
          border-radius: 4px;
          background-color: #c1e2d6;
        }

        .wrong {
          /* border: 2px solid #f50057; */
          border-radius: 4px;
          background-color: #ecb2b2;
        }

      `}</style>
    </div>
  )
}