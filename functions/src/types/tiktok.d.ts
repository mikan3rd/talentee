declare type TiktokUserType = {
  user: {
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
  stats: {
    followingCount: number;
    followerCount: number;
    heartCount: string;
    videoCount: number;
    diggCount: string;
  };
};
