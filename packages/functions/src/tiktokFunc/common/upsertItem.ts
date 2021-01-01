import { FieldValue, TiktokItemCollectionPath, db } from "../../firebase/collectionPath";

export const upsertItem = async (itemList: TiktokItemType[]) => {
  const instagramMediaCollection = db.collection(TiktokItemCollectionPath);

  for (const mediaData of itemList) {
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
