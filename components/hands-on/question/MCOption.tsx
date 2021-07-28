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
    <div className={`gt-radio-option ${borderClass}`}>
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
        .gt-radio-option {
          display: flex;
          padding: 0px 8px;
          margin: 2px 0;
        }

        .gt-radio-option.correct {
          /* border: 2px solid seagreen; */
          border-radius: 4px;
          background-color: #c1e2d6;
        }

        .gt-radio-option.wrong {
          /* border: 2px solid #f50057; */
          border-radius: 4px;
          background-color: #ecb2b2;
        }

      `}</style>
    </div>
  )
}