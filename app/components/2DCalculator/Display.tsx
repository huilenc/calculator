import { useEffect, useRef } from "react";

interface DisplayProps {
  input: string;
  isOn: boolean;
  className?: string;
  width: number;
  height: number;
}

export const Display = ({
  input,
  isOn,
  className,
  width,
  height,
}: DisplayProps) => {
  const displayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const display = displayRef.current;
    if (!display) return;

    display.scrollLeft = display.scrollWidth;
  }, [input]);

  return (
    <div
      data-calc-display
      ref={displayRef}
      className={`${!isOn && "brightness-50"} ${className} flex overflow-x-scroll scroll-m-2 items-center pr-2 w-[${width}%] h-[${height}%] font-bold text-6xl relative rounded-xl outline-none scrollbar`}
    >
      <span className="font-calc inline-block tracking-widest min-w-full whitespace-nowrap text-right text-5xl">
        {input}
      </span>
    </div>
  );
};
