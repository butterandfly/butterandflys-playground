import { getAllBlogIDs, getBlog } from "../../lib/blog";
import Layout from '../../components/Layout'
import MD from '../../components/hands-on/MD'

interface BlogProps {
  blog: any, 
}

export default function Blog({blog}: BlogProps) {

  return (
    <div className="root">
    <Layout title={blog.title}>
    <div className="container">
      <h1 className="title">
        {blog.title}
      </h1>
      <div>
        <MD>
          {blog.content}
        </MD>
      </div>
      <style jsx>{`
        .title {
          color: #444444;
          margin-top: 8px;
        }

        .container {
          max-width: 872px;
          padding: 0 16px;
          flex-grow: 1;
        }
    `}</style>
    </div>
    </Layout>
    </div>
  )
}

// Get all demos.
export const getStaticPaths = async () => {
  const blogIDs = getAllBlogIDs();

  const paths = blogIDs.map((id: string) => {
    return {params: {id: id}}
  });

  return {
    paths: paths,
    fallback: false
  };
}

// const postDirectory = path.join(process.cwd(), 'posts');

export const getStaticProps = async (context:any) => {
  const id = context.params!.id as string;
  const blog = getBlog(id);

  return {
    props: {
      blog
    }
  };
}
