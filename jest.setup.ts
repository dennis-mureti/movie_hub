"use client";

import React from "react";
import "@testing-library/jest-dom";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: {},
      asPath: "",
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => Promise.resolve()),
    };
  },
}));

// Mock next/head
jest.mock("next/head", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => {
    children;
  },
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    fill,
    className,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    blurDataURL?: string;
    placeholder?: string;
    fill?: boolean;
  }) => {
    // Remove any invalid or unneeded props that might cause issues in tests
    const { blurDataURL, placeholder, ...validProps } = props;

    // Handle the fill prop by applying appropriate styles
    const style = fill
      ? { position: "absolute", height: "100%", width: "100%", ...props.style }
      : props.style;

    return React.createElement("img", {
      ...validProps,
      src: src,
      alt: alt,
      width: fill ? undefined : width,
      height: fill ? undefined : height,
      className: className,
      style: style,
      // Remove the fill prop to prevent React warnings
      fill: undefined,
    });
  },
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
    systemTheme: "light",
    themes: ["light", "dark"],
  }),
}));
