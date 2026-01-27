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

const reels = await Promise.all([
  loadReel("/baseline/DTzIp7okWks.mp4"),
  loadReel("/baseline/DRGQ1VtCVz9.mp4"),
]);

console.log(reels);

// Decode packets and render to canvas in real-time
const decoder = new VideoDecoder({
  output: (frame) => {
    ctx.drawImage(frame, 0, 0);
    frame.close();
  },
  error: console.error,
});
decoder.configure(reels[0].decoderConfig);

let i = 0;
let reeli = 0;
const presses = {} as Record<string, boolean>;
window.addEventListener("keydown", (evt) => {
  presses[evt.key] = true;
  if (evt.key === "y") {
    reeli = (reeli + 1) % 2;
  }
});
window.addEventListener("keyup", (evt) => {
  presses[evt.key] = false;
});

reels[reeli].playAudioFrom(0);
while (true) {
  const isMoshing = presses["p"] || presses["o"] || presses["u"];
  const reel = reels[reeli];

  const { timeout, chunk } = await reel.render(i, isMoshing);
  decoder.decode(chunk);

  await new Promise((r) => setTimeout(r, timeout * 1000));

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
