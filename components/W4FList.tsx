import { W4FMetaData } from "../lib/w4f";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
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
        {/* <Grid container spacing={2}> */}
        <div className="grid">
          {genList()}
        </div>
        {/* </Grid> */}
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
    // <Grid key={w4fMeta.id} item xs={2}>
    <div key={w4fMeta.id}>
      <Link href={href}>
      <a className="container">
          <p className="title"><b>{w4fMeta.title}</b></p>
      </a>
      </Link>
      <style jsx>{`
        .container {
          border: 2px solid #ffcc97;
          border-radius: 5px;
          padding: 8px;
          display: flex;
          cursor: pointer;
          justify-content: center;
        }

        .container:hover {
          border: 2px solid darkorange;
        }

      `}</style>
      </div>
  )
}