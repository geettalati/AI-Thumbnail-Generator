import React from 'react'
import type { AspectRatio, IThumbnail } from '../assets/assets'
import { div } from 'motion/react-client';
import { Loader2Icon } from 'lucide-react';

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
                <div>
                    <Loader2Icon  className='size-8 animate-spin text-zinc-400'/>
                </div>
            )}
        </div>
    </div>  
  )
}

export default Previewpanel
