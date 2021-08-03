import { useEffect, useRef } from 'react'
// import dynamic from 'next/dynamic'


export default function Mermaid ({chart, children}: {chart: string, children: string}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    (async () => {
      const mermaid:any = await import('mermaid');
      mermaid.initialize({
        startOnLoad: false,
      })
      if (ref.current) {
        mermaid.init(ref.current)
      }
    })();
  }, [children])
  
  useEffect(() => {
    // mermaid.contentLoaded();
    
  }, [chart])

  return (
    <div ref={ref} className="root">{chart || children}
      <style jsx>{`
        .root {
          margin: 16px auto;
          text-align: center;
        }
      `}</style>
    </div>
  )
}