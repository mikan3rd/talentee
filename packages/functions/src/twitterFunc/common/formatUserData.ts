import dayjs from "dayjs";

export const formatTwitterUserData = (userObject: TwitterUserObjectType): TwitterUserDataType => {
  const { created_at, profile_image_url } = userObject;
  return {
    ...userObject,
    profile_image_url: profile_image_url.replace(/_normal(?=.(jpg|jpeg|png)$)/, ""),
    created_at: dayjs(created_at).toDate(),
  };
};

export const formatTweetData = (tweetObject: TweetObjectType): TweetDataType => {
  const { created_at } = tweetObject;
  return {
    ...tweetObject,
    created_at: dayjs(created_at).toDate(),
  };
};
