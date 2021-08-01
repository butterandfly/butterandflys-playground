import { BFPlayMetaData } from "../lib/bfplay";
import Container from '@material-ui/core/Container';
import Link from 'next/link';

export interface BFPlayListProps {
  playMetas: BFPlayMetaData[],
}

export default function BFPlayList({playMetas}: BFPlayListProps) {
  const genList = () => {
    return playMetas.map((meta: BFPlayMetaData) => {

      const href = '/plays/' + meta.id;
      return <BFPlayCard key={meta.id} playMeta={meta} href={href}></BFPlayCard> 
    })
  }

  return (
    <div className="root">
      <Container maxWidth="lg">
        <h1>Plays 🕹</h1>
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
          grid-template-columns: repeat(1, 1fr);
          column-gap: 16px;
          row-gap: 1em;
        }

        @media screen and (min-width: 600px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
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

function BFPlayCard({playMeta, href}: {playMeta: BFPlayMetaData, href: string}) {

  return (
    <div key={playMeta.id}>
      <Link href={href}>
      <a className="container">
          {/* <p className="title"><b>{playMeta.title}</b></p> */}
          <h3 className="title">{playMeta.title}</h3>
          <p className="sub">{playMeta.desc}</p>
      </a>
      </Link>
      <style jsx>{`
        .container {
          border: 2px solid gray;
          border-radius: 5px;
          padding: 16px;
          display: block;
          cursor: pointer;
        }

        .container:hover {
          background: gray;
          color: white;
        }

        .title {
          margin: 12px 0;
        }

        .sub{
          color: gray;
        }

        .container:hover .sub {
          color: white;
        }
      `}</style>
    </div>
  )
}