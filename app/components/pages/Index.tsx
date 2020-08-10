import React from "react";
import Link from "next/link";
import { css } from "@emotion/core";
import { Button, Icon } from "semantic-ui-react";

import { useIndexData } from "../../hooks/useIndexData";

export const Index: React.FC = () => {
  const { youtubeData } = useIndexData();

  return (
    <>
      {youtubeData &&
        youtubeData.map((data) => {
          const {
            id,
            accountRef,
            snippet: { title, thumbnails },
            statistics: { subscriberCount },
          } = data;
          return (
            <div
              key={id}
              css={css`
                position: relative;
              `}
            >
              <Link href={`/account/${accountRef.id}`} passHref>
                <a
                  css={css`
                    display: flex;
                    margin-top: 20px;
                    border-radius: 5px;
                    padding: 20px;
                    color: inherit;
                    background-color: white;
                    &:hover {
                      color: inherit;
                    }
                  `}
                >
                  <div
                    css={css`
                      margin-right: 20px;
                    `}
                  >
                    <img
                      src={thumbnails.medium.url}
                      alt={title}
                      css={css`
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                      `}
                    />
                  </div>
                  <div>
                    <div
                      css={css`
                        font-weight: bold;
                      `}
                    >
                      {title}
                    </div>
                  </div>
                </a>
              </Link>

              <Button
                color="youtube"
                as="a"
                href={`https://www.youtube.com/channel/${id}`}
                target="_black"
                css={css`
                  position: absolute;
                  bottom: 20px;
                  right: 20px;
                `}
              >
                <Icon name="youtube" /> YouTube
              </Button>
            </div>
          );
        })}
    </>
  );
};
