import { FieldValue, InstagramMediaCollectionPath, db } from "../../firebase/collectionPath";

export const upsertMedia = async (mediaDataList: InstagramMediaType[]) => {
  const instagramMediaCollection = db.collection(InstagramMediaCollectionPath);

  for (const mediaData of mediaDataList) {
    const mediaRef = instagramMediaCollection.doc(mediaData.id);
    const mediaDoc = await mediaRef.get();

    const instagramMediaData = {
      ...mediaData,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    };

    if (mediaDoc.exists) {
      delete instagramMediaData.createdAt;
    }

    await mediaRef.set(instagramMediaData, { merge: true });
  }
};
