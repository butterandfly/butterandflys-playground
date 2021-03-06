import ReactMarkdown from "react-markdown"
import remarkMath from 'remark-math'
import katexPlugin from 'rehype-katex'


export default function MD({children}: any) {
  return (
    <div className="gt-md markdown-body">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[katexPlugin]} >{children}</ReactMarkdown>
    </div>
  )
}