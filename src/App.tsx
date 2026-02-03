import * as Icons from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { loadReel, type Reel } from "./lib";
import { x } from "./utils";

const Page = ({
  children,
  onSlow,
  onPause,
  onFast,
  onReset,
}: {
  children: ReactNode;
  onSlow: () => unknown;
  onPause: () => unknown;
  onFast: () => unknown;
  onReset: () => unknown;
}) => {
  const handle =
    (handler: () => unknown) => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      handler();
    };

  return (
    <>
      {children}
      <div
        className="panel-controls"
        onDoubleClick={() => {
          // TODO like
        }}
      >
        <div
          onMouseDown={handle(onSlow)}
          onMouseUp={handle(onReset)}
          onTouchStart={handle(onSlow)}
          onTouchEnd={handle(onReset)}
        >
          <Icons.Rewind size={36} strokeWidth={1} />
        </div>
        <div
          onMouseDown={handle(onPause)}
          onMouseUp={handle(onReset)}
          onTouchStart={handle(onPause)}
          onTouchEnd={handle(onReset)}
        >
          <Icons.Pause size={36} strokeWidth={1} />
        </div>
        <div
          onMouseDown={handle(onFast)}
          onMouseUp={handle(onReset)}
          onTouchStart={handle(onFast)}
          onTouchEnd={handle(onReset)}
        >
          <Icons.FastForward size={36} strokeWidth={1} />
        </div>
      </div>
      <div className="overlay">
        <div className="description">
          <div className="desc-header">
            <img src="//placekittens.com/100/100" />
            <span>nino.filiu</span>
            <button>Follow</button>
          </div>
          <div className="desc-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
            ullam maxime commodi reiciendis. Quos mollitia tenetur officiis
          </div>
        </div>
        <div className="icons">
          <div className="icon-button">
            <Icons.Heart size={36} strokeWidth={1} />
            <span>3.5M</span>
          </div>
          <div className="icon-button">
            <Icons.MessageCircle size={36} strokeWidth={1} />
            <span>69K</span>
          </div>
          <div className="icon-button">
            <Icons.Repeat size={36} strokeWidth={1} />
            <span>6.7K</span>
          </div>
          <div className="icon-button">
            <Icons.Send size={36} strokeWidth={1} />
            <span>420K</span>
          </div>
        </div>
      </div>
    </>
  );
};

const width = 1080;
const height = 1920;

export const App = () => {
  // SHARED
  const reelsi = useRef(0);
  const reels = useRef<Reel[]>([]);
  const frame = useRef(0);

  // INFINITE SCROLL
  const pagesRef = useRef<HTMLDivElement>(null);
  const page0 = useRef<HTMLDivElement>(null);
  const page1 = useRef<HTMLDivElement>(null);
  const page2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pages = pagesRef.current;
    if (!pages) return;

    const handleScroll = () => {
      const currentPage = Math.round(pages.scrollTop / pages.clientHeight);
      if (currentPage === 0 || currentPage === 2) {
        page1.current?.scrollIntoView({ behavior: "instant" });

        reels.current[reelsi.current].stopAudio();
        reelsi.current = (reelsi.current + 1) % reels.current.length;
        frame.current = 0;
        reels.current[reelsi.current].playAudioFrom(0);
      }
    };

    pages.addEventListener("scrollend", handleScroll, { passive: true });
    return () => pages.removeEventListener("scrollend", handleScroll);
  }, []);

  // Initialize scroll position to "two" on mount
  useEffect(() => {
    page1.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  // VIDEOS
  const canvas0 = useRef<HTMLCanvasElement>(null);
  const canvas1 = useRef<HTMLCanvasElement>(null);
  const canvas2 = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const speed = useRef<"normal" | "slow" | "pause" | "fast">("normal");

  const start = async () => {
    setLoading(true);

    reels.current = await Promise.all([
      // loadReel("/baseline/DO3RPmfDbil.mp4"),
      loadReel("/baseline/DOBhidykflW.mp4"),
      loadReel("/baseline/DQyZMfNEQcp.mp4"),
      loadReel("/baseline/DRGQ1VtCVz9.mp4"),
      // loadReel("/baseline/DS-wBdykZl3.mp4"),
      // loadReel("/baseline/DS40mFFk7r3.mp4"),
      // loadReel("/baseline/DSk0qzKDNKr.mp4"),
      // loadReel("/baseline/DSqfDyMCTHi.mp4"),
      // loadReel("/baseline/DSZZnKRjW7q.mp4"),
      // loadReel("/baseline/DT_LSrRj06G.mp4"),
      // loadReel("/baseline/DTEH6tViUOs.mp4"),
      // loadReel("/baseline/DTzFEugEw9z.mp4"),
      // loadReel("/baseline/DTzIp7okWks.mp4"),
    ]);

    // Decode packets and render to canvas in real-time
    const ctx0 = x(x(canvas0.current).getContext("2d"));
    const ctx1 = x(x(canvas1.current).getContext("2d"));
    const ctx2 = x(x(canvas2.current).getContext("2d"));
    const decoder = new VideoDecoder({
      output: (frame) => {
        const pages = x(pagesRef.current);
        const scroll = pages.scrollTop / pages.clientHeight;
        if (scroll < 0.99) ctx0.drawImage(frame, 0, 0);
        ctx1.drawImage(frame, 0, 0);
        if (scroll > 1.01) ctx2.drawImage(frame, 0, 0);
        frame.close();
      },
      error: console.error,
    });
    decoder.configure(reels.current[0].decoderConfig);

    setRunning(true);

    reels.current[reelsi.current].playAudioFrom(0);
    while (true) {
      const reel = reels.current[reelsi.current];

      const { timeout, chunk } = await reel.render(
        frame.current,
        speed.current !== "normal",
      );
      decoder.decode(chunk);
      await new Promise((r) => setTimeout(r, timeout * 1000));

      switch (speed.current) {
        case "normal":
          frame.current++;
          break;
        case "slow":
          frame.current += 0.25;
          break;
        case "pause":
          break;
        case "fast":
          frame.current = Math.random() * reel.length;
          break;
      }
    }
  };

  return (
    <>
      <div className="pages" ref={pagesRef}>
        <div className="page" ref={page0}>
          <Page
            onSlow={() => (speed.current = "slow")}
            onPause={() => (speed.current = "pause")}
            onFast={() => (speed.current = "fast")}
            onReset={() => (speed.current = "normal")}
          >
            <canvas ref={canvas0} width={width} height={height} />
          </Page>
        </div>
        <div className="page" ref={page1}>
          <Page
            onSlow={() => (speed.current = "slow")}
            onPause={() => (speed.current = "pause")}
            onFast={() => (speed.current = "fast")}
            onReset={() => (speed.current = "normal")}
          >
            <canvas ref={canvas1} width={width} height={height} />
          </Page>
        </div>
        <div className="page" ref={page2}>
          <Page
            onSlow={() => (speed.current = "slow")}
            onPause={() => (speed.current = "pause")}
            onFast={() => (speed.current = "fast")}
            onReset={() => (speed.current = "normal")}
          >
            <canvas ref={canvas2} width={width} height={height} />
          </Page>
        </div>
      </div>
      {!running && (
        <div className="start-overlay">
          <button disabled={loading} onClick={start}>
            Start
          </button>
        </div>
      )}
    </>
  );
};
