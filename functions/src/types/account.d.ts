declare interface IAccountData {
  tmpUsername?: string;
  thumbnailUrl?: string;
  youtubeMainRef?: FirebaseFirestore.DocumentReference;
  twitterMainRef?: FirebaseFirestore.DocumentReference;
  instagramMainRef?: FirebaseFirestore.DocumentReference;
  createdAt?: FirebaseFirestore.FieldValue;
  updatedAt: FirebaseFirestore.FieldValue;
}
