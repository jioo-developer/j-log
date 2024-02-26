import { LoadUserHookResult } from "../query/loadUser";

export type queryProps = {
  data: LoadUserHookResult | undefined;
  posts: any[] | undefined;
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
