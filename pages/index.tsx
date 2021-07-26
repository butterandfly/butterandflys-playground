import Image from 'next/image'
import Head from 'next/head';
import Container from '@material-ui/core/Container';
import { BlogMetaData, getAllBlogMetas } from '../lib/blog';
import BlogList from '../components/BlogList'
import W4FList from '../components/W4FList'
import { getAllW4FMetas, W4FMetaData } from '../lib/w4f';

interface HomeProps {
  blogMetas: BlogMetaData[],
  w4fMetas: W4FMetaData[],
}

export default function Home({ blogMetas, w4fMetas }: HomeProps) {
  return (
    <div className="root">
      <Head>
        <title>butterandfly's Playground 🎮 </title>
        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" /> */}
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Banner></Banner>
      <W4FList w4fMetas={w4fMetas}></W4FList>
      <BlogList blogMetas={blogMetas}></BlogList>
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
        <div className="banner">butterandfly's Playground 🎮 </div>
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

export const getStaticProps = async () => {
  const blogMetas = getAllBlogMetas();
  const w4fMetas = getAllW4FMetas();
  return {
    props: {
      blogMetas,
      w4fMetas,
    }
  }
}
