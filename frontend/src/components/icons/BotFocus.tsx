import React from "react";
import { cn } from "@/lib/utils";

interface BotFocusProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * BotFocus provides a consistent high-contrast backdrop and border for the bot icon.
 * It improves visibility on glass/gradient backgrounds. Place BotIcon inside.
 */
const BotFocus: React.FC<BotFocusProps> = ({ className, children, ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        "relative inline-flex items-center justify-center p-1.5 rounded-lg bg-primary/15 border border-primary/30 transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
};

export default BotFocus;
