import { GetStaticProps, GetStaticPaths } from 'next'
import Paper from '@material-ui/core/Paper';
import { PartData, PartProgressData } from '../../components/hands-on/qmd';
import { useState } from 'react';
import {W4FData, W4FProgressData, getAllW4FIDs, getW4F, initW4FProgress} from '../../lib/w4f'
import BlogLayout from '../../components/BlogLayout'
import LockedPart from '../../components/hands-on/LockedPart'
import Part from '../../components/hands-on/Part'

interface W4FProps {
  w4f: W4FData, 
  initedProgress: W4FProgressData, 
}

export default function W4F({w4f, initedProgress}: W4FProps) {
  const [prog, setProg] = useState<W4FProgressData>(initedProgress);

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
    setProg({
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
    <BlogLayout title={w4f.title}>
    <div className="container">
      <h1 className="section-title">
        {w4f.title}
      </h1>
      <div>
        {genParts()}
      </div>
      <style jsx>{`
        .section-title {
          color: darkorange;
          margin-top: 8px;
        }
        .container {
          max-width: 960px;
        }
    `}</style>
    </div>
    </BlogLayout>
    </div>
  )
}

interface W4FPartProps {
  part: PartData, 
  partProgress: PartProgressData,
  onPartProgressUpdated: (partProgress: PartProgressData) => void,
}

function W4FPart({part, partProgress, onPartProgressUpdated}: W4FPartProps) {
  if (partProgress.isLocked) {
    return <LockedPart />
  }

  const questPart = (
    <div className="root">
      <Paper className="g-part-paper" elevation={2}>
        <h3 className="title">Question</h3>
        <Part part={part} partProgress={partProgress} onPartProgressUpdated={onPartProgressUpdated} />
      </Paper>
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

  return (<div className="root">
    {part.type === 'GotIt'
      ? <Part part={part} partProgress={partProgress} onPartProgressUpdated={onPartProgressUpdated} /> 
      : questPart
    }
    <style jsx>{`
      .root {
        margin: 16px 0;
      }
    `}</style>
  </div>);
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
