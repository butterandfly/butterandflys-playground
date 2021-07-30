import Image from 'next/image'
import Head from 'next/head';
import Container from '@material-ui/core/Container';
import { BlogMetaData, getAllBlogMetas } from '../lib/blog';
import BlogList from '../components/BlogList'
import W4FList from '../components/W4FList'
import { getAllW4FMetas, W4FMetaData } from '../lib/w4f';
import { BFPlayMetaData, getAllBFPlayMetas } from '../lib/bfplay';
import BFPlayList from '../components/BFPlayList'
import GitHubIcon from '@material-ui/icons/GitHub';

interface HomeProps {
  blogMetas: BlogMetaData[],
  w4fMetas: W4FMetaData[],
  playMetas: BFPlayMetaData[],
}

const webTitle = "butterandfly's Playground";

export default function Home({ blogMetas, w4fMetas, playMetas }: HomeProps) {
  return (
    <div className="root">
      <Head>
        <title>{webTitle}</title>
        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" /> */}
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Banner></Banner>
      <BFPlayList playMetas={playMetas}></BFPlayList>
      <W4FList w4fMetas={w4fMetas}></W4FList>
      <BlogList blogMetas={blogMetas}></BlogList>
      <Tail />
      <style jsx>{`
        .root {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: start;
          align-items: center;
          height: 100vh;
        }
      `}</style>
    </div>
  )
}

function Banner() {
  return (
    <div className="root">
      <Container maxWidth="lg">
        <div className="banner">{webTitle}</div>
        {/* <div className="sub">Enjoy yourself here!</div> */}
      </Container>
      <style jsx>{`
        .root {
          width: 100vw;
        }
        .banner {
          padding: 16px 0;
          color: darkorange;
          font-size: 3rem;
          font-weight: bold;
        }
        .sub {
          color: #efab64;
          margin-bottom: 16px;
          font-size: 24px;
        }
      `}</style>
    </div>
  );
}

function Tail() {
  return (
    <div className="root">
      <div className="container">
        <div className="content">
        <a target="_blank" rel="noreferrer" href="https://github.com/butterandfly/butterandflys-playground"><GitHubIcon className="icon" /></a>
        </div>
      </div>
      <style jsx>{`
        .root {
          width: 100vw;
          margin-top: 40px;
        }      
        .container {
          max-width: 1280px;
          padding: 0px 24px;
          margin: 0 auto;
        }
        .content {
          border-top: 1px solid lightgray;
          display: flex;
          justify-content: center;
          padding: 16px 0;
          color: darkslategray;
        }
        .root :global(.icon) {
          font-size: 32px;
        }
      `}</style>
    </div>
  )
}

export const getStaticProps = async () => {
  const blogMetas = getAllBlogMetas();
  const w4fMetas = getAllW4FMetas();
  const playMetas = getAllBFPlayMetas();
  return {
    props: {
      blogMetas,
      w4fMetas,
      playMetas,
    }
  }
}
