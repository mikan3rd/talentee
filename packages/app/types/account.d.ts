type AccountBaseType = {
  tmpUsername: string;
  thumbnailUrl: string;
  youtubeMainRef?: FirebaseFirestore.DocumentReference;
  twitterMainRef?: FirebaseFirestore.DocumentReference;
  instagramMainRef?: FirebaseFirestore.DocumentReference;
  tiktokMainRef?: FirebaseFirestore.DocumentReference;
};

declare type AccountObjectType = AccountBaseType & {
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
};

declare type AccountDataType = AccountBaseType & {
  createdAt: number;
  updatedAt: number;
};
