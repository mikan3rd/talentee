import React from "react";

let window: customWindow;
interface customWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adsbygoogle: any;
}

export const GoogleAdSense = React.memo(() => {
  React.useEffect(() => {
    if (window) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-2915249860974702"
      data-ad-slot="5934873216"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
});
