// @j-katzen
function encodeQueryData(data) {
  let ret = [];
  for (let d in data)
    ret.push(`${encodeURIComponent(d)}=${encodeURIComponent(data[d])}`);
  return ret.join("&");
}

module.exports = encodeQueryData;
