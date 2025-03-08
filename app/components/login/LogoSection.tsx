import { LogoIcon } from "@/shared/ui/icons";

export const LogoSection: React.FC<{ size?: number; className?: string }> = ({
  size = 70,
  className = "absolute left-0 top-0 p-6",
}) => {
  return (
    <div className={className}>
      <LogoIcon width={size} height={size} />
    </div>
  );
};
