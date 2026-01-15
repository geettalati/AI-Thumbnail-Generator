// -------------------- REACT HOOKS IMPORT --------------------

// useState → stores local mutable state inside a functional component
// useEffect → runs side effects (API calls, subscriptions, lifecycle logic)
import { useEffect, useState } from "react"

/*
INTERVIEW (THEORY):
- What is the difference between state and props?
- Why hooks were introduced in React?

INTERVIEW (CODING):
- Implement a counter using useState
- Fetch data using useEffect and display it
*/


// useParams → reads dynamic parameters from the URL
// Example route: /generate/:id → id is accessed here
import { useLocation, useNavigate, useParams } from "react-router-dom"

/*
INTERVIEW (THEORY):
- How does React Router work internally?
- What happens if route param changes?

INTERVIEW (CODING):
- Create a route /users/:userId and fetch user data
*/


// -------------------- ASSETS & TYPES --------------------

// colorSchemes → static configuration data (UI constants)
// dummyThumbnails → mock data simulating backend response
// AspectRatio → union type ("16:9" | "1:1" | "9:16")
// IThumbnail → interface for thumbnail object
// ThumbnailStyle → union type for dropdown values
import {
  colorSchemes,
  type AspectRatio,
  type IThumbnail,
  type ThumbnailStyle
} from "../assets/assets"

/*
INTERVIEW (THEORY):
- Difference between interface and type in TypeScript?
- Why union types are useful?

INTERVIEW (CODING):
- Create a union type for button variants
- Create an interface for API response
*/


// -------------------- COMPONENT IMPORTS --------------------

// Softbackdrop → purely presentational component (no logic)
import Softbackdrop from "../components/Softbackdrop"

// Aspectratioselector → controlled component
import Aspectratioselector from "../components/Aspectratioselector"

// StyleSelector → controlled dropdown component
import StyleSelector from "../components/StyleSelector"

// Colorschemeselector → controlled color palette selector
import Colorschemeselector from "./Colorschemeselector"

// Previewpanel → displays generated or fetched thumbnail
import Previewpanel from "../components/Previewpanel"

// ❌ UNUSED IMPORT → would be removed in production
import { setStyle } from "motion"
import { useAuth } from "../context/Authcontext"
import toast from "react-hot-toast"
import api from "../configs/api"

/*
INTERVIEW (THEORY):
- What is a controlled component?
- Difference between smart vs dumb components?

INTERVIEW (CODING):
- Convert an uncontrolled input to controlled
*/


// -------------------- MAIN COMPONENT --------------------

const Generate = () => {

  // -------------------- ROUTE PARAM --------------------

  // Reads `id` from URL
  // If id exists → EDIT / VIEW MODE
  // If id does not exist → CREATE MODE
  const { id } = useParams()

  /*
  INTERVIEW (THEORY):
  - What if useParams returns undefined?
  - When does React Router re-render components?

  INTERVIEW (CODING):
  - Conditionally render UI based on route param
  */


  // -------------------- FORM STATE --------------------

  // Stores title input value
  const [title, setTitle] = useState('')

  // Stores additional prompt text
  const [additionaldetails, setadditionaldetails] = useState('')

  const {pathname} = useLocation()

  const navigate = useNavigate()


  const {isLoggedIn} = useAuth();

  /*
  INTERVIEW (THEORY):
  - Why controlled inputs are preferred?
  - How does React handle input events?

  INTERVIEW (CODING):
  - Build a form with validation using useState
  */


  // -------------------- THUMBNAIL STATE --------------------

  // Stores fetched/generated thumbnail
  // null → no thumbnail exists yet
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null)

  // Controls loading spinner & disabled UI
  const [loading, setloading] = useState(false)

  /*
  INTERVIEW (THEORY):
  - Why union with null?
  - What is conditional rendering?

  INTERVIEW (CODING):
  - Show loader while fetching data
  */


  // -------------------- SELECTION STATES --------------------

  // Aspect ratio selection
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')

  // Stores color scheme ID instead of full object (lighter state)
  const [colorschemeId, setcolorschemeId] = useState<string>(colorSchemes[0].id)

  // Stores selected style
  const [style, setstyle] = useState<ThumbnailStyle>('Bold and Graphic')

  // Controls dropdown open/close
  const [styleDropdown, setstyleDropdown] = useState(false)

  /*
  INTERVIEW (THEORY):
  - Why keep minimal data in state?
  - What is lifting state up?

  INTERVIEW (CODING):
  - Implement a dropdown with controlled open state
  */


  // -------------------- GENERATE HANDLER --------------------

  // Triggered when Generate button is clicked
  // In production → calls backend AI API
  const handleGenerate = async () => {
  try {
      
    if(!isLoggedIn) return toast.error("Please login to generate thumbnail");
    if(!title.trim()) return toast.error("Please enter a title");
    setloading(true);
    const apipayload = {
      title,
      prompt  : additionaldetails,
      style,
      aspect_ratio:aspectRatio,
      color_scheme: colorschemeId,
      text_overlay: true
    }

    const {data} = await api.post('/api/thumbnails/generate', apipayload);

    if(data.thumbnail){
      navigate(`/generate/${data.thumbnail._id}`);
      toast.success("Thumbnail generated successfully");
    }   
  } catch (error) {
    console.error("Failed to generate thumbnail", error);
  } finally {
    setloading(false);
  }
}; 




    /*
    INTERVIEW (THEORY):
    - Why async/await instead of promises?
    - How do you handle API failures?

    INTERVIEW (CODING):
    - Call API and update UI with response
    - Disable button while request is in progress
    */

  


  // -------------------- FETCH EXISTING THUMBNAIL --------------------

  /*
  THIS IS THE MOST IMPORTANT FUNCTION FOR INTERVIEWS
  --------------------------------------------------
  PURPOSE:
  - Fetch existing thumbnail when editing
  - Populate form fields with backend data
  - Enable edit/view mode using same component

  REAL WORLD:
  - dummyThumbnails.find → fetch(`/api/thumbnails/${id}`)
  */

  const fetchThumbnail = async () => {
      try {
          const {data} = await api.get(`/api/thumbnails/${id}`);
          setThumbnail(data?.thumbnail as IThumbnail);
          setloading(!data?.thumbnail.image_url);
          setadditionaldetails(data?.thumbnail?.additional_prompt || ''); 
          setTitle(data?.thumbnail?.title || '');
          setcolorschemeId(data?.thumbnail?.color_scheme || colorSchemes[0].id);
          setAspectRatio(data?.thumbnail?.aspect_ratio || '16:9');
          setstyle(data?.thumbnail?.style || 'Bold and Graphic');
          
      } catch (error : any) {
        toast.error(error?.response?.data?.message || "Failed to fetch thumbnail");
        
      }
  }

  /*
  INTERVIEW (THEORY):
  - Why separate fetch logic from useEffect?
  - Difference between find vs filter?

  INTERVIEW (CODING):
  - Fetch data by ID and populate a form
  - Handle 404 or missing data
  */


  // -------------------- SIDE EFFECT --------------------

  useEffect(() => {

    // Runs when component renders
    // If editing mode → fetch thumbnail data
    if(isLoggedIn && id){
      fetchThumbnail()  
    }
    if(id && loading && isLoggedIn){
      const interval = setInterval(() => {fetchThumbnail() },5000);
      return () => clearInterval(interval);

    }
  },[id , loading , isLoggedIn ])
  
  useEffect(() =>{
    if(!id && thumbnail){
      setThumbnail(null);
    }
  })
  /*
  🔥 VERY IMPORTANT INTERVIEW QUESTIONS 🔥

  THEORY:
  - What happens if dependency array is missing? (INFINITE RE-RENDERS)
  - How many times will this effect run?
  - What is cleanup function?

  CODING:
  - Fix infinite loop in useEffect
  - Add dependency array correctly
  - Cancel API request on unmount
  */



  // -------------------- JSX UI --------------------

  return (
    <div>

      {/* Background visual layer */}
      <Softbackdrop />

      <div className="pt-24 min-h-screen">

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">

            {/* ---------------- LEFT PANEL ---------------- */}
            <div className={`space-y-6 ${id && 'pointer-events-none'}`}>

              {/* Form Card */}
              <div className="p-6 rounded-3xl bg-white/8 border border-white/12 shadow-xl space-y-6">

                {/* Header */}
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 mb-1">
                    Create your Thumbnail
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Describe your vision and let AI bring it to life.
                  </p>
                </div>

                {/* ---------------- FORM ---------------- */}
                <div className="space-y-5">

                  {/* TITLE INPUT */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Title or Topic
                    </label>

                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      placeholder="e.g., 10 Tips for Better Sleep"
                      className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />

                    <div className="flex justify-end">
                      <span className="text-xs text-zinc-400">
                        {title.length}/100
                      </span>
                    </div>
                  </div>

                  {/* Aspect Ratio Selector */}
                  <Aspectratioselector
                    value={aspectRatio}
                    onChange={setAspectRatio}
                  />

                  {/* Style Selector */}
                  <StyleSelector
                    value={style}
                    onChange={setstyle}
                    isOpen={styleDropdown}
                    setIsOpen={setstyleDropdown}
                  />

                  {/* Color Scheme Selector */}
                  <Colorschemeselector
                    value={colorschemeId}
                    onChange={setcolorschemeId}
                  />

                  {/* Additional Prompt */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Additional Prompts <span className="text-zinc-400">(optional)</span>
                    </label>

                    <textarea
                      value={additionaldetails}
                      onChange={(e) => setadditionaldetails(e.target.value)}
                      rows={3}
                      placeholder="Add any specific elements, mood, or style preferences..."
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none overflow-hidden"
                    />
                  </div>

                </div>

                {/* ---------------- BUTTON ---------------- */}
                {!id && (
                  <button
                    onClick={handleGenerate}
                    className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Generating...' : 'Generate Thumbnail'}
                  </button>
                )}

              </div>
            </div>

            {/* ---------------- RIGHT PANEL ---------------- */}
            <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl">
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                Preview
              </h2>
              
              <Previewpanel  
                thumbnail={thumbnail}
                isLoading={loading}
                aspectRatio={aspectRatio}
              />
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default Generate
