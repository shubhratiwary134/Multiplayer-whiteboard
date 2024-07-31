import useStore from '../storage/store'
import Comment from './Comment'
import CursorDisplays from './CursorDisplays'
import { useEffect, useRef} from 'react'
import rough from 'roughjs/bundled/rough.cjs.js'


 export default function Board(){
    const shapes=useStore((state)=>state.shapes)
  const forPointerUp=useStore((state)=>state.forPointerUp)
  const forPointerMove=useStore((state)=>state.forPointerMove)
  const clearRect=useStore((state)=>state.clearRect)
  const deleteRect=useStore((state)=>state.deleteRect)
 const others=useStore((state)=>state.liveblocks.others)
 const shapeSelected=useStore((state)=>state.shapeSelected)
 const undo = useStore((state)=>state.liveblocks.room?.history.undo)
 const redo = useStore((state)=>state.liveblocks.room?.history.redo)
 const cursorMovement=useStore((state)=>state.cursorMovement)
 const cursorLeave=useStore((state)=>state.cursorLeave)
 const setSelection=useStore((state)=>state.setSelection)
 const continueDrawing=useStore((state)=>state.continueDrawing)
 const stopDrawing=useStore((state)=>state.stopDrawing)
 const setTypeRect=useStore((state)=>state.setTypeRect)
 const setTypeLine=useStore((state)=>state.setTypeLine)
 const selectShape=useStore((state)=>state.selectShape)
 const startDrawing=useStore((state)=>state.startDrawing)
const selection=useStore((state)=>state.selection)
const isDragging=useStore((state)=>state.isDragging)
const setPen=useStore((state)=>state.setPen)
const roomID=useStore((state)=>state.roomID)
const drawing = useStore((state)=>state.drawing)
const getRandomInt=useStore((state)=>state.getRandomInt)
const threads=useStore((state)=>state.threads)
 const canvasRef=useRef(null)
const addThreads=useStore((state)=>state.addThreads)

 useEffect(()=>{
  const canvas=canvasRef.current
  const ctx=canvas.getContext('2d');
   ctx.lineWidth=3;
   const roughCanvas=rough.canvas(canvas)
    ctx.clearRect(0,0,canvas.width,canvas.height)
   Object.entries(shapes).map(([shapeId,shape])=>{
    let borderColor='white'
    if(shapeSelected===shapeId){
      borderColor='#00FF99'
    }
    else if(others.some((user)=>user.presence.shapeSelected===shapeId)){
      borderColor='blue'
    
    }
    printRectangle(shape,borderColor,ctx,roughCanvas)
  })

 },[shapes,shapeSelected,drawing,others])
 
 



 function printRectangle(shape,borderColor,ctx,roughCanvas){
  if(shape.type=='rectangle'){
    roughCanvas.rectangle(shape.x,shape.y,shape.width,shape.height,{roughness:1.5,stroke:borderColor,strokeWidth:2})

  }
  else if(shape.type=='line'){
    roughCanvas.line(shape.x,shape.y,shape.x2,shape.y2,{
      stroke:'white',
      strokeWidth:2
    })  
  }
  else if (shape.type === 'pen' && shape.path  && Array.isArray(shape.path) ) {
    if(shape.path.length>0){
    ctx.strokeStyle = 'white'
    ctx.beginPath();
    ctx.moveTo(shape.path[0].x, shape.path[0].y)
    shape.path.forEach(point => ctx.lineTo(point.x, point.y))
    ctx.stroke()
    }
}
 }
 function addComment(){
  const x = getRandomInt(600)
  const y = getRandomInt(600)
  const threadId=Date.now().toString()
 addThreads(threadId,'',x,y)
 }
    return (
    
        <div onPointerMove={cursorMovement} onPointerLeave={cursorLeave}>
         
          {others.map((user)=>{
        const othersCursor=user.presence
        if(othersCursor==null){
          return
        }
        return(
          <>
          <CursorDisplays x={othersCursor.cursor.x} y={othersCursor.cursor.y} color='blue' className='cursor-display'></CursorDisplays>
          </>
        )
      })}
          <div className='canvas'>  
       <canvas ref={canvasRef} width={window.innerWidth-50} height={window.innerHeight-50} 
       onPointerDown={(e)=>{
        if(selection){
          selectShape(e)
        }else{
          startDrawing(e)  
        }
        
       }}
       onPointerMove={(e)=>{
        if(isDragging){
          forPointerMove(e)
          
        }
        else{
          continueDrawing(e)
          
        }
       }}
       onPointerUp={()=>{
        if(selection){
          forPointerUp()  
        }
        else{
          stopDrawing() 
        }
       }}

       >
        
       </canvas>
      
      
         <div className='roomID text-white ml-10'><p>
          Room ID - {roomID}
            </p></div>
            
          </div>
          <div className='toolbar' >
            <button onClick={setTypeRect} ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0 0v-560 560Z"/></svg></button>
            <button onClick={setTypeLine}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m268-212-56-56q-12-12-12-28.5t12-28.5l423-423q12-12 28.5-12t28.5 12l56 56q12 12 12 28.5T748-635L324-212q-11 11-28 11t-28-11Z"/></svg></button>
            <button onClick={setPen}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M160-120v-170l527-526q12-12 27-18t30-6q16 0 30.5 6t25.5 18l56 56q12 11 18 25.5t6 30.5q0 15-6 30t-18 27L330-120H160Zm80-80h56l393-392-28-29-29-28-392 393v56Zm560-503-57-57 57 57Zm-139 82-29-28 57 57-28-29ZM560-120q74 0 137-37t63-103q0-36-19-62t-51-45l-59 59q23 10 36 22t13 26q0 23-36.5 41.5T560-200q-17 0-28.5 11.5T520-160q0 17 11.5 28.5T560-120ZM183-426l60-60q-20-8-31.5-16.5T200-520q0-12 18-24t76-37q88-38 117-69t29-70q0-55-44-87.5T280-840q-45 0-80.5 16T145-785q-11 13-9 29t15 26q13 11 29 9t27-13q14-14 31-20t42-6q41 0 60.5 12t19.5 28q0 14-17.5 25.5T262-654q-80 35-111 63.5T120-520q0 32 17 54.5t46 39.5Z"/></svg></button>
            <button onClick={setSelection}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m492-240 25-84q54-13 88.5-56T640-480q0-66-47-113t-113-47q-57 0-100 34.5T324-517l-84 25q5-96 74-162t166-66q100 0 170 70t70 170q0 97-66 166t-162 74ZM139-60l-79-79 171-171-151-50 400-120L360-80l-50-151L139-60Z"/></svg></button>
            <button onClick={clearRect}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg></button>
            <button onClick={deleteRect}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
            <button onClick={undo}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/></svg></button>
            <button onClick={redo}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z"/></svg></button>
            <button onClick={addComment}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-400h80v-120h120v-80H520v-120h-80v120H320v80h120v120ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg></button>
          </div>
          {Object.entries(threads).map(([threadId, thread]) => (
        <Comment key={threadId} threadId={threadId} x={thread.x} y={thread.y} />
    ))}
        </div>
        
      )
}

// {Object.entries(shapes).map(([shapeId,shape])=>{
//   let borderColor='white'
//   if(shapeSelected===shapeId){
//     borderColor='blue'
//   }
//   else if(others.some((user)=>user.presence.shapeSelected===shapeId)){
//     borderColor='green'
//   }
//   return(
//    <Rectangle key={shapeId} id={shapeId} shape={shape} borderColor={borderColor}></Rectangle>
//   )
  
// })}