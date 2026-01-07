import { useState } from "react"
import { useParams } from "react-router-dom"
import type { IThumbnail } from "../assets/assets"
import Softbackdrop from "../components/Softbackdrop"


const Generate = () => {

    const {id} = useParams()
    const [title,setTitle] = useState('')
    const [additionaldetails,setadditionaldetails] = useState('')

    const [thumbnail ,setThumbnail] = useState<IThumbnail | null>(null)
    const [loading ,setloading] =useState(false)
  

  return (
    <div>
      <Softbackdrop />
      <div className="pt-24 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8 ">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* LEFT PANEL */}
            <div className={`space-y-6 ${id && 'pointer-events-none'}` }>

              <div className="p-6 rounded-3xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-100 mb-1">Create your Thumbnail</h2>
                    <p className="text-sm text-zinc-400">Describe your vision and let AI bring it to life.</p>
                  </div>
                  <div className="space-y-5">
                    {/* TITLE INPUT */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium ">Title or Topic</label>
                      <input type="text" value={title}  onChange={(e) =>setTitle(e.target.value)} maxLength={100 } placeholder="e.g . , 10 Tips for Better Sleep" className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"/>
                    </div>

                  </div>

                  {/* BUTTON */ }

                  {!id && (
                    <button className="text-[15px] w-full py-3.5 rounded-xl font-mdeium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700 disabled:cursor-not-allowed transition-colors">
                      {loading ? 'Generating ... ' : '  Generate Thumbnail '}
                    </button>
                  )}

              </div>
            </div>

            {/* RIGHT PANEL */}
            <div>

            </div>


          </div>
        </main>
      </div>
      
    </div>
  )
}

export default Generate
