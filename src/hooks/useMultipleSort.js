export const useMultipleSort = () => function (array, keys) {
  keys = keys || {};

  var obLen = function (obj) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key))
        size++;
    }
    return size;
  };

  var obIx = function (obj, ix) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (size == ix)
          return key;
        size++;
      }
    }
    return false;
  };

  var keySort = function (a, b, d) {
    d = d !== null ? d : 1;
    if (a == b)
      return 0;
    return a > b ? 1 * d : -1 * d;
  };

  var KL = obLen(keys);

  if (!KL)
    return array.sort(keySort);

  for (var k in keys) {
    keys[k] =
      keys[k] == 'desc' || keys[k] == -1 ? -1
        : (keys[k] == 'skip' || keys[k] === 0 ? 0
          : 1);
  }

  array.sort(function (a, b) {
    var sorted = 0, ix = 0;

    while (sorted === 0 && ix < KL) {
      var k = obIx(keys, ix);
      if (k) {
        var dir = keys[k];
        sorted = keySort(a[k], b[k], dir);
        ix++;
      }
    }
    return sorted;
  });
  return array;
}