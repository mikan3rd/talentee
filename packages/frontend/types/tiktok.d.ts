type TiktokUserInfoType = {
  id: string;
  uniqueId: string;
  nickname: string;
  avatarThumb: string;
  avatarMedium: string;
  signature: string;
  verified: boolean;
  secret: boolean;
  secUid: string;
  openFavorite: boolean;
  relation: number;
};

type TiktokUserStatType = {
  followingCount: number;
  followerCount: number;
  heartCount: string;
  videoCount: number;
  diggCount: string;
};

declare type TiktokUserBaseType = {
  user: TiktokUserInfoType;
  stats: TiktokUserStatType;
};

declare type TiktokUserObjectType = TiktokUserBaseType & {
  accountRef: firebase.firestore.DocumentReference;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
};

declare type TiktokUserDataType = TiktokUserBaseType & {
  createdAt: number;
  updatedAt: number;
};

declare type TiktokItemType = {
  id: string;
  author: TiktokUserInfoType;
  authorStats: TiktokUserStatType;
  desc: string;
  createTime: number;
  digged: boolean;
  duetEnabled: boolean;
  forFriend: boolean;
  itemMute: boolean;
  stitchEnabled: boolean;
  stats: {
    commentCount: number;
    diggCount: number;
    playCount: number;
    shareCount: number;
  };
  music: {
    id: string;
    title: string;
    authorName: string;
    coverLarge: string;
    coverMedium: string;
    coverThumb: string;
    original: boolean;
    playUrl: string;
  };
  video: {
    id: string;
    cover: string;
    downloadAddr: string;
    playAddr: string;
    duration: number;
    originCover: string;
    dynamicCover: string;
    reflowCover: string;
    width: number;
    height: number;
    ratio: string;
  };
};
