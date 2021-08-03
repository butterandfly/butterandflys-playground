import { useState } from "react"
import {useSpring, animated} from 'react-spring'
import MD from '../MD'

interface FlashcardProps {
  children: string,
}

export default function Flashcard({children}: FlashcardProps) {
  const [front, setFront] = useState(true)
  const { transform, opacity } = useSpring({
    opacity: !front ? 1 : 0,
    transform: `perspective(600px) rotateX(${!front ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })

  const contents = children.split('---');
  const frontContent = contents[0].trim();
  const backContent = contents[1].trim();

  return (<div className="root" onClick={() => setFront(!front)}>
    <animated.div
      className="front container" 
      style={{ opacity: opacity.to(o => 1 - o), transform }}
    >
      <MD>{frontContent}</MD>
    </animated.div>
    <animated.div
      className="back container" 
      style={{
        opacity,
        transform,
        rotateX: '180deg',
      }}
    >
      <MD>{backContent}</MD>
    </animated.div>
    <style jsx>{`
      .root {
        height: 160px;
        position: relative;
        cursor: pointer;
        min-width: 300px;
        margin-bottom: 16px;
        background: white;
      }
      @media screen and (min-width: 648px) {
        .root {
          min-width: 300px;
        }
      }

      .root :global(.container) {
        position: absolute;
        height: 100%;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        border: 1px solid gray;
        border-radius: 5px;
        padding: 16px;
      }

      .root :global(.front) {
        color: white;
        background: steelblue;
        border: steelblue;
      }

      .root :global(.back) {
        color: black;
      }
    `}</style>
  </div>)
}