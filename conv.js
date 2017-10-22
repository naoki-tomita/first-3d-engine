const fs = require("fs");

const data = fs.readFileSync("./Cup.x", "utf8");
const lines = data.split("\n");
const max = lines.length;
let i = 0;

const vertics = [];
const faces = [];

const regexVertics = /(.+);(.+);(.+);,/;
const regexFaces4 = /(.+);(.+),(.+),(.+),(.+);,/;
const regexFaces3 = /(.+);(.+),(.+),(.+);,/;


// vertics
while (true) {
  if (i > max) {
    break;
  }
  if (lines[i].includes("faces")) {
    break;
  }
  const match = regexVertics.exec(lines[i]);
  i++;
  if (!match) {
    continue;
  }
  const x = match[1];
  const y = match[2];
  const z = match[3];
  vertics.push({
    x: Number.parseFloat(x),
    y: Number.parseFloat(y),
    z: Number.parseFloat(z),
  });
}
console.log(vertics);

while(true) {
  if (i > max) {
    break;
  }
  let match = regexFaces4.exec(lines[i]);
  if (!match) {
    match = regexFaces3.exec(lines[i]);
  }
  i++;
  if (!match) {
    continue;
  }

  if (match[1].trim() === "4") {
    // 4
    faces.push([
      Number.parseInt(match[2], 10),
      Number.parseInt(match[3], 10),
      Number.parseInt(match[4], 10),
    ]);
    faces.push([
      Number.parseInt(match[4], 10),
      Number.parseInt(match[5], 10),
      Number.parseInt(match[2], 10),
    ]);
  } else if (match[1].trim() === "3") {
    // 3
    faces.push([
      Number.parseInt(match[2], 10),
      Number.parseInt(match[3], 10),
      Number.parseInt(match[4], 10),
    ]);
  }
}

const obj = {
  vertics: vertics,
  faces: faces,
};

fs.writeFileSync("./Cup.json", JSON.stringify(obj));