import type { CSSProperties, ReactNode } from "react";
import { FaChevronLeft, FaChevronRight, FaXmark } from "react-icons/fa6";

import { cn } from "@/lib/utils";

type CSSNChild = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

// Main wrapper component
const Browser = ({ className, style, children }: CSSNChild) => {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border-2 border-black bg-gray-200 shadow-full",
        className
      )}
      style={
        {
          "--bs-offset-x": "8px",
          "--bs-offset-y": "8px",
          "--tw-shadow-color": "black",
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
};

// Header portion of <Browser />
const Header = ({ className, style, children }: CSSNChild) => {
  return (
    <div
      className={cn(
        "grid auto-cols-auto grid-flow-col grid-cols-[max-content_1fr] items-center gap-x-4 border-b-2 border-black bg-white p-2",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

// Sits in the 1st slot of <Header /> grid layout
type TLNoAction = { withAction: false };
type TLAction = {
  withAction: true;
  redAction: () => void;
  yellowAction: () => void;
  greenAction: () => void;
};
type TLProps = {
  size?: number;
  withSymbols?: boolean;
  disabled?: boolean;
} & (TLNoAction | TLAction);

const TrafficLights = ({
  size = 16,
  withSymbols = false,
  disabled = false,
  ...rest
}: TLProps) => {
  const redChild = withSymbols ? (
    <FaXmark className="d-full pointer-events-none" />
  ) : null;
  const yellowChild = withSymbols ? (
    <FaChevronLeft className="d-full pointer-events-none" />
  ) : null;
  const greenChild = withSymbols ? (
    <FaChevronRight className="d-full pointer-events-none" />
  ) : null;

  const btnClass =
    "flex h-[var(--size)] w-[var(--size)] items-center justify-center rounded-full border border-black p-1 shadow-full";
  const btnAnimClass =
    "bg-opacity-75 transition duration-300 enabled:hover:bg-opacity-100 disabled:bg-opacity-50 disabled:text-opacity-75";

  return (
    <div
      className="col-start-1 flex gap-2"
      style={
        {
          "--size": `${size}px`,
          "--bs-offset-x": "2px",
          "--bs-offset-y": "2px",
          "--tw-shadow-color": "black",
        } as CSSProperties
      }
    >
      {rest.withAction ? (
        <>
          <button
            className={cn(btnClass, btnAnimClass, "bg-red-500")}
            onClick={rest.redAction}
            disabled={disabled}
          >
            {redChild}
          </button>
          <button
            className={cn(btnClass, btnAnimClass, "bg-yellow-500")}
            onClick={rest.yellowAction}
            disabled={disabled}
          >
            {yellowChild}
          </button>
          <button
            className={cn(btnClass, btnAnimClass, "bg-green-500")}
            onClick={rest.greenAction}
            disabled={disabled}
          >
            {greenChild}
          </button>
        </>
      ) : (
        <>
          <span
            className={cn(
              btnClass,
              { "bg-opacity-50 text-opacity-75": disabled },
              "bg-red-500"
            )}
          >
            {redChild}
          </span>
          <span
            className={cn(
              btnClass,
              { "bg-opacity-50 text-opacity-75": disabled },
              "bg-yellow-500"
            )}
          >
            {yellowChild}
          </span>
          <span
            className={cn(
              btnClass,
              { "bg-opacity-50 text-opacity-75": disabled },
              "bg-green-500"
            )}
          >
            {greenChild}
          </span>
        </>
      )}
    </div>
  );
};

// Sits in the 2nd slot of <Header /> grid layout
const SearchBar = ({ className, style, children }: CSSNChild) => {
  return (
    <div
      className={cn(
        "col-start-2 w-full max-w-lg justify-self-center rounded-md border-2 border-black bg-white px-2 py-1",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

// Component to help organize <Browser /> children
const Content = ({ className, style, children }: CSSNChild) => {
  return (
    <div
      className={cn("flex h-full flex-col overflow-y-auto", className)}
      style={style}
    >
      {children}
    </div>
  );
};

Browser.Header = Header;
Browser.TrafficLights = TrafficLights;
Browser.SearchBar = SearchBar;
Browser.Content = Content;

export default Browser;
