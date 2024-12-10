import { atom } from "recoil";

type Post = {
    category: string;
    content: string;
    createdAt: string;
    title: string;
    postImage: string;
    id: string;
    author: {
      username: string;
      id : string,
      role : string,
      profileImage : string
    };
    likedBy: {id : string}[];
  };
  
  
  
  type SubUser = {
    username: string;
    about: string;
    role: string;
    id: string;
    profileImage : string;
  };
  
  type User = {
    username: string;
    about: string;
    role: string;
    profileImage : string,
    followers: SubUser[];
    following: SubUser[];
    posts : Post[],
    lastFetchTime : number
  };
export const userAtom = atom<Record<string,User >>({
    key : 'usersAtom',
    default : {}
})