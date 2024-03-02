import { LoadUserHookResult } from "../query/loadUser";

export type queryProps = {
  data: LoadUserHookResult | undefined;
  posts: postProps[] | undefined;
  postRefetch?: any;
};

export type postProps = {
  user: string;
  pageId: string;
  profile: string;
  date: string;
  timestamp: { second: number; nanoseconds: number };
  title: string;
  fileName: string | string[];
  url: [] | string[];
  favorite: number;
  text: string;
  writer: string;
  id: string;
};

export type replyType = {
  comment: string;
  uid: string;
  replyrer: string;
  date: string;
  timestamp: { second: number; nanoseconds: number };
  profile: string;
  id: string;
};

export type FirebaseData = {
  url: string[];
  title: string;
  writer: string;
  profile: string;
  pageId: string;
  user: string;
  timeStamp: {
    seconds: number;
    nanoseconds: number;
  };
  text: string;
  fileName: string[];
  date: string;
  favorite: number;
};
