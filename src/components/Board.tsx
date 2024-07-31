import useStore from '../storage/store';
import Comment from './Comment';
import CursorDisplays from './CursorDisplays';
import { useEffect, useRef } from 'react';
import rough from 'roughjs/bundled/rough.cjs.js';

type Shape = {
  type: 'rectangle' | 'line' | 'pen';
  x: number;
  y: number;
  width?: number;
  height?: number;
  x2?: number;
  y2?: number;
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 3;
    const roughCanvas = rough.canvas(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.entries(shapes).forEach(([shapeId, shape]) => {
      let borderColor = 'white';
      if (shapeSelected === shapeId) {
        borderColor = '#00FF99';
      } else if (others.some((user) => user.presence.shapeSelected === shapeId)) {
        borderColor = 'blue';
      }
      printRectangle(shape, borderColor, ctx, roughCanvas);
    });
  }, [shapes, shapeSelected, drawing, others]);

  function printRectangle(shape: Shape, borderColor: string, ctx: CanvasRenderingContext2D, roughCanvas: any) {
    if (shape.type === 'rectangle') {
      roughCanvas.rectangle(shape.x, shape.y, shape.width!, shape.height!, { roughness: 1.5, stroke: borderColor, strokeWidth: 2 });
    } else if (shape.type === 'line') {
      roughCanvas.line(shape.x, shape.y, shape.x2!, shape.y2!, {
        stroke: 'white',
        strokeWidth: 2,
      });
    } else if (shape.type === 'pen' && shape.path && Array.isArray(shape.path)) {
      if (shape.path.length > 0) {
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(shape.path[0].x, shape.path[0].y);
        shape.path.forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.stroke();
      }
    }
  }

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
        <div className='roomID text-white ml-10'>
          <p>Room ID - {roomID}</p>
        </div>
      </div>
      <div className='toolbar'>
        <button onClick={setTypeRect}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0 0v-560 560Z" />
          </svg>
        </button>
        <button onClick={setTypeLine}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="m268-212-56-56q-12-12-12-28.5t12-28.5l423-423q12-12 28.5-12t28.5 12l56 56q12 12 12 28.5T748-635L324-212q-11 11-28 11t-28-11Z" />
          </svg>
        </button>
        <button onClick={setPen}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M160-120v-170l527-526q12-12 27-18t30-6q16 0 30.5 6t25.5 18l56 56q12 11 18 25.5t6 30.5q0 15-6 30t-18 27L330-120H160Zm80-80h56l393-392-28-29-29-28-392 393v56Zm560-503-57-57 57 57Zm-139 82-29-28 57 57-28-29ZM560-120q74 0 137-37t63-103q0-36-19-62t-51-45l-59 59q23 10 36 22t13 26q0 23-36.5 41.5T560-200q-17 0-28.5 11.5T520-160q0 17 11.5 28.5T560-120ZM183-426l60-60q-20-8-31.5-16.5T200-520q0-12 18-24t76-37q88-38 117-69t29-70q0-55-44-87.5T280-840q-45 0-80.5 16T145-785q-8 7-12 12.5t-4 14.5q0 8 4 16t12 16l60 60q-22 0-39.5 14.5T120-680q-20 20-20 49q0 25 16 48t51 39l81-81q-22-13-33.5-32.5T160-560q0-20 16-32.5t38-12.5q18 0 28 12q10 12 10 29q0 18-15 39.5T240-430q-22 22-50 34q-32 13-56 13q-18 0-31-12t-12-31q0-12 7.5-27t28.5-23l54-54q12-12 29-12q16 0 28 12t12 28q0 11-8.5 20.5T350-430q-8 8-18 8q-13 0-22-9.5T310-470q0-12 9.5-21.5T350-510q12 0 21 9.5t9 21.5q0 16-22 38.5T320-408q-12 12-27 17Z" />
          </svg>
        </button>
        <button onClick={undo}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M500-200v-80h230V-480H470v-80h270v400H500Zm-300 0v-80h50v-350h-50v-80h80v430H200Zm300 0H200v-80h300v80Z" />
          </svg>
        </button>
        <button onClick={redo}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M240-200v-80h230V-480H140v-80h230v430H240Zm300 0h-80v-80h50v-350h-50v-80h80v430Zm50-430h-50v-80h50v80Zm80 0h-50v-80h50v80Z" />
          </svg>
        </button>
        <button onClick={addComment}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M640-120H200v-560h440v560Zm-440-80h440v-560H200v560Zm320-320h-80v80h80v-80Zm0 160h-80v80h80v-80Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
