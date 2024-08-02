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
import { FaCommentAlt } from "react-icons/fa";
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
  const shapes = useStore((state) => state.shapes);
  const forPointerUp = useStore((state) => state.forPointerUp);
  const forPointerMove = useStore((state) => state.forPointerMove);
  const clearRect = useStore((state) => state.clearRect);
  const deleteRect = useStore((state) => state.deleteRect);
  const others = useStore((state) => state.liveblocks.others as User[]);
  const shapeSelected = useStore((state) => state.shapeSelected);
  const undo = useStore((state) => state.liveblocks.room?.history.undo);
  const redo = useStore((state) => state.liveblocks.room?.history.redo);
  const cursorMovement = useStore((state) => state.cursorMovement);
  const cursorLeave = useStore((state) => state.cursorLeave);
  const setSelection = useStore((state) => state.setSelection);
  const continueDrawing = useStore((state) => state.continueDrawing);
  const stopDrawing = useStore((state) => state.stopDrawing);
  const setTypeRect = useStore((state) => state.setTypeRect);
  const setTypeLine = useStore((state) => state.setTypeLine);
  const selectShape = useStore((state) => state.selectShape);
  const startDrawing = useStore((state) => state.startDrawing);
  const selection = useStore((state) => state.selection);
  const isDragging = useStore((state) => state.isDragging);
  const setPen = useStore((state) => state.setPen);
  const roomID = useStore((state) => state.roomID);
  const drawing = useStore((state) => state.drawing);
  const getRandomInt = useStore((state) => state.getRandomInt);
  const threads = useStore((state) => state.threads);
  const addThreads = useStore((state) => state.addThreads);
  const canvasRef = useRef<HTMLCanvasElement>(null);
 const {setStrokeColor,setStrokeWidth,strokeColor,strokeWidth}=useStore()
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
 
  function addComment() {
    const x = getRandomInt(600);
    const y = getRandomInt(600);
    const threadId = Date.now().toString();
    addThreads(threadId, '', x, y);
  }

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
        <div className='roomID text-black ml-10'>
          <p>Room ID - {roomID}</p>
        </div>
      </div>
      <div className='toolbar' >
            <button onClick={setTypeRect} ><MdOutlineRectangle size={32} /></button>
            <button onClick={setTypeLine}><FaSlash size={32}/></button>
            <button onClick={setPen}><FaPaintbrush size={32} /></button>
            <button onClick={setSelection}><FaHandPointer size={32} /></button>
            <button onClick={clearRect}><RiDeleteBin5Line size={32}/></button>
            <button onClick={deleteRect}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
            <button onClick={undo}><IoIosUndo size={32} /></button>
            <button onClick={redo}><IoIosRedo size={32}/></button>
            <button onClick={addComment}><FaCommentAlt size={32}/></button>
            <div>
          <input 
            type="color" 
            value={strokeColor} 
            onChange={(e) => setStrokeColor(e.target.value)} 
          />
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={strokeWidth} 
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))} 
          />
           
        </div>
        <button onClick={handleExportImage}>Export as Image</button>
        <button onClick={handleExportPDF}>Export as PDF</button>
          </div>
          {Object.entries(threads).map(([threadId, thread]) => (
        <Comment key={threadId} threadId={threadId} x={thread.x} y={thread.y} />
    ))}
    </div>
  );
}
