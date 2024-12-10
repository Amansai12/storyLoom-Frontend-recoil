import { atom } from 'recoil';

// Define the Post type (if not already defined elsewhere)
interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  author: {
    username: string,
    id: string,
    role: string,
    profileImage: string
  },
  createdAt: string;
  likedBy: { id: string }[],
  postImage: string
}

// Define the atom with explicit typing
export const blogsAtom = atom<Record<string, { posts: Post[], page: number, hasMore: boolean ,lastFetchTime : number}>>({
  key: 'blogsAtom',
  default: {}
});