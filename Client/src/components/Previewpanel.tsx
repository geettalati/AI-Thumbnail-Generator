import React from 'react'
import type { AspectRatio, IThumbnail } from '../assets/assets'
import { div } from 'motion/react-client';
import { DownloadIcon, Loader2Icon } from 'lucide-react';

const Previewpanel = ({thumbnail , isLoading , aspectRatio} : {thumbnail:IThumbnail , isLoading:boolean;aspectRatio:AspectRatio } ) => {

    const aspectclasses = {
        '16:9' : 'aspect-video',
        '1:1' : 'aspect-square',
        '9:16': 'aspect-[9/16]',
    } as Record<AspectRatio,string>;

  return (
    <div className='relative mx-auto w-full max-w-2xl'>
        <div className={`relative overflow-hidden ${aspectclasses[aspectRatio]}`}>
            {/* Loading state*/}
            {isLoading && (
                <div className='absolute isnet-0 flex-col items-center justify-center gap-4 bg-black/25'>
                    <Loader2Icon  className='size-8 animate-spin text-zinc-400'/>
                    <div className='text-center'>
                        <p className='text-sm font-medium text-zinc-200'>AI is generating your Thumbnail</p>
                        <p className='mt-1 text-xs text-zinc-400'> This may take 10-20 seconds</p>
                    </div>
                </div>
            )}

            {/* Image preview*/ }
            {!isLoading && thumbnail?.image_url && (
                <div className='group relative h-full w-full '>
                    <img src={thumbnail.image_url }alt={thumbnail.title}  className='h-full w-full object-cover'/>
                    <div className='absolute inset-0 flex items-end justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100'>
                    <button type='button'>
                        <DownloadIcon className='size-4' />Download Thumbnail
                    </button>
                    </div>
                </div>
            )}
        </div>
    </div>  
  )
}

export default Previewpanel
