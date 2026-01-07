import React from "react";
import { type ThumbnailStyle } from "../assets/assets";
import {
  ChevronDownIcon,
  CpuIcon,
  ImageIcon,
  PenToolIcon,
  SparkleIcon,
  SquareIcon,
} from "lucide-react";

const StyleSelector = ({
  value,
  onChange,
  isOpen,
  setIsOpen,
}: {
  value: ThumbnailStyle;
  onChange: (style: ThumbnailStyle) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  // SAME objects (unchanged)
  const styleDescriptions: Record<ThumbnailStyle, string> = {
    "Bold & Graphic": "High contrast, bold typography, striking visuals",
    Minimalist: "Clean, simple, lots of white space",
    Photorealistic: "Photo-based, natural-looking",
    Illustrated: "Hand-drawn, artistic, creative",
    "Tech/Futuristic": "Modern, sleek, tech-inspired",
  };

  const styleIcons: Record<ThumbnailStyle, React.ReactNode> = {
    "Bold & Graphic": <SparkleIcon className="h-4 w-4" />,
    Minimalist: <SquareIcon className="h-4 w-4" />,
    Photorealistic: <ImageIcon className="h-4 w-4" />,
    Illustrated: <PenToolIcon className="h-4 w-4" />,
    "Tech/Futuristic": <CpuIcon className="h-4 w-4" />,
  };

  return (
    <div className="relative space-y-3 dark">
      <label className="block text-sm font-medium text-zinc-200">
        Thumbnail Style
      </label>

      {/* DROPDOWN BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition
                   bg-white/8 border-white/10 text-zinc-200 hover:bg-white/12"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-medium">
            {styleIcons[value]}
            <span>{value}</span>
          </div>
          <p className="text-xs text-zinc-400">
            {styleDescriptions[value]}
          </p>
        </div>

        <ChevronDownIcon
          className={`h-5 w-5 text-zinc-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10
                        bg-zinc-900/95 backdrop-blur shadow-xl">
          {(Object.keys(styleDescriptions) as ThumbnailStyle[]).map((style) => {
            const selected = value === style;

            return (
              <button
                key={style}
                type="button"
                onClick={() => {
                  onChange(style);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left transition first:rounded-t-xl last:rounded-b-xl
                  ${
                    selected
                      ? "bg-white/12"
                      : "hover:bg-white/10"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-zinc-200">
                    {styleIcons[style]}
                  </div>

                  <div>
                    <div className="font-medium text-zinc-100">
                      {style}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {styleDescriptions[style]}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StyleSelector;
