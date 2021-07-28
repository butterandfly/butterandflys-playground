import { GetStaticProps } from "next";
import Play, { getUpdatedPlayProgress, useLocalProgress } from "../../components/hands-on/Play";
import { PartProgressData } from "../../components/hands-on/qmd";
import { BFPlayData, BFPlayProgressData, getAllPlayIDs, getPlay, initBFPlayProgress } from "../../lib/bfplay";

interface BFPlayProps {
  w4f: BFPlayData, 
  initedProgress: BFPlayProgressData, 
}

export default function BFPlay({w4f, initedProgress}: BFPlayProps) {
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

export const getStaticPaths = async () => {
  const w4fIDs = getAllPlayIDs();

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
  const w4f = getPlay(id)
  const progress = await initBFPlayProgress(w4f);

  return {
    props: {w4f, initedProgress: progress }
  };
}