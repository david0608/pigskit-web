export const sort = ({
    arr = [],
    getKey = e => e
}) => quickSort(arr, 0, arr.length - 1, getKey)

function quickSort(arr, s, e, getKey) {
    let p = e
    let i = s
    let j = p - 1
    if (i <= j) {
        while (i < j) {
            while (i < j && getKey(arr[i]) <= getKey(arr[p])) {
                i++
            }
            while (i < j && getKey(arr[j]) >= getKey(arr[p])) {
                j--
            }
            let temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
        if (getKey(arr[i]) > getKey(arr[p])) {
            let temp = arr[i]
            arr[i] = arr[p]
            arr[p] = temp
            p = i
        }
        quickSort(arr, s, p - 1, getKey)
        quickSort(arr, p + 1, e, getKey)
    }
}