// randomly shuffle array using fischer-yates algorithm
// accepts parameters [] and [].length respectively
const shuffle = (arr, n) => {
    let copy = arr;
    if (n < 2) return copy; // n is equal to arr.length so stop iterating when reaching the last index in the sequence
    let i = n - 1;
    let temp; // temporary variable to use when swapping
    let random = Math.floor(Math.random() * (i + 1));
    temp = copy[random];
    copy[random] = copy[i];
    copy[i] = temp;
    shuffle(copy, n - 1);
    return copy;
}

module.exports = shuffle;