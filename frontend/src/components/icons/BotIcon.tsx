import React from "react";
import { cn } from "@/lib/utils";

interface BotIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

/**
 * BotIcon renders the public /bot.svg via CSS mask so it can be tinted with currentColor.
 * Use text-* classes to set the color, e.g., text-primary, text-accent.
 */
const BotIcon: React.FC<BotIconProps> = ({ className, size = 32, style, ...props }) => {
  const dimension = typeof size === "number" ? `${size}px` : size;
  return (
    <div
      aria-hidden
      {...props}
      className={cn("inline-block align-middle", className)}
      style={{
        width: dimension,
        height: dimension,
        backgroundColor: "currentColor",
        WebkitMaskImage: "url(/bot.svg)",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        WebkitMaskPosition: "center",
        maskImage: "url(/bot.svg)",
        maskRepeat: "no-repeat",
        maskSize: "contain",
        maskPosition: "center",
        filter: "drop-shadow(0 0 6px currentColor)",
        ...style,
      }}
    />
  );
};

export default BotIcon;
