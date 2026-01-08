import { useState, useEffect } from "react"
import Softbackdrop from "../components/Softbackdrop"
import { dummyThumbnails, type IThumbnail } from "../assets/assets"
import { div } from "motion/react-m"

const Mygeneration = () => {
  const [thumbnails ,setThumbnails] = useState<IThumbnail>([])
  const [loading ,setloading] = useState(false)
  const fetchThumbnail = async () =>{
    setThumbnails(dummyThumbnails as unknown as IThumbnail[{}])
    setloading(false)
  }

  const handledownload = (image_url : string) =>{
      window.open(image_url  , '_blank')
  }

  const handledelete = async(id : string) =>{
    console.log(id)
  }

  useEffect(() =>{
    fetchThumbnail()
  } ,[])


  return (
    <div>
      <Softbackdrop />
      <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
      {/* HEADER*/}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-200">My Generations</h1>
        <p className="text-sm text-zinc-400 mt-1">View and manage all your AI-generated thumbnails</p>
      </div>

      {/* LOADING*/ }

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {Array.from({length:6}).map((_ , i ) =>(
              <div key={i} className="rounded-2xl bg-white/6 border border-white/10 animate-pulse h-[260px] "></div>
          ))}
        </div>
      )}

      {/*EMPTY STATE   */}

      {!loading && thumbnails.length === 0  && (
          <div className="text-center py-24 ">
            <h3 className="text-lg font-semibold text-zinc-200 ">No thumbnails Yet</h3>
            <p className="text-sm text-zinc-400 mt-2"> Generate your first thumbnail to see it here</p>
          </div>
      ) }




      </div>
    </div>
  )
}

export default Mygeneration
