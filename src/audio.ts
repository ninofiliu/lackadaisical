const ac = new AudioContext();

const osc = ac.createOscillator();
osc.frequency.value = 440;
osc.type = "sawtooth";

const gain = ac.createGain();
gain.gain.value = 0.2;

osc.connect(gain);
gain.connect(ac.destination);

const audio = document.createElement("audio");
audio.src = "/baseline/DO3RPmfDbil.mp4";
audio.controls = true;
document.body.append(audio);

audio.addEventListener("play", async () => {
  if (ac.state === "suspended") {
    await ac.resume();
  }
  osc.start();
  osc.stop(ac.currentTime + 2);
  setTimeout(() => {
    audio.remove();
  }, 1000);
});
