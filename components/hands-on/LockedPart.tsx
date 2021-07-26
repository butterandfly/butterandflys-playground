import Paper from '@material-ui/core/Paper';
import LockIcon from '@material-ui/icons/Lock';

export default function LockedPart() {
  return (<div className="root"><Paper className="g-part-paper locked"  elevation={0}>
  <div className="lock"><LockIcon className="g-part-lock-icon" /></div></Paper>
  <style jsx>{`
    .lock {
      text-align: center;
    }

    .root :global(.g-part-paper) {
      padding: 24px;
      margin-bottom: 16px;
    }
    .root :global(.locked) {
      background-color: darkgray;
    }
    .root :global(.g-part-lock-icon) {
      font-size: 32px;
      color: white;
    }
  `}</style>
 </div>)
}