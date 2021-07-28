import {PartData, PartProgressData, Piece} from './qmd';
import {innerContentTakers, mdxComponents} from './qmd'
import { isQuestFinished, QuestData, QuestProgressData } from './quest';
import GotIt from './GotIt'
import MD from './MD';


export interface PiecesRendererProps {
  // partID: string,
  quest: QuestData,
  questProgress: QuestProgressData,
  pieces: Piece[],
  onQuestProgressUpdated: (questProgress: QuestProgressData) => void,
}

export function PiecesRenderer({quest, questProgress, pieces, onQuestProgressUpdated}: PiecesRendererProps) {
  const genContent = () => {
    return pieces.map((piece, index) => {
      if (piece.type === 'md') {
        return <MD key={index}>{piece.innerContent}</MD>
      }

      if (piece.type === 'component') {
        const name = piece.componentName;
        const Comp = mdxComponents[piece.componentName];
        if (innerContentTakers.includes(name)) {
          return <Comp key={index} quest={quest} questProgress={questProgress} {...piece.props}>{piece.innerContent}</Comp>
        }

        return <Comp key={index} quest={quest} questProgress={questProgress} onQuestProgressUpdated={onQuestProgressUpdated} />
      }

      return <div key={index} className="unknown"></div>
    })
  }

  return <div>{genContent()}</div>
}

export interface PartProps {
  part: PartData,
  partProgress: PartProgressData,
  onPartProgressUpdated: (partProgress: PartProgressData) => void,
}

export default function Part({part, partProgress, onPartProgressUpdated}: PartProps) {
  const onQuestProgressUpdated = (questProgress: QuestProgressData) => {
    const newProg: PartProgressData = {
      ...partProgress,
      questProgress,
      isFinished: isQuestFinished(questProgress.status),
    }
    onPartProgressUpdated(newProg);
  }

  const gotIt = (<div>
    <PiecesRenderer onQuestProgressUpdated={onQuestProgressUpdated} quest={part.quest} questProgress={partProgress.questProgress!} pieces={part.pieces}></PiecesRenderer>
    <GotIt quest={part.quest} questProgress={partProgress.questProgress!} onQuestProgressUpdated={onQuestProgressUpdated} />
  </div>)

  return (
    <div className="wrapper">
      {part.type === 'GotIt' 
        ? gotIt
        : <PiecesRenderer onQuestProgressUpdated={onQuestProgressUpdated} quest={part.quest} questProgress={partProgress.questProgress!} pieces={part.pieces}></PiecesRenderer>
      }
    </div>
  )
}