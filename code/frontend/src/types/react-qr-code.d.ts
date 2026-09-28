// react-qr-code ships its typings outside of its package.json "exports",
// so TypeScript's bundler resolution cannot find them.
declare module "react-qr-code" {
  import type { ComponentType, SVGProps } from "react";

  export interface QRCodeProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
    value: string;
    size?: number;
    level?: "L" | "M" | "Q" | "H";
    bgColor?: string;
    fgColor?: string;
    title?: string;
  }

  const QRCode: ComponentType<QRCodeProps>;
  export default QRCode;
}
