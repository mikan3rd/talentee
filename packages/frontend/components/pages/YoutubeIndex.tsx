import React from "react";

import { css } from "@emotion/react";
import { Button, Divider, Header, Icon, Menu } from "semantic-ui-react";

import { VideoCategorieOptions, VideoCategoryOptionType } from "@/common/youtubeVideoCategory";
import {
  IndexLinkButton,
  InstagramIndexLinkButton,
  TiktokIndexLinkButton,
  TwitterIndexLinkButton,
} from "@/components/atoms/IndexLinkButton";
import { YoutubeCard } from "@/components/organisms/YoutubeCard";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useYoutubeIndexData } from "@/hooks/useYoutubeIndexData";

export const YoutubeIndex = React.memo<{ categoryOption: VideoCategoryOptionType }>(({ categoryOption }) => {
  const isUp = useScrollDirection();
  const { youtubeData, hasNext, getYoutubeNextPageData, changeSelectedCategory } = useYoutubeIndexData(
    categoryOption.value,
  );

  React.useEffect(() => {
    const menuEle = document.getElementById("youtube_category_menu");
    const targetEle = document.getElementById(`youtube_category_${categoryOption.value}`);
    menuEle.scrollTo({ left: targetEle.offsetLeft, behavior: "smooth" });
  }, []);

  const handleOnClickCategory = (value: string) => {
    changeSelectedCategory(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header
        as="h1"
        color="red"
        css={css`
          display: flex;
          align-items: center;
          @media (max-width: 600px) {
            display: block;
          }
        `}
      >
        <div>
          <Icon name="youtube" color="red" size="big" />
          YouTubeランキング
        </div>
        <span
          css={css`
            color: black;
            font-size: 18px;
            margin-left: 10px;
            @media (max-width: 600px) {
              margin-left: 0;
            }
          `}
        >
          {categoryOption.text}
        </span>
      </Header>

      <Divider />

      <Menu
        id="youtube_category_menu"
        secondary
        css={css`
          &&& {
            position: sticky;
            top: ${isUp ? `60px` : 0};
            z-index: 1;
            margin-top: 20px;
            background-color: #f7f7f7;
            transition: all 0.5s ease;
            overflow-x: scroll;
            padding: 5px 0;
            .item {
              transition: all 0.5s ease !important;
            }
          }
        `}
      >
        {VideoCategorieOptions.map((option) => {
          return (
            <Menu.Item
              key={option.value}
              id={`youtube_category_${option.value}`}
              css={css`
                &&&& {
                  padding: 0;
                  height: 36px;
                }
              `}
            >
              <Button
                color="red"
                basic={option.value !== categoryOption.value}
                active={option.value === categoryOption.value}
                onClick={() => handleOnClickCategory(option.value)}
              >
                {option.text}
              </Button>
            </Menu.Item>
          );
        })}
      </Menu>

      <div
        css={css`
          margin-top: 10px;
        `}
      >
        {youtubeData.map((data, index) => {
          return <YoutubeCard key={data.id} data={data} rankNum={index + 1} />;
        })}
      </div>

      {hasNext && (
        <Button
          fluid
          icon
          labelPosition="left"
          color="youtube"
          onClick={() => getYoutubeNextPageData()}
          css={css`
            &&& {
              margin: 20px 0 40px 0;
            }
          `}
        >
          <Icon name="hand point right" />
          {youtubeData.length}位以降を読み込む
        </Button>
      )}

      <Divider />

      <div>
        <TwitterIndexLinkButton />
        <InstagramIndexLinkButton />
        <TiktokIndexLinkButton />
      </div>

      <Divider />

      <IndexLinkButton />
    </>
  );
});
