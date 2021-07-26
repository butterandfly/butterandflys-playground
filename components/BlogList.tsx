import { BlogMetaData } from "../lib/blog";
import Container from '@material-ui/core/Container';
import Link from 'next/link';

export interface BlogListProps {
  blogMetas: BlogMetaData[],
}

export default function BlogList({blogMetas}: BlogListProps) {
  const genList = () => {
    return blogMetas.map((meta: BlogMetaData) => {

      const href = '/blogs/' + meta.id;
      return <BlogCard key={meta.id} blogMeta={meta} href={href}></BlogCard> 
    })
  }

  return (
    <div className="root">
      <Container maxWidth="lg">
        <h1>Blogs 📝</h1>
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

function BlogCard({blogMeta, href}: {blogMeta: BlogMetaData, href: string}) {

  return (
    <div key={blogMeta.id}>
      <Link href={href}>
      <a className="container">
          <p className="title"><b>{blogMeta.title}</b></p>
          <p className="sub">{blogMeta.desc}</p>
      </a>
      </Link>
      <style jsx>{`
        .container {
          border: 2px solid darkorange;
          border-radius: 5px;
          padding: 16px;
          display: block;
          cursor: pointer;
        }

        .sub{
          color: gray;
        }
      `}</style>
    </div>
  )
}