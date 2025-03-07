"use client";

import { LogoIcon } from "@/shared/ui/logoIcons";

export const LogoSection: React.FC<{ className?: string }> = ({
  className = "absolute left-0 top-0 p-6",
}) => {
  return (
    <div className={className}>
      <LogoIcon />
    </div>
  );
};
