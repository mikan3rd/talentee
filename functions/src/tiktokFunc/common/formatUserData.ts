export const formatUserData = (userObject: TiktokUserType): TiktokUserType => {
  const { user } = userObject;

  const avatarMedium = `https://p16-sg.tiktokcdn.com${new URL(user.avatarMedium).pathname}`;
  const avatarThumb = `https://p16-sg.tiktokcdn.com${new URL(user.avatarThumb).pathname}`;

  return {
    ...userObject,
    user: {
      ...user,
      avatarMedium,
      avatarThumb,
    },
  };
};
