import * as dayjs from "dayjs";

import { UserObjectType } from "./api";

export const formatTwitterUserData = (userObject: UserObjectType) => {
  return { ...userObject, created_at: dayjs(userObject.created_at).toDate() };
};
