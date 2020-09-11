declare interface IAccountData {
  tmpUsername: string;
  thumbnailUrl: string;
  youtubeMainRef?: FirebaseFirestore.DocumentReference;
  twitterMainRef?: FirebaseFirestore.DocumentReference;
  instagramMainRef?: FirebaseFirestore.DocumentReference;
  tiktokMainRef?: FirebaseFirestore.DocumentReference;
}

declare interface IYoutubeData {
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
  accountRef: firebase.firestore.DocumentReference;
  videoCategories: { snippet: { title: string } }[];
  updatedAt: number;
}

declare interface IYoutubeVideoData {
  id: string;
  snippet: { title: string; description: string; publishedAt: string; tags?: string[] };
  statistics: { viewCount: number; likeCount?: number; dislikeCount?: number; commentCount: number };
  player: { embedHtml: string };
  videoCategory: { snippet: { title: string } };
}
