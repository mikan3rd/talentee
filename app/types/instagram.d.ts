type InstagramUserBaseType = {
  id: string;
  username: string;
  full_name: string;
  biography: string;
  external_url: string;
  edge_followed_by: { count: number };
  edge_follow: { count: number };
  is_private: boolean;
  is_verified: boolean;
  profile_pic_url: string;
  profile_pic_url_hd: string;
  edge_felix_video_timeline: { count: number };
  edge_media_collections: { count: number };
  edge_owner_to_timeline_media: { count: number };
  edge_mutual_followed_by: { count: number };
  edge_saved_media: { count: number };
  edge_related_profiles: { edges: unknown[] };
};

declare type InstagramUserObjectType = InstagramUserBaseType & {
  accountRef: firebase.firestore.DocumentReference;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
};
declare type InstagramUserDataType = InstagramUserBaseType & {
  createdAt: number;
  updatedAt: number;
};
