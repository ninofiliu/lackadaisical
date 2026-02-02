import * as Icons from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { loadReel } from "./lib";
import { x } from "./utils";

const Page = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
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

  const start = async () => {
    setLoading(true);

    const reels = await Promise.all([
      // loadReel("/baseline/DO3RPmfDbil.mp4"),
      loadReel("/baseline/DOBhidykflW.mp4"),
      loadReel("/baseline/DQyZMfNEQcp.mp4"),
      loadReel("/baseline/DRGQ1VtCVz9.mp4"),
      loadReel("/baseline/DS-wBdykZl3.mp4"),
      loadReel("/baseline/DS40mFFk7r3.mp4"),
      loadReel("/baseline/DSk0qzKDNKr.mp4"),
      loadReel("/baseline/DSqfDyMCTHi.mp4"),
      loadReel("/baseline/DSZZnKRjW7q.mp4"),
      loadReel("/baseline/DT_LSrRj06G.mp4"),
      loadReel("/baseline/DTEH6tViUOs.mp4"),
      loadReel("/baseline/DTzFEugEw9z.mp4"),
      loadReel("/baseline/DTzIp7okWks.mp4"),
    ]);
    console.log("loaded reels");

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
    decoder.configure(reels[0].decoderConfig);

    let i = 0;
    let reeli = 0;
    const presses = {} as Record<string, boolean>;
    window.addEventListener("keydown", (evt) => {
      presses[evt.key] = true;
      if (evt.key === "y") {
        reels[reeli].stopAudio();
        reeli = (reeli + 1) % reels.length;
        i = 0;
        reels[reeli].playAudioFrom(0);
      }
    });
    window.addEventListener("keyup", (evt) => {
      presses[evt.key] = false;
    });

    setRunning(true);

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
  };

  return (
    <>
      <div className="pages" ref={pagesRef}>
        <div className="page" ref={page0}>
          <Page>
            <canvas ref={canvas0} width={width} height={height} />
          </Page>
        </div>
        <div className="page" ref={page1}>
          <Page>
            <canvas ref={canvas1} width={width} height={height} />
          </Page>
        </div>
        <div className="page" ref={page2}>
          <Page>
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
