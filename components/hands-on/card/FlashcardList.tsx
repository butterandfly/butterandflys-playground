import Flashcard from './Flashcard'

export interface FlashcardListProps {
  children: string, // inner content to compile
}

export default function FlashcardList({children}: FlashcardListProps) {
  const genCards = () => {
    const cardContents = children.trim().split('~~~');
    return cardContents.map((content, index) => {
      return <Flashcard key={index}>{content.trim()}</Flashcard>
    });
  }
  
  return (<div className="root">
    {genCards()}
    <style jsx>{`
      .root {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
      }
    `}</style>
  </div>)
}