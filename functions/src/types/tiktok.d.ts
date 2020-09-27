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
  bioLink?: { link: string };
};

type TiktokUserStatType = {
  followingCount: number;
  followerCount: number;
  heartCount: string;
  videoCount: number;
  diggCount: string;
};

declare type TiktokUserType = {
  user: TiktokUserInfoType;
  stats: TiktokUserStatType;
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
