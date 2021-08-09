import { useEffect, useRef } from 'react'
// import dynamic from 'next/dynamic'


export default function Mermaid ({children, width, height}: {children: string, width: number, height: number}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    (async () => {
      const mermaid:any = await import('mermaid');
      mermaid.initialize({
        // startOnLoad: false,
        startOnLoad: false,
        flowchart: {
          useMaxWidth: false,
        }
      })
      if (ref.current) {
        mermaid.init(ref.current);
      }
    })();
  }, [children])
  
  // useEffect(() => {
    // mermaid.contentLoaded();
  // }, [chart])

  return (
    <div ref={ref} className="root mermaid">{children}
      <style jsx>{`
        .root {
          margin: 16px auto;
          text-align: center;
          width: ${width}px;
          height: ${height}px;
        }

        .root :global(svg) {
          width: ${width}px;
          height: ${height}px;
        }
      `}</style>
    </div>
  )
}