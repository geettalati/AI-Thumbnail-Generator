import React from "react";
import { type ThumbnailStyle } from "../assets/assets";
import {
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
  // SAME objects you wrote
  const styleDescriptions: Record<ThumbnailStyle, string> = {
    "Bold & Graphic": "High contrast, bold typography, striking visuals",
    Minimalist: "Clean, simple, lots of white space",
    Photorealistic: "Photo-based, natural-looking",
    Illustrated: "Hand-drawn, artistic, creative",
    "Tech/Futuristic": "Modern, sleek, tech-inspired",
  };

  const styleIcons: Record<ThumbnailStyle, React.ReactNode> = {
    "Bold & Graphic": <SparkleIcon className="h-5 w-5" />,
    Minimalist: <SquareIcon className="h-5 w-5" />,
    Photorealistic: <ImageIcon className="h-5 w-5" />,
    Illustrated: <PenToolIcon className="h-5 w-5" />,
    "Tech/Futuristic": <CpuIcon className="h-5 w-5" />,
  };

  return (
    <div className="space-y-3 dark">
      <label className="block text-sm font-medium text-zinc-200">
        Thumbnail Style
      </label>

      {/* CARD LIST (matches FIRST image) */}
      <div className="space-y-2">
        {(Object.keys(styleDescriptions) as ThumbnailStyle[]).map((style) => {
          const selected = value === style;

          return (
            <button
              key={style}
              type="button"
              onClick={() => onChange(style)}
              className={`
                w-full rounded-xl border px-4 py-3 text-left transition
                ${
                  selected
                    ? "bg-white/12 border-white/20"
                    : "bg-white/6 border-white/10 hover:bg-white/10"
                }
              `}
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
    </div>
  );
};

export default StyleSelector;
