declare type YoutubeData = {
  accountRef: firebase.firestore.DocumentReference;
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
    country: string;
    publishedAt: string;
  };
  statistics: { subscriberCount: number; videoCount: number; viewCount: number; hiddenSubscriberCount: boolean };
  brandingSettings: { channel: { keywords: string[] } };
  mainVideoCategoryId: string;
  videoCategories: { id: string; snippet: { title: string } }[];
  updatedAt: number;
};

declare type IYoutubeVideoData = {
  id: string;
  snippet: { title: string; description: string; publishedAt: string; tags?: string[] };
  statistics: { viewCount: number; likeCount?: number; dislikeCount?: number; commentCount: number };
  player: { embedHtml: string };
  videoCategory: { snippet: { title: string } };
};
