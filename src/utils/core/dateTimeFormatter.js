export default formatter;

const mapper = {
  YYYY: (date) => date.getFullYear(),
  YY: (date) => date.getFullYear().toString().slice(-2),
  MM: (date) => date.getMonth() + 1,
  DD: (date) => date.getDate(),
  HH: (date) => date.getHours(),
  mm: (date) => date.getMinutes(),
  ss: (date) => date.getSeconds(),
};

function formatter(date, pattern = "YYYY-MM-DD HH:mm:ss") {
  let formattedDate = pattern;

  Object.keys(mapper).forEach((key) => {
    formattedDate = formattedDate.replaceAll(
      key,
      mapper[key](date).toString().padStart(2, "0"),
    );
  });

  return formattedDate;
}

const HOUR = 24;
const MIN = 60;
const SEC = 60;
const MS = 1000;

export function msToTime(ms, verbose = false) {
  const hours = Math.floor((ms / (MS * SEC * MIN)) % HOUR);
  const minutes = Math.floor(ms / (MS * SEC));
  const seconds = ((ms % (MS * SEC)) / MS).toFixed(0);

  let time = [];
  let contains = {
    hours: verbose ? verbose : hours > 0,
    minutes: verbose ? verbose : minutes > 0,
    seconds: verbose ? verbose : seconds > 0,
  };

  if (contains.hours) {
    time.push((hours < 10 ? "0" : "") + hours);
  }

  time.push((minutes < 10 ? "0" : "") + minutes);
  time.push((seconds < 10 ? "0" : "") + seconds);

  return {
    time: time.join(":"),
    contains,
  };
}
