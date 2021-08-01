import { W4FMetaData } from "../lib/w4f";
import Container from '@material-ui/core/Container';
import Link from 'next/link';

export interface W4FListProps {
  w4fMetas: W4FMetaData[],
}

export default function W4FList({w4fMetas}: W4FListProps) {
  const genList = () => {
    return w4fMetas.map((meta: W4FMetaData) => {

      const href = '/w4fs/' + meta.id;
      return <W4FCard key={meta.id} w4fMeta={meta} href={href}></W4FCard> 
    })
  }

  return (
    <div className="root">
      <Container maxWidth="lg">
        <h1>Words for Fluency 🔠</h1>
        <hr />
        <div className="grid">
          {genList()}
        </div>
      </Container>
      <style jsx>{`
        .root {
          width: 100vw;
          margin-top: 8px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          column-gap: 16px;
          row-gap: 1em;
          grid-auto-rows: minmax(72px, 72px);
        }

        @media screen and (min-width: 600px) {
          .grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media screen and (min-width: 960px) {
          .grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }

        h1 {
          margin-bottom: 8px;
        }

        hr {
          color: gray;
          opacity: 0.4;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  )
}

function W4FCard({w4fMeta, href}: {w4fMeta: W4FMetaData, href: string}) {
  return (
    <div key={w4fMeta.id} className="root">
      <Link href={href}>
      <a className="container">
          <b>{w4fMeta.title}</b>
      </a>
      </Link>
      <style jsx>{`
        .root {
          border: 2px solid steelblue;
          border-radius: 5px;
          padding: 0 8px;
        }

        .root:hover {
          background: steelblue;
          color: white;
        }

        .container {
          cursor: pointer;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
      </div>
  )
}