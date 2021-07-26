import { GetStaticProps, GetStaticPaths } from 'next'
import Paper from '@material-ui/core/Paper';
import { PartData, PartProgressData } from '../../components/hands-on/qmd';
import { useEffect, useState } from 'react';
import {W4FData, W4FProgressData, getAllW4FIDs, getW4F, initW4FProgress} from '../../lib/w4f'
import Layout from '../../components/Layout'
import LockedPart from '../../components/hands-on/LockedPart'
import Part from '../../components/hands-on/Part'
import { useHeadShake } from '../../components/hands-on/animations';
import { animated, useSpring } from 'react-spring';
import ResetIcon from '@material-ui/icons/SettingsBackupRestore';

interface W4FProps {
  w4f: W4FData, 
  initedProgress: W4FProgressData, 
}

export default function W4F({w4f, initedProgress}: W4FProps) {
  const [prog, setProg] = useState<W4FProgressData>(initedProgress);
  const storageName = 'w4f:' + w4f.id;
  const setProgress = (p: W4FProgressData) => {
    localStorage.setItem(storageName, JSON.stringify(p));
    setProg(p);
  }
  const resetProgress = () => {
    setProgress(initedProgress);
  }

  useEffect(() => {
    const progStr  = localStorage.getItem(storageName);
    if (progStr) setProg(JSON.parse(progStr));
  }, []);

  const onPartProgressUpdated = (partProg: PartProgressData) => {
    // Update current part
    const newPartProgresses = {
      ...prog.partProgresses,
    };
    newPartProgresses[partProg.partID] = partProg;

    // Update next part
    let nextProg = newPartProgresses[partProg.partID+1];
    if (nextProg && partProg.isFinished) {
      nextProg = {
        ...nextProg,
        isLocked: false,
      };
      newPartProgresses[partProg.partID+1] = nextProg;
    }

    // Update w4f progress
    setProgress({
      ...prog,
      partProgresses: newPartProgresses,
    })
  }

  const genParts = () => {
    return Object.values(w4f.parts).map((part) => {
      const partProg = prog.partProgresses[part.id];
      return <W4FPart key={part.id} partProgress={partProg} onPartProgressUpdated={onPartProgressUpdated} part={part} />
    })
  };

  return (
    <div className="root">
    <Layout title={w4f.title}>
    <div className="container">
      <div className="title-container">
        <h1 className="section-title">
          {w4f.title}
        </h1>
        <ResetIcon onClick={resetProgress} className="reset" />
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
          max-width: 960px;
        }
    `}</style>
    </div>
  )
}

interface W4FPartProps {
  part: PartData, 
  partProgress: PartProgressData,
  onPartProgressUpdated: (partProgress: PartProgressData) => void,
}

function W4FPart({part, partProgress, onPartProgressUpdated}: W4FPartProps) {
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


// Get all w4fs.
export const getStaticPaths: GetStaticPaths = async () => {
  const w4fIDs = getAllW4FIDs();

  const paths = w4fIDs.map((id: string) => {
    return {params: {id: id}}
  });

  return {
    paths: paths,
    fallback: false
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params!.id as string;
  const w4f = getW4F(id)
  const progress = await initW4FProgress(w4f);

  return {
    props: {w4f, initedProgress: progress }
  };
}
