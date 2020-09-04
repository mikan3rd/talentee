import axios from "axios";

type shareDataType = {
  entry_data: { ProfilePage: { graphql: { user: InstagramUserType } }[] };
};

export const getUserData = async (username: string) => {
  const url = `https://www.instagram.com/${username}/`;
  const { data } = await axios.get<string>(url);
  const scriptMatch = data.match(/(?<=(window\._sharedData\s=\s))(.*)(?=(;<\/script>))/);
  if (!scriptMatch) {
    return null;
  }

  const sharedData = JSON.parse(scriptMatch[0]) as shareDataType;
  const user = sharedData.entry_data.ProfilePage[0].graphql.user;

  console.log(JSON.stringify(user));

  return user;
};
