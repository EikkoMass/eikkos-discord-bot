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
