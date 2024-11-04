import React from "react";

interface IconProps {
  className?: string;
}

const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({
  className,
  children,
}) => <div className={className}>{children}</div>;

export const EthereumIcon: React.FC<IconProps> = ({ className }) => (
  <Icon className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 12l10 10 10-10L12 2z" />
      <path d="M12 22v-6.5" />
      <path d="M12 2v6.5" />
      <path d="M4.5 10L12 5.5 19.5 10" />
    </svg>
  </Icon>
);

export const BaseIcon: React.FC<IconProps> = ({ className }) => (
  <Icon className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 8l-4 4 4 4 4-4-4-4z" />
    </svg>
  </Icon>
);

export const ZkSyncIcon: React.FC<IconProps> = ({ className }) => (
  <Icon className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  </Icon>
);

export const ScrollIcon: React.FC<IconProps> = ({ className }) => (
  <Icon className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  </Icon>
);

export const LineaIcon: React.FC<IconProps> = ({ className }) => (
  <Icon className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  </Icon>
);

export const chainIcons = {
  eth: EthereumIcon,
  base: BaseIcon,
  zksync: ZkSyncIcon,
  scroll: ScrollIcon,
  linea: LineaIcon,
} as const;

export const chainColors = {
  eth: "text-blue-500",
  base: "text-blue-400",
  zksync: "text-purple-500",
  scroll: "text-green-500",
  linea: "text-indigo-500",
} as const;

export type ChainType = keyof typeof chainIcons;
