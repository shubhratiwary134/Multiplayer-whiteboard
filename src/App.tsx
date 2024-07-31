
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import InitialPage from './components/InitialPage'
import Room from './components/Room.js'
import LoadingPage from './components/LoadingPage.js'




function App() {
//   const isLoading = useStore((state)=>state.liveblocks.isStorageLoading)
//   const enterRoom=useStore((state)=>state.liveblocks.enterRoom)
//   const leaveRoom = useStore((state)=>state.liveblocks.leaveRoom)
  
 
//  useEffect(()=>{
//   enterRoom('first')
//   return()=>{
//     leaveRoom('first')
//   }
//  },[enterRoom,leaveRoom])
//  if(isLoading){
//   return(
//     <>
//     <div className='loading'>loading...</div>
//     </>
//   )
//  }
 
  
  
return(
  <>

 <BrowserRouter>
 <Routes>
  
  <Route path='/' element={<InitialPage></InitialPage>}></Route>
  <Route path='/room/:roomID' element={<Room></Room>}></Route>
 
  
 </Routes>
 </BrowserRouter>
  </>
)
 
}

export default App

