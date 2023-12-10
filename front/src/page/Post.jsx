import { useEffect, useState } from 'react'
import Api from '../service/Api'
import { useNavigate } from 'react-router-dom'


export default function Post() {  

  const [file, setFile] = useState()
  const [caption, setCaption] = useState("")
  const [Posts, setPosts] = useState([])
 console.log(Posts)
  //const navigate = useNavigate()

  useEffect(()=>{
    async function getPosts() {
      const result = await Api.get("/")
      setPosts(result)
    }
    getPosts()
  },[])


  const submit = async event => {
    event.preventDefault()

    const formData = new FormData();
    formData.append("image", file)
    formData.append("caption", caption)
    await Api.post("/post", formData, { headers: {'Content-Type': 'multipart/form-data'}})
    .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    //navigate("/")
  }

  const fileSelected = event => {
    const file = event.target.files[0]
		setFile(file)
	}

  return (
    <div className="flex flex-col items-center justify-center">

        <form onSubmit={submit} style={{width:650}} className="flex flex-col space-y-5 px-5 py-14">
          <input onChange={fileSelected} type="file" accept="image/*"></input>
          <input value={caption} onChange={e => setCaption(e.target.value)} type="text" placeholder='Caption'></input>
          <button type="submit">Submit</button>
        </form>

    </div>
  )
}