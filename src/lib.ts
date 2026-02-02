import "./main.css";

import {
  ALL_FORMATS,
  EncodedPacket,
  EncodedPacketSink,
  Input,
  UrlSource,
} from "mediabunny";

export const loadReel = async (path: string) => {
  const audioContext = new AudioContext();
  const audioResponse = await fetch(path);
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

  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(path),
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

  const render = async (i: number, isMoshing: boolean) => {
    const pkti = ~~i % pkts.length;
    const pkt = pkts[pkti];

    const desiredTime =
      ((i % pkts.length) / pkts.length) * audioBuffer.duration;
    if (isMoshing || pkti == 0) {
      playAudioFrom(desiredTime);
    }

    const chunk = new EncodedVideoChunk({
      type: pkt.type,
      timestamp: pkt.timestamp * 1_000_000,
      duration: pkt.duration * 1_000_000,
      data: pkt.data,
    });
    const videoTime = ((i % pkts.length) / pkts.length) * audioBuffer.duration;
    const audioTime = getCurrentAudioTime();
    let timeout = pkt.duration;
    timeout -= audioTime - videoTime; // compensate for processing delay
    timeout = Math.max(timeout, 0); // clamp min for safety
    timeout = Math.min(timeout, 1 / 10); // clamp max just in case, like when audio loops

    return { timeout, chunk };
  };

  return {
    stopAudio: () => {
      audioSource?.stop();
    },
    playAudioFrom,
    render,
    length: pkts.length,
    decoderConfig,
  };
};
