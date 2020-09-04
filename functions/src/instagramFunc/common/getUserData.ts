import axios from "axios";

type shareDataType = {
  entry_data: { ProfilePage: { graphql: { user: InstagramUser } }[] };
};

type InstagramUser = {
  id: string;
  username: string;
  full_name: string;
  biography: string;
  external_url: string;
  edge_followed_by: { count: number };
  edge_follow: { count: number };
  is_private: boolean;
  is_verified: boolean;
  profile_pic_url: string;
  profile_pic_url_hd: string;
  edge_felix_video_timeline: unknown[];
  edge_media_collections: unknown[];
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
