import { useSpring} from '@react-spring/web'
import { useState } from 'react';
import { Interpolation } from 'react-spring';

export function useHeadShake(): [Interpolation<number, number>, () => void] {
  const [justClicked, setJustClicked] = useState(false);

  const {x} = useSpring({
    x: justClicked ? 1 : 0,
    from: { x: 0},
    reset: true,
    config: { duration: 750 },
    onRest: () => setJustClicked(false),
  });

  const transform = {
    range: [0, 0.065, 0.185, 0.315, 0.435, 0.5, 1],
    output: [0, -6, 5, -3, 2, 0, 0],
  };

  return [x.to(transform), () => setJustClicked(true)];
}