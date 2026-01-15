// -------------------- REACT HOOKS --------------------
// useState → manages component-level state
// useEffect → runs side effects (data fetching, lifecycle logic)
import { useState, useEffect } from "react"

// Softbackdrop → background UI component (purely visual)
import Softbackdrop from "../components/Softbackdrop"

// dummyThumbnails → mock data (used instead of backend)
// IThumbnail → TypeScript interface describing thumbnail shape
import { dummyThumbnails, type IThumbnail } from "../assets/assets"

// ❌ UNUSED IMPORT (should be removed in real project)
// Interview Q: Why should unused imports be removed?
// Answer: Tree-shaking, bundle size, linting errors
import { div } from "motion/react-m"

// React Router utilities
// useNavigate → programmatic navigation
// Link → declarative navigation
import { Link, replace, useNavigate } from "react-router-dom"

// Icons for UI actions
import { ArrowUpRightIcon, DownloadIcon, TrashIcon } from "lucide-react"
import { useAuth } from "../context/Authcontext"
import api from "../configs/api"
import toast from "react-hot-toast"

/*
INTERVIEW QUESTIONS (CORE):
- What is the difference between useNavigate and Link?
- Why is declarative navigation preferred in React?
- When should you use programmatic navigation?
*/

// -------------------- MAIN COMPONENT --------------------
const Mygeneration = () => {

  const {isLoggedIn} = useAuth();

  // -------------------- ASPECT RATIO MAP --------------------
  // Maps backend aspect ratio values → Tailwind CSS classes
  // This allows dynamic aspect-ratio rendering
  const aspectRatioClassMap: Record<string, string> = {
    '16:9': 'aspect-video',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]'
  }



  /*
  INTERVIEW QUESTIONS:
  - Why use a lookup object instead of if/else?
  - What is Record<K, V> in TypeScript?
  - How does aspect-ratio CSS work internally?
  */

  // -------------------- STATE --------------------

  // thumbnails → array of generated thumbnails
  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([])

  // loading → controls skeleton loaders & conditional UI
  const [loading, setloading] = useState(false)

  /*
  INTERVIEW QUESTIONS:
  - Why initialize thumbnails as an empty array?
  - Difference between null vs empty array in React rendering?
  - How does state update trigger re-render?
  */

  // -------------------- FETCH FUNCTION --------------------
  // Simulates backend fetch (later replaced with API)
  const fetchThumbnail = async () => {
    try {
      setloading(true)
      const {data} = await api.get('/api/user/thumbnails');
      setThumbnails(data.thumbnails  || []);
    } catch (error : any) {
      toast.error(error.response?.data?.message || "Failed to fetch thumbnails");
    }
    finally {
      setloading(false)
    }
  }

  /*
  INTERVIEW QUESTIONS:
  - Why should async logic be separated from useEffect?
  - What happens if fetchThumbnail throws an error?
  - How would you add try/catch here?
  */

  // -------------------- NAVIGATION --------------------
  const navigate = useNavigate()

  /*
  INTERVIEW QUESTIONS:
  - What happens internally when navigate() is called?
  - How does React Router avoid page reloads?
  */

  // -------------------- DOWNLOAD HANDLER --------------------
  // Opens image URL in a new tab
  const handledownload = (image_url: string) => {
     const link = document.createElement('a');
    link.href = image_url?.replace('/upload','/upload/fl_attachment/');
    document.body.appendChild(link); 
    link.click();
    link.remove();
  }

  /*
  INTERVIEW QUESTIONS:
  - Why window.open instead of <a download>?
  - What are popup blockers?
  - How to force download instead of preview?
  */

  // -------------------- DELETE HANDLER --------------------
  // Currently logs ID (future backend integration)
  const handledelete = async (id: string) => {
    try {
        const confirm = window.confirm("Are you sure you want to delete this thumbnail?");
        if(!confirm) return; 
        const {data} = await api.delete(`/api/thumbnails/delete/${id}`);
        toast.success(data.message);
        setThumbnails(thumbnails.filter((t)=> t._id !== id));
    } catch (error:any) {
      console.log("Delete failed", error);
      toast.error(error.response?.data?.message || "Failed to fetch thumbnails");
    }
  }

  /*
  INTERVIEW QUESTIONS:
  - How would you optimistically update UI on delete?
  - How to confirm before deleting?
  - REST vs GraphQL delete strategies?
  */

  // -------------------- SIDE EFFECT --------------------
  // Runs once on component mount
  useEffect(() => {
    if(isLoggedIn){
    fetchThumbnail()
    }
  }, [])

  /*
  INTERVIEW QUESTIONS (VERY IMPORTANT):
  - Why empty dependency array?
  - What happens if you remove it?
  - What is cleanup function?
  */

  // -------------------- JSX --------------------
  return (
    <div>
      {/* Background visuals */}
      <Softbackdrop />

      <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">

        {/* -------------------- HEADER -------------------- */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-200">
            My Generations
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            View and manage all your AI-generated thumbnails
          </p>
        </div>

        {/* -------------------- LOADING STATE -------------------- */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/6 border border-white/10 animate-pulse h-[260px]"
              />
            ))}
          </div>
        )}

        {/* -------------------- EMPTY STATE -------------------- */}
        {!loading && thumbnails.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <h3 className="text-lg font-semibold text-zinc-200">
              No thumbnails Yet
            </h3>

            <p className="text-sm text-zinc-400">
              Generate your first thumbnail to see it here
            </p>

            <button
              onClick={() => navigate('/generate')}
              className="hidden md:block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full"
            >
              Generate
            </button>
          </div>
        )}

        {/* -------------------- GRID VIEW -------------------- */}
        {!loading && thumbnails.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-8">
            {thumbnails.map((thumb: IThumbnail) => {

              // Pick correct aspect ratio class
              const aspectClass =
                aspectRatioClassMap[thumb.aspect_ratio || '16:9']

              return (
                <div
                  key={thumb._id}
                  onClick={() => navigate(`/generate/${thumb._id}`)}
                  className="mb-8 group relative cursor-pointer rounded-2xl bg-white/6 border border-white/10 transition shadow-xl break-inside-avoid"
                >

                  {/* ---------------- IMAGE ---------------- */}
                  <div
                    className={`relative overflow-hidden rounded-t-2xl ${aspectClass} bg-black`}
                  >
                    {thumb.image_url ? (
                      <img
                        src={thumb.image_url}
                        alt={thumb.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                        {thumb.isGenerating ? 'Generating' : 'No image'}
                      </div>
                    )}

                    {/* GENERATING OVERLAY */}
                    {thumb.isGenerating && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium text-white">
                        generating
                      </div>
                    )}
                  </div>

                  {/* ---------------- META INFO ---------------- */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2">
                      {thumb.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-white/8">
                        {thumb.style}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/8">
                        {thumb.color_scheme}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/8">
                        {thumb.aspect_ratio}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500">
                      {new Date(thumb.createdAt!).toDateString()}
                    </p>
                  </div>

                  {/* ---------------- ACTION BUTTONS ---------------- */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 right-2 max-sm:flex sm:hidden group-hover:flex gap-1.5"
                  >
                    <TrashIcon
                      onClick={() => handledelete(thumb._id)}
                      className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"
                    />

                    <DownloadIcon
                      onClick={() => handledownload(thumb.image_url!)}
                      className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"
                    />

                    <Link
                      to={`/preview?thumbnail_url=${encodeURIComponent(
                        thumb.image_url!
                      )}&title=${encodeURIComponent(thumb.title)}`}
                      target="_blank"
                    >
                      <ArrowUpRightIcon className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all" />
                    </Link>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Mygeneration
