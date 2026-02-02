import * as Icons from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

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

export const App = () => {
  const pagesRef = useRef<HTMLDivElement>(null);
  const page0 = useRef<HTMLDivElement>(null);
  const page1 = useRef<HTMLDivElement>(null);
  const page2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pages = pagesRef.current;
    if (!pages) return;

    const handleScroll = () => {
      const scrollTop = pages.scrollTop;
      const pageHeight = pages.clientHeight;
      const currentPage = Math.round(scrollTop / pageHeight);

      // If we're on page 0 (one) or page 2 (three), jump to page 1 (two)
      if (currentPage === 0 || currentPage === 2) {
        page1.current?.scrollIntoView({ behavior: "instant" });
      }
    };

    pages.addEventListener("scrollend", handleScroll);
    return () => pages.removeEventListener("scrollend", handleScroll);
  }, []);

  // Initialize scroll position to "two" on mount
  useEffect(() => {
    page1.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  return (
    <div className="pages" ref={pagesRef}>
      <div className="page" ref={page0}>
        <Page>
          <canvas />
        </Page>
      </div>
      <div className="page" ref={page1}>
        <Page>
          <canvas />
        </Page>
      </div>
      <div className="page" ref={page2}>
        <Page>
          <canvas />
        </Page>
      </div>
    </div>
  );
};
