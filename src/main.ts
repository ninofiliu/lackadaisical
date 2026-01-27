import { loadReel } from "./lib";
import "./main.css";

const width = 1080;
const height = 1920;

console.log("waiting for click");
await new Promise((r) => document.addEventListener("click", r, { once: true }));
console.log("clicked");

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
document.body.append(canvas);
const ctx = canvas.getContext("2d")!;

const reel = await loadReel("/baseline/DRGQ1VtCVz9.mp4", ctx);

let i = 0;
const presses = {} as Record<string, boolean>;
window.addEventListener("keydown", (evt) => {
  presses[evt.key] = true;
});
window.addEventListener("keyup", (evt) => {
  presses[evt.key] = false;
});

while (true) {
  const isMoshing = presses["p"] || presses["o"] || presses["u"];

  await reel.render(i, isMoshing);

  if (presses["i"]) {
    i = 0;
  } else if (presses["p"]) {
    i += 0;
  } else if (presses["o"]) {
    // i += incr;
    i += 0.25;
  } else if (presses["u"]) {
    i = Math.random() * reel.length;
  } else {
    i++;
  }
}
