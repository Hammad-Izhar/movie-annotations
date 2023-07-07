const animals = [
  "alligator",
  "ant",
  "bear",
  "bee",
  "bird",
  "camel",
  "cat",
  "cheetah",
  "chicken",
  "chimpanzee",
  "cow",
  "crocodile",
  "deer",
  "dog",
  "dolphin",
  "duck",
  "eagle",
  "elephant",
  "fish",
  "fly",
  "fox",
  "frog",
  "giraffe",
  "goat",
  "goldfish",
  "hamster",
];

const adjectives = [
  "adorable",
  "adventurous",
  "aggressive",
  "agreeable",
  "alert",
  "alive",
  "amused",
  "angry",
  "annoyed",
  "bionic",
  "blue",
  "blushing",
  "bored",
  "brainy",
  "brave",
  "calm",
  "charming",
  "cheerful",
  "clean",
  "clever",
  "clumsy",
  "dazzling",
];

const fruits = [
  "apple",
  "apricot",
  "avocado",
  "banana",
  "blackberry",
  "blueberry",
  "cherry",
  "coconut",
  "cranberry",
  "grape",
  "grapefruit",
  "kiwi",
  "lemon",
  "lime",
  "mango",
  "melon",
  "orange",
  "papaya",
  "peach",
  "pear",
  "pineapple",
  "plum",
  "pomegranate",
  "raspberry",
];

const getRandom = (arr: string[]) => {
  return arr[Math.floor(Math.random() * arr.length)] ?? "";
};

export default function generateRoomCode() {
  return `${getRandom(adjectives)}-${getRandom(fruits)}-${getRandom(animals)}`;
}
