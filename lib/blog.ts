import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export interface BlogMetaData {
  id: string,
  title: string,
  desc: string,
  createDate: string,
}

export interface BlogData {
  id: string,
  title: string,
  desc: string,
  createDate: string,
  content: string,
}

const postDirectory = path.join(process.cwd(), 'posts');

export function getAllBlogMetas() {
  const fileNames = fs.readdirSync(postDirectory)
  const blogIDs = fileNames.map((fileName) => fileName.replace(/.mdx$/, ''));

  const blogMetas = blogIDs.map((blogID) => {
    const dataPath = path.join(postDirectory, blogID + '.mdx');
    const fileContents = fs.readFileSync(dataPath, 'utf8')
  
    const matterResult = matter(fileContents);
    const data = matterResult.data;
    return {
      id: blogID,
      desc: data.desc,
      title: data.title,
      createDate: data.createDate.toString(),
    } as BlogMetaData;
  });
  return blogMetas;
}

export function getAllBlogIDs() {
  const fileNames = fs.readdirSync(postDirectory);
  const ids = fileNames.map((name) => name.replace(/.mdx$/, ''));
  return ids;
}

export function getBlog(id: string): BlogData {
  const fullPath = path.join(postDirectory, `${id}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents);
  const data = matterResult.data;
  return {
    id,
    title: data.title,
    desc: data.desc,
    createDate: data.createDate.toString(),
    content: matterResult.content
  }
}