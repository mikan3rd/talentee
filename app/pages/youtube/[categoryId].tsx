import React from "react";

import Error from "next/error";
import { useRouter } from "next/router";
import { Breadcrumb, Divider } from "semantic-ui-react";

import { VideoCategorieOptions } from "../../common/youtubeVideoCategory";
import { YoutubeIndex } from "../../components/pages/YoutubeIndex";
import { TopSection, YoutubeSection } from "../../components/templates/BreadcrumbSection";
import { Meta } from "../../components/templates/Meta";

export default React.memo(() => {
  const router = useRouter();
  const categoryId = router.query.categoryId as string;
  const categoryOption = VideoCategorieOptions.find((option) => option.value === categoryId);

  if (!categoryOption) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <Meta
        title={`Youtubeランキング(${categoryOption.text})`}
        description={`人気のYoutubeランキング(${categoryOption.text})`}
      />

      <Breadcrumb size="big">
        <TopSection />
        <Breadcrumb.Divider />
        <YoutubeSection active={true} />
      </Breadcrumb>

      <Divider />

      <YoutubeIndex categoryOption={categoryOption} />
    </>
  );
});
