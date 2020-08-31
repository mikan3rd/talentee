declare type YoutubeData = {
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
  accountRef: FirebaseFirestore.DocumentReference;
  videoCategories: { snippet: { title: string } }[];
  updatedAt: number;
};
