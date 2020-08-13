import React from "react";
import { Button, Icon, Segment } from "semantic-ui-react";
import { css } from "@emotion/core";

import { useYoutubeIndexData } from "../../hooks/useYoutubeIndexData";
import { YoutubeCard } from "../organisms/YoutubeCard";

export const YoutubeIndex: React.FC = () => {
  const { youtubeData, getYoutubePageData } = useYoutubeIndexData();

  return (
    <>
      <Segment vertical></Segment>

      {youtubeData && (
        <Segment vertical>
          {youtubeData.map((data) => {
            return <YoutubeCard key={data.id} data={data} />;
          })}

          <Button
            fluid
            icon
            labelPosition="left"
            color="red"
            onClick={() => getYoutubePageData()}
            css={css`
              &&& {
                margin-top: 20px;
              }
            `}
          >
            <Icon name="hand point right" />
            さらに読み込む
          </Button>
        </Segment>
      )}

      <Segment vertical></Segment>
    </>
  );
};
