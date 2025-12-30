const linearProgress = document.getElementById("linearProgress");
const binaryProgress = document.getElementById("binaryProgress");

const baseNames = [
  "alex","ana","andrei","bianca","bogdan","calin","claudia","cristina",
  "dan","daria","dragos","elena","florin","gabriel","george","ioana",
  "laura","mihai","nicoleta","paul","rares","roxana","sebastian",
  "teodora","valentin","vlad"
];

const database = [];
for (let i = 0; i < 8; i++) {
  database.push(...baseNames);
}
database.sort();

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function linearSearch(arr, target) {
  linearProgress.value = 0;

  for (let i = 0; i < arr.length; i++) {
    linearProgress.value = ((i + 1) / arr.length) * 100;

    if (arr[i] === target) {
      return i;
    }

    await sleep(150);
  }

  return -1;
}

async function binarySearch(arr, target) {
  binaryProgress.value = 0;

  let low = 0;
  let high = arr.length - 1;
  let steps = 0;
  const maxSteps = Math.ceil(Math.log2(arr.length));

  while (low <= high) {
    steps++;
    binaryProgress.value = (steps / maxSteps) * 100;

    const mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }

    await sleep(150);
  }

  return -1;
}

function start() {
  const input = document.getElementById("name-input");
  const target = input.value.toLowerCase();
  linearSearch(database, target);
  binarySearch(database, target);
}