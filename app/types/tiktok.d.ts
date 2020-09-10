type TiktokUserBaseType = {
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

declare type TiktokUserObjectType = TiktokUserBaseType & {
  accountRef: firebase.firestore.DocumentReference;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
};
declare type TiktokUserDataType = TiktokUserBaseType & {
  createdAt: number;
  updatedAt: number;
};
