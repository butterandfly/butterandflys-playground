import Container from '@material-ui/core/Container';
import Link from 'next/link';

export default function Layout({title, children}: {title: string, children?: any}) {
  return (
    <div className="root">
      {/* <Header></Header> */}
      <div className="header-wrapper">
        <LayoutHeader title={title}></LayoutHeader>
      </div>
      <Container className="body-wrapper" maxWidth="lg">
      {children}
      </Container>
      <style jsx>{`
        .root {
          display: flex;
          flex-flow: column;
          padding-bottom: 40px;
        }

        .header-wrapper {
          position: fixed;
          background: white;
          z-index: 10;
        }

        .root :global(.body-wrapper) {
          margin-top: 65px;
          display: flex;
          flex-flow: row;
          justify-content: center;
        }
      `}</style>
    </div>
  ) 
}

const webTitle = "butterandfly's Playground 🎮";

export function LayoutHeader({title}: any) {
  return (
    <div className="root">
      <Container maxWidth="lg">
        <div className="bread">
          <Link href="/"><a>{webTitle}</a></Link>
        </div>
      </Container>
      
      <style jsx>{`
        .root {
          box-shadow: 0px 1px 5px grey;
          border-bottom: 0px solid darkorange;
          width: 100vw;
          color: black;
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: bold;
          flex-flow: row;
          padding: 16px;
        }

        a {
          color: darkorange;
        }

        .slash {
          padding: 0 8px;
        }

        .bread {
          display: flex;
          flex-flow: row;
          align-items: center;
        }

        .title {
          font-size: 20px;
        }

        a:hover {
          text-decoration: underline;
        }

      `}</style>
    </div>
  );
}
