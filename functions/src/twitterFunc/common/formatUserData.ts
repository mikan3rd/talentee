import * as dayjs from "dayjs";

import { UserDataType, UserObjectType } from "./api";

export const formatTwitterUserData = (userObject: UserObjectType): UserDataType => {
  const { created_at, profile_image_url } = userObject;
  return {
    ...userObject,
    profile_image_url: profile_image_url.replace(/_normal(?=.jpg$)/, ""),
    created_at: dayjs(created_at).toDate(),
  };
};
