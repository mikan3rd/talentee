import React from "react";

import { useRouter } from "next/router";

export const useRouteChange = () => {
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const routeChangeStart = React.useCallback(() => {
    setLoading(true);
  }, []);

  const routeChangeComplete = React.useCallback(() => {
    setLoading(false);
  }, []);

  React.useEffect(() => {
    router.events.on("routeChangeStart", routeChangeStart);
    router.events.on("routeChangeComplete", routeChangeComplete);

    return () => {
      router.events.off("routeChangeStart", routeChangeStart);
      router.events.off("routeChangeComplete", routeChangeComplete);
    };
  }, [routeChangeComplete, routeChangeStart, router.events]);

  return { loading };
};
