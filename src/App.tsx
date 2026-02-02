import * as Icons from "lucide-react";
import { type MouseEventHandler, type ReactNode } from "react";

const ButtonIcon = ({
  children,
  onClick,
  text,
}: {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
}) => (
  <button
    style={{
      border: "none",
      background: "transparent",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
    }}
    onClick={onClick}
  >
    {children}
    <span>{text}</span>
  </button>
);

export const App = () => {
  return (
    <>
      <canvas></canvas>
      <div
        style={{
          position: "fixed",
          right: 0,
          bottom: 0,
          width: 96,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: 16,
        }}
      >
        <ButtonIcon onClick={() => {}} text="3.2M">
          <Icons.Heart size={36} strokeWidth={1} />
        </ButtonIcon>
        <ButtonIcon onClick={() => {}} text="48K">
          <Icons.MessageCircle size={36} strokeWidth={1} />
        </ButtonIcon>
        <ButtonIcon onClick={() => {}} text="6.7K">
          <Icons.Repeat size={36} strokeWidth={1} />
        </ButtonIcon>
        <ButtonIcon onClick={() => {}} text="420K">
          <Icons.Send size={36} strokeWidth={1} />
        </ButtonIcon>
      </div>
      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "calc(100vw - 96px)",
          padding: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src="https://placekittens.com/200/200"
            style={{ width: 64, borderRadius: "50%" }}
          />
          <span style={{ fontWeight: "bold" }}>nino.filiu</span>
          <button
            style={{
              background: "transparent",
              border: "1px solid white",
              borderRadius: 8,
              padding: "4px 8px",
              font: "inherit",
            }}
          >
            Follow back
          </button>
        </div>
        <div>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut incidunt
          ipsum consequatur! Ut aliquam provident culpa perferendis distinctio
          autem quia soluta beatae unde, sit eos? Reprehenderit dolorem veniam
          nihil hic.Ut aliquam provident culpa perferendis distinctio autem quia
          soluta beatae unde, sit eos? Reprehenderit dolorem veniam nihil hic.
        </div>
      </div>
    </>
  );
};
