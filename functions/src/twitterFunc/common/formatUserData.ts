import * as dayjs from "dayjs";

import { UserDataType, UserObjectType } from "./api";

export const formatTwitterUserData = (userObject: UserObjectType): UserDataType => {
  return { ...userObject, created_at: dayjs(userObject.created_at).toDate() };
};
