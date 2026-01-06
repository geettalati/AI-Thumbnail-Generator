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
      
      
    </div>
  )
}

export default Generate
