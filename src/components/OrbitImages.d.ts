declare module "@/components/OrbitImages" {
  import { ComponentType, ReactNode } from "react";
  const OrbitImages: ComponentType<{
    images?: string[];
    altPrefix?: string;
    shape?: "ellipse" | "circle" | "square" | "rectangle" | "triangle" | "star" | "heart" | "infinity" | "wave" | "custom";
    customPath?: string;
    baseWidth?: number;
    radiusX?: number;
    radiusY?: number;
    radius?: number;
    starPoints?: number;
    starInnerRatio?: number;
    rotation?: number;
    duration?: number;
    itemSize?: number;
    direction?: "normal" | "reverse";
    fill?: boolean;
    width?: number | string;
    height?: number | string;
    className?: string;
    showPath?: boolean;
    pathColor?: string;
    pathWidth?: number;
    easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
    paused?: boolean;
    centerContent?: ReactNode;
    responsive?: boolean;
  }>;
  export default OrbitImages;
}
