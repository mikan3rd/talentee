type InstagramUserBaseType = {
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
  edge_felix_video_timeline: { count: number };
  edge_media_collections: { count: number };
  edge_mutual_followed_by: { count: number };
  edge_saved_media: { count: number };
  edge_related_profiles: { edges: unknown[] };
};

declare type InstagramUserType = InstagramUserBaseType & {
  edge_owner_to_timeline_media: { count: number };
};

declare type InstagramUserRawType = InstagramUserBaseType & {
  edge_owner_to_timeline_media: { count: number; edges: { node: InstagramMediaType }[] };
};

declare type InstagramMediaType = {
  id: string;
  shortcode: string;
  owner: { id: string; name: string };
  is_video: boolean;
  location: { id: string; name: string; slug: string; has_public_page: boolean };
  taken_at_timestamp: number;
  thumbnail_src: string;
  thumbnail_resources: { src: string; config_width: number; config_height: number }[];
  accessibility_caption: string;
  comments_disabled: boolean;
  dimensions: { height: number; width: number };
  display_url: string;
  edge_liked_by: { count: number };
  edge_media_preview_like: { count: number };
  edge_media_to_caption: { edges: { node: { text: string } }[] };
  edge_media_to_comment: { count: number };
  edge_media_to_tagged_user: { edges: { node: { user: InstagramUserType } } };
  edge_sidecar_to_children: { edges: { node: InstagramMediaType }[] };
  has_audio: boolean;
  video_view_count: number;
  product_type: "igtv" | "clips";
};
