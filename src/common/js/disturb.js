export const disturb = function (arr) {
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
    newArr[i] = arr[i]
    let j = random(0, i)
    let temp = newArr[i]
    newArr[i] = newArr[j]
    newArr[j] = temp
  }
  return newArr
}

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}