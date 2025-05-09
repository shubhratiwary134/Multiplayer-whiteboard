import useStore from '../storage/store';
import Comment from './Comment';
import CursorDisplays from './CursorDisplays';
import { useEffect, useRef } from 'react';
import rough from 'roughjs/bundled/rough.cjs.js';
import '../App.css'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoIosRedo, IoIosUndo } from "react-icons/io";
import { MdOutlineRectangle } from "react-icons/md";
import { FaHandPointer, FaPaintbrush, FaSlash } from "react-icons/fa6";
import { FaCommentAlt, FaRegCommentAlt, FaRegHandPaper } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { IoArrowRedoOutline, IoArrowUndoOutline } from "react-icons/io5";
import { HiOutlinePaintBrush } from "react-icons/hi2";
type Shape = {
  type: 'rectangle' | 'line' | 'pen';
  x: number;
  y: number;
  width?: number;
  height?: number;
  x2?: number;
  y2?: number;
  strokeColor:string,
  strokeWidth:number,
  path?: { x: number; y: number }[];
};

type Thread = {
  x: number;
  y: number;
};

type User = {
  connectionId: string;
  presence: {
    shapeSelected?: string;
    cursor: {
      x: number;
      y: number;
    };
  };
};

export default function Board() {
  // Shape-related state
const shapes = useStore((state) => state.shapes);
const shapeSelected = useStore((state) => state.shapeSelected);
const selection = useStore((state) => state.selection);
const selectShape = useStore((state) => state.selectShape);
const setSelection = useStore((state) => state.setSelection);

// Drawing-related state
const startDrawing = useStore((state) => state.startDrawing);
const continueDrawing = useStore((state) => state.continueDrawing);
const stopDrawing = useStore((state) => state.stopDrawing);
const drawing = useStore((state) => state.drawing);
const setTypeRect = useStore((state) => state.setTypeRect);
const setTypeLine = useStore((state) => state.setTypeLine);
const clearRect = useStore((state) => state.clearRect);

// Pointer-related state
const forPointerUp = useStore((state) => state.forPointerUp);
const forPointerMove = useStore((state) => state.forPointerMove);

// Liveblocks-related state
const others = useStore((state) => state.liveblocks.others as User[]);
const undo = useStore((state) => state.liveblocks.room?.history.undo);
const redo = useStore((state) => state.liveblocks.room?.history.redo);
const roomID = useStore((state) => state.roomID);

// Cursor-related state
const cursorMovement = useStore((state) => state.cursorMovement);
const cursorLeave = useStore((state) => state.cursorLeave);

// Dragging-related state
const isDragging = useStore((state) => state.isDragging);

// Pen-related state
const setPen = useStore((state) => state.setPen);

// Utility state
const getRandomInt = useStore((state) => state.getRandomInt);

// Threads-related state
const threads = useStore((state) => state.threads);
const addThreads = useStore((state) => state.addThreads);


 const {setStrokeColor,setStrokeWidth,strokeColor,strokeWidth}=useStore()
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const navigate =useNavigate()


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 3;
    const roughCanvas = rough.canvas(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.entries(shapes).forEach(([shapeId, shape]) => {
      printRectangle(shape, ctx, roughCanvas);
    });
  }, [shapes, shapeSelected, drawing, others]);

  function printRectangle(shape: Shape, ctx: CanvasRenderingContext2D, roughCanvas: any) {  
    const strokeWidth = shape.strokeWidth || 1;
    if (shape.type === 'rectangle') {
      roughCanvas.rectangle(shape.x, shape.y, shape.width!, shape.height!, { roughness: 1, stroke: shape.strokeColor, strokeWidth: strokeWidth });
    } else if (shape.type === 'line') {
      roughCanvas.line(shape.x, shape.y, shape.x2!, shape.y2!, {
        stroke: shape.strokeColor,
        strokeWidth: strokeWidth,
      });
    } else if (shape.type === 'pen' && shape.path && Array.isArray(shape.path)) {
      if (shape.path.length > 0) {
        ctx.strokeStyle = shape.strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.moveTo(shape.path[0].x, shape.path[0].y);
        shape.path.forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.stroke();
      }
    }
  }
  
  const handleExportImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      html2canvas(canvas).then((canvas) => {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'whiteboard.png';
        link.click();
      });
    }
  };
  const handleExportPDF = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      html2canvas(canvas).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('whiteboard.pdf');
      });
    }
  };
 
  function LeaveRoom(){
    navigate('/')
  }
  function addComment() {
    const x = getRandomInt(600);
    const y = getRandomInt(600);
    const threadId = Date.now().toString();
    addThreads(threadId, '', x, y);
  }
  const handleExport = (e) => {
    const value = e.target.value;
    if (value === 'image') {
      handleExportImage();
    } else if (value === 'pdf') {
      handleExportPDF();
    }
  };

  return (
    <div onPointerMove={cursorMovement} onPointerLeave={cursorLeave}>
      {others.map((user) => {
        const othersCursor = user.presence;
        if (!othersCursor) {
          return null;
        }
        return (
          <CursorDisplays
            key={user.connectionId}
            x={othersCursor.cursor.x}
            y={othersCursor.cursor.y}
            color='blue'
          
          />
        );
      })}
      <div className='canvas'>
     
        <canvas
          ref={canvasRef}
          width={window.innerWidth - 50}
          height={window.innerHeight - 50}
          onPointerDown={(e) => {
            if (selection) {
              selectShape(e);
            } else {
              startDrawing(e);
            }
          }}
          onPointerMove={(e) => {
            if (isDragging) {
              forPointerMove(e);
            } else {
              continueDrawing(e);
            }
          }}
          onPointerUp={() => {
            if (selection) {
              forPointerUp();
            } else {
              stopDrawing();
            }
          }}
        />
       
      </div>
     
      <div className='w-2/3 flex justify-around toolbar shadow-2xl shadow-black rounded-lg' >
       
            <button onClick={setTypeRect} className='toolbar-button' ><MdOutlineRectangle size={24} /></button>
            <button onClick={setTypeLine} className='toolbar-button'><FaSlash size={24}/></button>
            <button onClick={setPen} className='toolbar-button'><HiOutlinePaintBrush size={24} /></button>
            <button onClick={setSelection} className='toolbar-button'><FaRegHandPaper size={24}/></button>
            <button onClick={clearRect} className='toolbar-button'><RiDeleteBin5Line size={24}/></button>
            <button onClick={undo} className='toolbar-button'><IoArrowUndoOutline size={24} /></button>
            <button onClick={redo} className='toolbar-button'><IoArrowRedoOutline size={24} /></button>
            <button onClick={addComment}  className='toolbar-button'><FaRegCommentAlt size={24}/></button>
            <div className='flex items-center gap-2'>
          <input 
            type="color" 
            className='w-8 h-8 border border-gray-300  cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full' 
            value={strokeColor} 
            onChange={(e) => setStrokeColor(e.target.value)} 
          />
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={strokeWidth} 
            className='w-24 cursor-pointer' 
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))} 
          />
           
        </div>
       
          </div>
          <div className=' absolute top-3 w-full roomID text-black  flex justify-between '>
      <p className='m-2'>Room ID - {roomID}</p>
      <div className="w-48 flex flex-col items-center mx-10">
      <label htmlFor="export" className="block text-lg font-medium text-gray-700">
        Export
      </label>
      <select
        id="export"
        name="export"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        onChange={handleExport}
        defaultValue=""
      >
        <option value="" disabled>
          Select format
        </option>
        <option value="image">Image</option>
        <option value="pdf">PDF</option>
      </select>
    </div>
      <button onClick={LeaveRoom} className='m-2 py-2 w-40 bg-red-300'>Leave Room</button>
      
        </div>
          {Object.entries(threads).map(([threadId, thread]) => (
        <Comment key={threadId} threadId={threadId} x={thread.x} y={thread.y} />
    ))}
    
    </div>
  );
}
