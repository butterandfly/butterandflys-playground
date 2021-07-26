import { getAllBlogIDs, getBlog } from "../../lib/blog";
import BlogLayout from '../../components/Layout'
import MD from '../../components/hands-on/MD'

interface BlogProps {
  blog: any, 
}

export default function Blog({blog}: BlogProps) {

  return (
    <div className="root">
    <BlogLayout title={blog.title}>
    <div className="container">
      <h1 className="section-title">
        {blog.title}
      </h1>
      <div>
        <MD>
          {blog.content}
        </MD>
      </div>
      <style jsx>{`
        .section-title {
          color: darkorange;
          margin-top: 8px;
        }
        .lessonNum {
          color: gray;
          font-size: 20px;
          font-style: italic;
          margin-bottom: 8px;
        }
        .next {
          text-align: center;
          margin-bottom: 32px;
        }
        .root :global(.next-btn) {
          height: 64px;
          width: 256px;
        }
        .container {
          width: 960px;
        }
    `}</style>
    </div>
    </BlogLayout>
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
