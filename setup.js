const jsContent = document.getElementsByClassName("js-file-line-container")[0];
const blocCodes = Array.from(jsContent.getElementsByClassName("blob-code"));

const FILE_TYPES = ["ts", "js", "tsx", "jsx"];

const checkInternalLink = (link) => link.includes("/");
const checkImportLine = ({ textContent }) =>
  ["import", "from"].includes(textContent);

const checkFileUrlWithType = (url, type) => {
  const fileUrl = `${url}.${type}`;
  return fetch(fileUrl).then((res) => {
    if (!res.ok) {
      throw Error(res.statusText);
    }
    return fileUrl;
  });
};

const getFileUrl = (url) =>
  FILE_TYPES.slice(1).reduce(
    (promise, type) =>
      promise
        .then((goodUrl) => goodUrl)
        .catch(() => checkFileUrlWithType(url, type)),
    checkFileUrlWithType(url, FILE_TYPES[0])
  );

const importBlocs = blocCodes
  .filter((blocCode) => {
    const spansBloc = Array.from(blocCode.getElementsByTagName("span"));
    return spansBloc.length && spansBloc.some(checkImportLine);
  })
  .forEach(async (blocCode) => {
    const blocSource = blocCode.getElementsByClassName("pl-s")[0];

    if (!blocSource || !checkInternalLink(blocSource.textContent)) {
      return;
    }

    const href = blocSource.textContent.toString().replace(/\'/g, "");
    const fileName = href.slice(href.lastIndexOf("/") + 1);
    const link = document.createElement("a");

    try {
      const url = fileName.includes(".") ? href : await getFileUrl(href);

      link.textContent = href;
      link.href = url;

      blocSource.replaceWith(link);
    } catch {}
  });