export const getTweetIdByUrl = (url: string) => {
  const pathname = new URL(url).pathname;
  const pathArray = pathname.split("/").reverse();
  return pathArray[0];
};
