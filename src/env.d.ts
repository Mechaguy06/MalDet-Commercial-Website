/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare module "react" {
  export = React;
  export as namespace React;
}

declare namespace React {
  type ReactNode = any;
  type FC<P = {}> = (props: P) => any;
  type MouseEvent<T = Element> = any;
  type FormEvent<T = Element> = any;
  interface CSSProperties {
    [key: string]: any;
  }
  function useState<T>(init: T | (() => T)): [T, (val: T | ((prev: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  function useRef<T>(init?: T): { current: T };
  function useMemo<T>(factory: () => T, deps?: any[]): T;
  function useCallback<T extends (...args: any[]) => any>(fn: T, deps?: any[]): T;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface Element extends React.ReactNode {}
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module "lenis" {
  export default class Lenis {
    constructor(options?: any);
    raf(time: number): void;
    destroy(): void;
  }
}

declare module "*.mp4" {
  const src: string;
  export default src;
}
