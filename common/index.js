import lookup from "country-code-lookup";
import nookies from "nookies";

const urls = [
  `https://raw.githubusercontent.com/iptv-org/iptv/master/index.m3u`,
  `https://iptv-org.github.io/iptv/categories/xxx.m3u`,
];

const isObjectEmpty = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

const getTextFromFetch = async (url) => {
  const req = await fetch(url);
  const text = await req.text();
  return text;
};

const parseBadLinks = (myPromise) => {
  return myPromise
    .split("#")
    .map((i) => i.replace(/\n/gi, ""))
    .filter((i) => i !== "")
    .filter((i) => (i.includes("EXTM3U") ? null : i))
    .map((i) => i.split("group-title")[1])
    .map((i) => {
      const currentIndex = i.indexOf("http");
      const currentUrl = i.slice(currentIndex);
      return currentUrl;
    });
};

const parseXLinks = (myPromise, badList, codes) => {
  return myPromise
    .map((i) => i.split("#"))
    .map((i) => i.filter((j) => j !== ""))
    .map((i) => i.filter((j) => (j.includes("EXTM3U") ? null : j)))
    .map((i) => i.map((j) => j.split(",")))
    .map((i) => i.map((j) => j[1]))
    .map((i) => i.filter((j) => (typeof j === undefined ? null : j)))
    .map((i) => i.map((j) => j.split("\n")))
    .map((i, index) =>
      i.map((j) => ({ title: j[0], url: j[1], country: codes[index] }))
    )
    .filter((i) => i.length !== 0)
    .map((i) =>
      i.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1))
    )
    .map((i) => i.filter((j) => (badList.indexOf(j.url) === -1 ? j : false)))
    .map((i) => i.filter((j) => (j.title.includes("XXX") ? false : j)));
};

const parseLinks = async (myPromise, badList) => {
  let codes = myPromise
    .split("#")
    .map((i) => i.replace(/\n/gi, ""))
    .filter((i) => i !== "")
    .filter((i) => (i.includes("EXTM3U") ? null : i))
    .map((i) => i.split("channels"))
    .map((i) => i[0])
    .map((i) => i.split(","))
    .map((i) => i[1]);
  const urls = myPromise
    .split("#")
    .map((i) => i.replace(/\n/gi, ""))
    .map((i) => i.replace(/EXTINF:-1,/gi, ""))
    .filter((i) => i !== "")
    .filter((i) => (i.includes("EXTM3U") ? null : i))
    .map((i) => i.split("/"))
    .map((i) => i[1])
    .map((i) => i.split("."))
    .map((i) => i[0])
    .map(
      (i) =>
        `https://raw.githubusercontent.com/iptv-org/iptv/master/channels/${i}.m3u`
    );
  const promises = urls.map(getTextFromFetch);
  const results = await Promise.all(promises);
  return parseXLinks(results, badList, codes);
};

const getData = async (ctx) => {
  let hasNoError = true;
  try {
    const cookies = nookies.get(ctx);
    const checkCookies = cookies && isObjectEmpty(cookies);
    if (checkCookies) {
      const mainPromises = urls.map(getTextFromFetch);
      const results = await Promise.all(mainPromises);
      const [promiseMainList, promiseBadList] = results;
      const badList = parseBadLinks(promiseBadList);
      const mainList = await parseLinks(promiseMainList, badList);
      const finalList = mainList.map((i, idx) => {
        return {
          id: ++idx,
          code: lookup.byCountry(i[0].country),
          content: [...i],
        };
      });
      return finalList;
    }
  } catch (e) {
    hasNoError = false;
    return "fail";
  } finally {
    if (hasNoError) {
      nookies.set(ctx, "hasData", true, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    } else {
      nookies.destroy(ctx, "hasData");
    }
  }
};

export { isObjectEmpty, getData };