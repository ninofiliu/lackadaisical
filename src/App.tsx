import { useEffect, useRef } from "react";

const Page = () => {
  return <>PAGE</>;
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
        <Page />
      </div>
      <div className="page" ref={page1}>
        <Page />
      </div>
      <div className="page" ref={page2}>
        <Page />
      </div>
    </div>
  );
};
