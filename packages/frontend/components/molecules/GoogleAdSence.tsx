import React from "react";

import { useRouter } from "next/router";

export const GoogleAdSense = React.memo<{ className?: string }>(({ className = "" }) => {
  const { asPath } = useRouter();

  React.useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, [asPath]);

  return (
    <div key={asPath}>
      <ins
        className={`${className} adsbygoogle`}
        style={{ display: "block" }}
        data-ad-client="ca-pub-2915249860974702"
        data-ad-slot="5934873216"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
});
