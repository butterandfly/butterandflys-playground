import React from "react";
import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { checkAnswer, isQuestFinished, QuestData, QuestProgressData } from "../quest";
import MD from '../MD'
import Submit from '../Submit'

export interface OptionData {
  id: string;
  content: string;
  initedPos: number;
}

export interface RQuestData extends QuestData {
  options: OptionData[],
  correct: string,
}

export interface RQuestProgressData extends QuestProgressData {
  currentInput: string,
  attempts: string[],
}

interface RQuestProps {
  quest: RQuestData
  questProgress: RQuestProgressData
  onQuestProgressUpdated: (progress: QuestProgressData) => void
}

export default function RQuest({quest, questProgress, onQuestProgressUpdated}: RQuestProps) {
  const [options, setOptions] = useState<OptionData[]>(quest.options);
  const isFinished = isQuestFinished(questProgress.status);

  const onOptionsUpdated = (newOptions: OptionData[]) => {
    setOptions(newOptions);
    const positions = newOptions.map((option) => option.initedPos);
    onQuestProgressUpdated({
      ...questProgress,
      currentInput: positions.join(',')
    })
  }

  const onSubmit = () => {
    const newProg = checkAnswer(quest.correct, questProgress);
    onQuestProgressUpdated(newProg);
  }

  return (<div>
    <OptionList options={options} onOptionsUpdated={onOptionsUpdated} isDragDisabled={isFinished}></OptionList>
    <Submit onSubmit={onSubmit} quest={quest} questProgress={questProgress} ></Submit>
  </div>)
}

const reorder = (
  list: OptionData[],
  startIndex: number,
  endIndex: number
): OptionData[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// const getItemStyle = (
//   isDragging: boolean,
//   draggableStyle: DraggingStyle | NotDraggingStyle | undefined
// ): React.CSSProperties => ({
//   // styles we need to apply on draggables
//   ...draggableStyle
// });


const OptionList = ({options, onOptionsUpdated, isDragDisabled}: 
  {options: OptionData[], onOptionsUpdated: (ops: OptionData[]) => void, isDragDisabled: boolean}) => {

  const onDragEnd = (result: DropResult): void => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items: OptionData[] = reorder(
      options,
      result.source.index,
      result.destination.index
    );

    onOptionsUpdated(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot): JSX.Element => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={'root' + (isDragDisabled ? ' disabled' : '')}
          >
            {options.map((optionData, index) => (
              <Option optionData={optionData} index={index} key={index} isDragDisabled={isDragDisabled}></Option>
            ))}
            {provided.placeholder}
            <style jsx>{`
              .root {
                padding: 16px;
                background: ${snapshot.isDraggingOver ? "aliceblue" : "aliceblue"};
              }

              .disabled {
                background: #e8e8e8;
              }
            `}</style>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

function Option({optionData, index, isDragDisabled}: {optionData: OptionData, index: number, isDragDisabled: boolean}) {
  return (
    <Draggable key={optionData.id} draggableId={optionData.id} index={index} isDragDisabled={isDragDisabled}>
    {(provided, snapshot): JSX.Element => (
      <div className="root"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <MD>{optionData.content}</MD>
        <style jsx>{`
        .root {
          border: 1px solid darkgrey;
          margin-bottom: 8px;
          padding: 8px;
          user-select: none;
          background: white;
          border-color: ${snapshot.isDragging ? "steelblue" : "darkgrey"};
          border-radius: 4px;
        }
        `}</style>
      </div>
    )}
  </Draggable>
  );
}

