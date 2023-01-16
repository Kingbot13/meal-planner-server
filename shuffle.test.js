const shuffle = require('./shuffle');

describe("randomly shuffles array", () => {
    let arr = [1,2,3,4,5,6,7,8,9];
    let copy = [...arr];

    test("shuffles array and doesn't change array length", () => {

        expect(shuffle(copy, arr.length)).not.toEqual(arr);
        shuffle(copy, copy.length);
        expect(copy.length).toEqual(arr.length);
    });

    test("contains the same elements", () => {
        shuffle(copy, copy.length);
        copy.sort();
        expect(copy).toEqual(arr);
    });

})