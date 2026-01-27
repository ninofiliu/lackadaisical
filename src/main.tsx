import "./main.css";

import {
  ALL_FORMATS,
  EncodedPacket,
  EncodedPacketSink,
  Input,
  UrlSource,
} from "mediabunny";

console.log("waiting for click");
await new Promise((r) => document.addEventListener("click", r, { once: true }));
console.log("clicked");

const audioContext = new AudioContext();
const audioResponse = await fetch("/baseline/DRGQ1VtCVz9.mp4");
const audioArrayBuffer = await audioResponse.arrayBuffer();
const audioBuffer = await audioContext.decodeAudioData(audioArrayBuffer);

let audioSource: AudioBufferSourceNode | null = null;
let audioStartTime = 0;
let audioStartOffset = 0;

function playAudioFrom(time: number) {
  if (audioSource) {
    audioSource.stop();
  }
  audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  audioSource.loop = true;
  audioSource.connect(audioContext.destination);
  audioSource.start(0, time);
  audioStartTime = audioContext.currentTime;
  audioStartOffset = time;
}

function getCurrentAudioTime() {
  if (!audioSource) return 0;
  return audioStartOffset + (audioContext.currentTime - audioStartTime);
}

playAudioFrom(0);

const input = new Input({
  formats: ALL_FORMATS,
  source: new UrlSource("/baseline/DRGQ1VtCVz9.mp4"),
});

const track = await input.getPrimaryVideoTrack();
if (!track) throw new Error("no track");

const decoderConfig = await track.getDecoderConfig();
if (!decoderConfig) throw new Error("can't decode");

// Collect all packets first
const sink = new EncodedPacketSink(track);
const pkts: EncodedPacket[] = [];
for await (const pkt of sink.packets()) {
  pkts.push(pkt);
}
console.log(`Collected ${pkts.length} packets`);

// Create canvas for output
const canvas = document.createElement("canvas");
canvas.width = decoderConfig.codedWidth!;
canvas.height = decoderConfig.codedHeight!;
document.body.append(canvas);
const ctx = canvas.getContext("2d")!;

// Decode packets and render to canvas in real-time
const decoder = new VideoDecoder({
  output: (frame) => {
    ctx.drawImage(frame, 0, 0);
    frame.close();
  },
  error: console.error,
});

decoder.configure(decoderConfig);

let i = 0;
const presses = {} as Record<string, boolean>;
window.addEventListener("keydown", (evt) => {
  presses[evt.key] = true;
});
window.addEventListener("keyup", (evt) => {
  presses[evt.key] = false;
});

while (true) {
  const pkti = ~~i % pkts.length;
  const pkt = pkts[pkti];

  const isMoshing = presses["p"] || presses["o"] || presses["u"];
  const desiredTime = ((i % pkts.length) / pkts.length) * audioBuffer.duration;
  if (isMoshing || pkti == 0) {
    playAudioFrom(desiredTime);
  }

  const chunk = new EncodedVideoChunk({
    type: pkt.type,
    timestamp: pkt.timestamp * 1_000_000,
    duration: pkt.duration * 1_000_000,
    data: pkt.data,
  });
  decoder.decode(chunk);
  const videoTime = ((i % pkts.length) / pkts.length) * audioBuffer.duration;
  const audioTime = getCurrentAudioTime();
  let timeout = pkt.duration;
  timeout -= audioTime - videoTime; // compensate for processing delay
  timeout = Math.max(timeout, 0); // clamp min for safety
  timeout = Math.min(timeout, 1 / 10); // clamp max just in case, like when audio loops
  console.log({ timeout });
  await new Promise((r) => setTimeout(r, timeout * 1000));

  if (presses["i"]) {
    i = 0;
  } else if (presses["p"]) {
    i += 0;
  } else if (presses["o"]) {
    // i += incr;
    i += 0.25;
  } else if (presses["u"]) {
    i = Math.random() * pkts.length;
  } else {
    i++;
  }
}
