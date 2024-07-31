
import { useState,useEffect } from 'react'
import useStore from '../storage/store'

export default function Comment({threadId,x,y}){
    const updateThread=useStore((state)=>state.updateThread)
    const globalCommentValue = useStore((state) => state.commentValues[threadId] || '')
    const setCommentValue=useStore((state)=>state.setCommentValue)
    const [localCommentValue,setLocalCommentValue]=useState(globalCommentValue)
    const DissolveMovementPointerDown=useStore((state)=>state.DissolveMovementPointerDown)
    const DissolveMovementPointerMove=useStore((state)=>state.DissolveMovementPointerMove)
    const DissolveMovementPointerUp=useStore((state)=>state.DissolveMovementPointerUp)
    const [disabled,setDisabled]=useState(false)
    const [dissolve,setDissolve]=useState(false)
    useEffect(() => {
        setLocalCommentValue(globalCommentValue);   
      }, [globalCommentValue])
      function handleInputChange(e){
        const value = e.target.value;
        setLocalCommentValue(value);
        updateThread(threadId, value);
        setCommentValue(threadId, value);
      }

    function handleSubmit(){
        updateThread(threadId,localCommentValue)
        setCommentValue(threadId,localCommentValue)
        setDisabled(true)
    }
    function handleDissolve(){
      setDissolve(!dissolve)
    }
    function handlePointerDown() {
      DissolveMovementPointerDown();
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
  }

  function handlePointerMove(e) {
      DissolveMovementPointerMove(threadId, e);
  }

  function handlePointerUp() {
      DissolveMovementPointerUp();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
  }
   
    return (
        <>
        <div style={{width:'100px',height:'100px',top:`${y}px`,left:`${x}px`,position:'absolute'}}
        onPointerDown={handlePointerDown}
        className='flex flex-col items-start'
        >
          <button className='rounded w-10 bg-black-200' onClick={handleDissolve}  ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/></svg></button>
          {dissolve && <div className='mt-2 flex flex-col items-center' >
            <textarea  onChange={handleInputChange} value={localCommentValue} placeholder='Enter Comment' disabled={disabled ? 'disabled':''} className='bg-black p-2 rounded-xl  text-white mb-4 focus:outline-none'></textarea>
           <button onClick={handleSubmit} className=' text-white border-4 border-black text-sm  p-3 rounded-lg  bg-transparent hover:bg-white hover:text-black hover:scale-110 dark:text-neutral-200 transition duration-500'>Add Comment</button>
          </div>
          }
        </div>
        
        </>
    )
}