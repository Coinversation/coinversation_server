export function unique(arr: any, key: any) {
  if (!arr) return arr;
  if (key === undefined) return [...new Set(arr)];
  const map = {
    string: (e) => e[key],
    function: (e) => key(e),
  };
  const fn = map[typeof key];
  const obj = arr.reduce((o, e) => ((o[fn(e)] = e), o), {});
  return Object.values(obj);
}
