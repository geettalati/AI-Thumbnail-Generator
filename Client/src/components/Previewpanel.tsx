import React from 'react'
import type { AspectRatio, IThumbnail } from '../assets/assets'
import { DownloadIcon, ImageIcon, Loader2Icon } from 'lucide-react';

const Previewpanel = ({
  thumbnail,
  isLoading,
  aspectRatio
}: {
  thumbnail: IThumbnail | null;
  isLoading: boolean;
  aspectRatio: AspectRatio;
}) => {

  const aspectclasses = {
    '16:9': 'aspect-video',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]',
  } as Record<AspectRatio, string>;

  const ondownload = () => {
    if(!thumbnail?.image_url) return;
    const link = document.createElement('a');
    link.href = thumbnail?.image_url.replace('/upload','/upload/fl_attachment/');
    document.body.appendChild(link); 
    link.click();
    link.remove();
  }

  return (
    // OUTER FRAME (this creates the "card within card" effect)
    <div className="mx-auto w-full max-w-[560px] rounded-xl bg-black/20 p-4">

      {/* PREVIEW MASK (controls aspect ratio + clipping) */}
      <div
        className={`relative w-full overflow-hidden rounded-lg ${aspectclasses[aspectRatio]}`}
      >

        {/* ---------------- LOADING STATE ---------------- */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/60">
            <Loader2Icon className="size-8 animate-spin text-white" />
            <div className="text-center">
              <p className="text-sm font-medium text-white">
                AI is generating your Thumbnail
              </p>
              <p className="mt-1 text-xs text-white/70">
                This may take 10–20 seconds
              </p>
            </div>
          </div>
        )}

        {/* ---------------- IMAGE PREVIEW ---------------- */}
        {!isLoading && thumbnail?.image_url && (
          <div className="group relative h-full w-full">

            {/* IMAGE */}
            <img
              src={thumbnail.image_url}
              alt={thumbnail.title}
              className="h-full w-full object-cover"
            />

            {/* HOVER OVERLAY */}
            <div className="absolute inset-0 z-10 flex items-end justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">

              {/* DOWNLOAD BUTTON (CLEAR & VISIBLE) */}
              <button
                type="button"
                className="mb-4 flex items-center gap-2 rounded-md bg-black/80 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur hover:bg-black"
              >
                <DownloadIcon className="size-4" />
                Download Thumbnail
              </button>

            </div>
          </div>
        )}

        {/* ---------------- EMPTY STATE ---------------- */}
        {!isLoading && !thumbnail?.image_url && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/20 bg-black/30 rounded-lg">
            <div className="hidden sm:flex size-20 items-center justify-center rounded-full bg-white/10">
              <ImageIcon className="size-10 text-white/50" />
            </div>
            <div className="text-center">
              <p className="text-sm text-white">
                Generate your first thumbnail
              </p>
              <p className="mt-1 text-xs text-white/60">
                Fill out the form and click Generate
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Previewpanel;
