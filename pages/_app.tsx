import '../styles/globals.css'
import type { AppProps } from 'next/app'

import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
