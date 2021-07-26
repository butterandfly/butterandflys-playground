import Paper from '@material-ui/core/Paper';
import LockIcon from '@material-ui/icons/Lock';
import { animated } from '@react-spring/web'
import {useHeadShake} from './animations'


export default function LockedPart() {
  const [translateX, shake] = useHeadShake();

  return (<div className="root" onClick={() => shake() }><animated.div style={{translateX: translateX}}>
    <Paper className="g-part-paper locked"  elevation={0}>
  <div className="lock"><LockIcon className="g-part-lock-icon" /></div></Paper>
  </animated.div>
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

