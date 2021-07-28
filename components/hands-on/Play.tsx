import Paper from '@material-ui/core/Paper';
import { PartData, PartProgressData, PartProgressesMap, PartsMap } from './qmd';
import Layout from '../Layout'
import LockedPart from './LockedPart'
import Part from './Part'
import { useHeadShake } from './animations';
import { animated, useSpring } from 'react-spring';
import ResetIcon from '@material-ui/icons/SettingsBackupRestore';

import { useEffect, useState } from "react";

export interface PlayData {
  id: string,
  title: string,
  createDate: string,
  parts: PartsMap,
  version: string,
}

export interface PlayProgressData {
  version: string,
  partProgresses: PartProgressesMap,
  playID: string,
  playTitle: string,
}

export function getUpdatedPlayProgress(playProgress: PlayProgressData, partProgress: PartProgressData) {
    // Update current part
    const newPartProgresses = {
      ...playProgress.partProgresses,
    };
    newPartProgresses[partProgress.partID] = partProgress;

    // Update next part
    let nextProg = newPartProgresses[partProgress.partID+1];
    if (nextProg && partProgress.isFinished) {
      nextProg = {
        ...nextProg,
        isLocked: false,
      };
      newPartProgresses[partProgress.partID+1] = nextProg;
    }

    return {
      ...playProgress,
      partProgresses: newPartProgresses,
    }
}

export function useLocalProgress(key: string, id: string, initedProgress: PlayProgressData): [PlayProgressData, (p: PlayProgressData) => void] {
  const [prog, setProgState] = useState<PlayProgressData>(initedProgress);
  const storageName = key + ':' + id;

  const setProgress = (p: PlayProgressData) => {
    localStorage.setItem(storageName, JSON.stringify(p));
    setProgState(p);
  }

  useEffect(() => {
    const progStr  = localStorage.getItem(storageName);
    if (progStr) {
      const progInStore: PlayProgressData = JSON.parse(progStr);
      if (progInStore.version === initedProgress.version) setProgState(progInStore);
      else setProgress(initedProgress);
    }
  }, []);

  return [prog, setProgress];
}

interface PlayProps {
  play: PlayData, 
  progress: PlayProgressData, 
  title: string,
  onPartProgressUpdated: any,
  onReset: () => void,
}

export default function Play({play, progress, title, onReset, onPartProgressUpdated}: PlayProps) {
  const genParts = () => {
    return Object.values(play.parts).map((part) => {
      const partProg = progress.partProgresses[part.id];
      return <PlayPart key={part.id} partProgress={partProg} onPartProgressUpdated={onPartProgressUpdated} part={part} />
    })
  };

  return (
    <div className="root">
    <Layout title={title}>
    <div className="container">
      <div className="title-container">
        <h1 className="section-title">
          {title}
        </h1>
        <ResetIcon onClick={onReset} className="reset" />
      </div>
      <div>
        {genParts()}
      </div>
      </div>
      </Layout>
      <style jsx>{`
        .title-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .root :global(.reset) {
          font-size: 32px;
          color: #616161;
          font-weight: bold;
          margin-right: 16px;
          cursor: pointer;
        }
        .section-title {
          color: steelblue;
          margin-top: 8px;
        }
        .container {
          max-width: 872px;
          padding: 0 16px;
          flex-grow: 1;
        }
    `}</style>
    </div>
  )
}

interface PlayPartProps {
  part: PartData, 
  partProgress: PartProgressData,
  onPartProgressUpdated: (partProgress: PartProgressData) => void,
}

function PlayPart({part, partProgress, onPartProgressUpdated}: PlayPartProps) {
  const partStyle = useSpring({
    to: {
      opacity: partProgress.isLocked ?0:1,
    },
    from: {
      opacity: 0,
    },
    config: { duration: 500 },
  })

  if (partProgress.isLocked) {
    return <LockedPart />;
  }

  return (<div className="root">
    <animated.div style={partStyle}>
    {part.type === 'GotIt'
      ? <Part part={part} partProgress={partProgress} onPartProgressUpdated={onPartProgressUpdated} /> 
      : <QuestionPart part={part} partProgress={partProgress} onPartProgressUpdated={onPartProgressUpdated} /> 
    }
    </animated.div>
    <style jsx>{`
      .root {
        margin: 16px 0;
      }
    `}</style>
  </div>);
}

interface QuestionPartProps {
  part: PartData, 
  partProgress: PartProgressData,
  onPartProgressUpdated: (partProgress: PartProgressData) => void,
}

function QuestionPart({part, partProgress, onPartProgressUpdated}: QuestionPartProps) {
  const [translateX, shake] = useHeadShake();
  const onUpdated = (newProg: PartProgressData) => {
    const newQuestProg = newProg.questProgress!;
    if (newQuestProg.status !== 'success' && newQuestProg.attempts.length > partProgress.questProgress!.attempts.length) {
      shake();
    }
    onPartProgressUpdated(newProg);
  }

  return (
    <div className="root">
      <animated.div style={{translateX: translateX}}>
      <Paper className="g-part-paper" elevation={2}>
        <h3 className="title">Question</h3>
        <Part part={part} partProgress={partProgress} onPartProgressUpdated={onUpdated} />
      </Paper>
    </animated.div>
    <style jsx>{`
        .root :global(.g-part-paper) {
          padding: 8px 16px;
          margin: 24px 0;
        }
        .title {
          color: steelblue;
        }
      `}</style>
    </div>
  )
}