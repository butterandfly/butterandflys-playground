import { GetStaticProps, GetStaticPaths } from 'next'
import { PartProgressData } from '../../components/hands-on/qmd';
import {W4FData, W4FProgressData, getAllW4FIDs, getW4F, initW4FProgress} from '../../lib/w4f'
import Play, { getUpdatedPlayProgress, useLocalProgress } from '../../components/hands-on/Play';

interface W4FProps {
  w4f: W4FData, 
  initedProgress: W4FProgressData, 
}

export default function W4F({w4f, initedProgress}: W4FProps) {
  const [prog, setProgress] = useLocalProgress('w4f', w4f.id, initedProgress);
  const resetProgress = () => {
    setProgress(initedProgress);
  }

  const onPartProgressUpdated = (partProg: PartProgressData) => {
    // Update play progress
    setProgress(getUpdatedPlayProgress(prog, partProg));
  }

  return (<Play play={w4f} progress={prog} title={w4f.title} onPartProgressUpdated={onPartProgressUpdated} onReset={resetProgress} />)
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
