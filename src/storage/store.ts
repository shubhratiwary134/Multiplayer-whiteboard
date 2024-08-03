
import { create } from 'zustand';
import { createClient } from '@liveblocks/client';
import { liveblocks } from '@liveblocks/zustand';
import { db } from '../Firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const client = createClient({
  publicApiKey: import.meta.env.VITE_API_KEY,
});

//type definitions
interface Shape {
  shapeId: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fill?: string;
  x2?: number;
  y2?: number;
  strokeColor: string;
  strokeWidth?: number;
  type: 'rectangle' | 'line' | 'pen';
  path?: { x: number; y: number }[];

}

interface Thread {
  text: string;
  x: number;
  y: number;
}

interface CommentValues {
  [key: string]: string;
}

interface State {
  shapes: { [key: string]: Shape };
  threads: { [key: string]: Thread };
  roomID: string | null;
  roomIDs: string[];
  shapeSelected: string | null;
  isDragging: boolean;
  drawing: boolean;
  type: 'rectangle' | 'line' | 'pen';
  cursor: { x: number; y: number };
  selection: boolean;
  commentValues: CommentValues;
  commentDragging: boolean;
  strokeWidth: number;
  strokeColor: string;
  setStrokeWidth: (width: number) => void;
  setStrokeColor: (color: string) => void;
  fetchRoomIDs: () => Promise<void>;
  DissolveMovementPointerDown: () => void;
  DissolveMovementPointerMove: (threadId: string, e: PointerEvent) => void;
  DissolveMovementPointerUp: () => void;
  setCommentValue: (threadId: string, commentValue: string) => void;
  getRandomInt: (max: number) => number;
  addThreads: (threadId: string, text: string, x: number, y: number) => void;
  updateThread: (threadId: string, text: string) => void;
  deleteThreads: (threadId: string) => void;
  setSelection: () => void;
  setRoomID: (roomID: string) => void;
  addRoomID: (roomID: string) => Promise<void>;
  checkRoomID: (roomID: string|null) => boolean;
  startDrawing: (e: React.MouseEvent) => void;
  setTypeRect: () => void;
  setTypeLine: () => void;
  setPen: () => void;
  continueDrawing: (e: React.MouseEvent) => void;
  stopDrawing: () => void;
  selectShape: (e: React.MouseEvent) => void;
  cursorMovement: (e: React.MouseEvent) => void;
  cursorLeave: () => void;
  clearRect: () => void;
  selectParticularShape: (shapeId: string) => void;
  forPointerUp: () => void;
  forPointerMove: (e: React.MouseEvent) => void;
  deleteRect: () => void;
  path?: any[]; 
  liveblocks: any;
}

const useStore = create<State>()(
  liveblocks(
    (set, get) => ({
      
      shapes: {},
      threads: {},
      roomID: null,
      roomIDs: [],
      shapeSelected: null,
      isDragging: false,
      drawing: false,
      type: 'rectangle',// initially set to rectangle 
      cursor: { x: 0, y: 0 },
      selection: false,
      commentValues: {},
      commentDragging: false,
      strokeWidth: 1,
      strokeColor: 'black',
      setStrokeWidth: (width: number) => {
        set({ strokeWidth: width });
      },
      setStrokeColor: (color: string) => {
        set({ strokeColor: color });
      },
      // Fetch Room IDs from FireStore
      fetchRoomIDs: async () => {
        const roomIDsCollection = collection(db, 'RoomIDs');
        const RoomIDsSnapShot = await getDocs(roomIDsCollection);
        const RoomIDsList = RoomIDsSnapShot.docs.map((doc) => doc.data().roomID);
        set({ roomIDs: RoomIDsList });
      },
       // Dissolve Movement Handlers
      DissolveMovementPointerDown: () => {
        set({ commentDragging: true });
      },
      DissolveMovementPointerMove: (threadId, e) => {
        const { commentDragging, threads } = get();
        const thread = threads[threadId];
        if (!commentDragging) {
          return;
        }
        set({
          threads: {
            ...threads,
            [threadId]: {
              ...thread,
              x: e.clientX,
              y: e.clientY,
            },
          },
        });
      },
      DissolveMovementPointerUp: () => {
        set({ commentDragging: false });
      },
      setCommentValue: (threadId, commentValue) => {
        const { commentValues } = get();
        set({ commentValues: { ...commentValues, [threadId]: commentValue } });
      },
      getRandomInt: (max) => {
        return Math.floor(Math.random() * max);
      },

      //threads CRUD operations 
      addThreads: (threadId, text, x, y) => {
        const { threads } = get();
        const thread = {
          text,
          x,
          y,
        };
        set({ threads: { ...threads, [threadId]: thread } });
        console.log(threads);
      },
      updateThread: (threadId, text) => {
        const { threads } = get();
        set({
          threads: {
            ...threads,
            [threadId]: {
              ...threads[threadId],
              text,
            },
          },
        });
      },
      deleteThreads: (threadId) => {
        const { threads } = get();
        const newThreads = { ...threads };
        delete newThreads[threadId];
        set({
          threads: newThreads,
        });
      },

      setSelection: () => {
        set({ selection: true });
      },

      // RoomIDs 
      setRoomID: (roomID) => {
        set({ roomID });
      },
      addRoomID: async (roomID) => {
        const { roomIDs } = get();
        const newRoomIDs = [...roomIDs, roomID];
        await addDoc(collection(db, 'RoomIDs'), { roomID });
        set({ roomIDs: newRoomIDs });
      },
      checkRoomID: (roomID: string | null) => {
        if (!roomID) return false;
        const { roomIDs } = get();
        return roomIDs.includes(roomID);
      },

      
      

      //set the type for the shapes 
      setTypeRect: () => {
        set({
          type: 'rectangle',
          selection: false,
        });
      },
      setTypeLine: () => {
        set({
          type: 'line',
          selection: false,
        });
      },
      setPen: () => {
        set({
          type: 'pen',
          selection: false,
        });
      },

      //Drawing handlers

      startDrawing: (e) => {
        set({ drawing: true });
        const { type, shapes,strokeColor,strokeWidth } = get();
        const shapeId = Date.now().toString();
        let shape: Shape = {
            shapeId,
            x: 0,
            y: 0,
            type: 'rectangle', 
            strokeColor:strokeColor,
           strokeWidth:strokeWidth
          };
        if (type === 'rectangle') {
          shape = {
            shapeId,
            x: e.clientX,
            y: e.clientY,
            width: 0,
            height: 0,
            strokeColor:strokeColor ,
            strokeWidth:strokeWidth,
            type: 'rectangle',
          };
        } else if (type === 'line') {
          shape = {
            shapeId,
            x: e.clientX,
            y: e.clientY,
            x2: e.clientX,
            y2: e.clientY,
            strokeColor: strokeColor,
            strokeWidth:strokeWidth,
            type: 'line',
          };
        } else if (type === 'pen') {
          shape = {
            shapeId,
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
            strokeColor: strokeColor,
            strokeWidth:strokeWidth,
            type: 'pen',
            path: [{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }],
          };
        }
        set({
          shapes: { ...shapes, [shapeId]: shape },
          shapeSelected: shapeId,
        });
        get().liveblocks.room?.history.pause();
      },

      continueDrawing: (e) => {
        const { shapes, shapeSelected, drawing } = get();
        if (!drawing || shapeSelected === null) return; 
        const shape = shapes[shapeSelected];
        if (!drawing) {
          return;
        }
        if (shape.type === 'rectangle') {
          set({
            shapes: {
              ...shapes,
              [shapeSelected]: {
                ...shape,
                width: e.clientX - shape.x,
                height: e.clientY - shape.y,
              },
            },
          });
        } else if (shape.type === 'line') {
          set({
            shapes: {
              ...shapes,
              [shapeSelected]: {
                ...shape,
                x2: e.clientX,
                y2: e.clientY,
              },
            },
          });
        } else if (shape.type === 'pen') {
          const newPath = [...shape.path!, { x: e.clientX, y: e.clientY }];
          set({
            shapes: {
              ...shapes,
              [shapeSelected]: {
                ...shape,
                path: newPath,
              },
            },
          });
        }
      },
      stopDrawing: () => {
        set({ drawing: false });
        set({ path: [] });
        get().liveblocks.room?.history.resume();
      },

      // shape selection functions 
      selectShape: (e) => {
        const { shapes } = get();
        const shapeSelected = Object.keys(shapes).find((shapeId) => {
          const shape = shapes[shapeId];
          if (shape.type === 'rectangle') {
            return (
              e.clientX >= shape.x &&
              e.clientX <= shape.x + shape.width! &&
              e.clientY >= shape.y &&
              e.clientY <= shape.y + shape.height!
            );
          } else if (shape.type === 'line') {
            return (
              Math.abs(
                (e.clientX - shape.x) * (shape.y2! - shape.y) -
                (e.clientY - shape.y) * (shape.x2! - shape.x)
              ) /
              Math.sqrt(
                (shape.x2! - shape.x) ** 2 + (shape.y2! - shape.y) ** 2
              ) <= 5
            );
          }
        });
        set({ shapeSelected, isDragging: Boolean(shapeSelected) });
      },

      // function for Live cursors 
      cursorMovement: (e) => {
        const { drawing, type } = get();
        set({ cursor: { x: e.clientX, y: e.clientY } });
        if (drawing && type === 'pen') {
          get().continueDrawing(e);
        }
      },
      cursorLeave: () => {
        set({ cursor: { x: 0, y: 0 } });
      },

      // handles the clearing of the canvas by setting the shapes to null
      clearRect: () => {
        set({
          shapes: {},
        });
      },


      selectParticularShape: (shapeId) => {
        set({
          shapeSelected: shapeId,
          selection: false,
        });
      },

      forPointerUp: () => {
        set({ isDragging: false });
      },
      forPointerMove: (e) => {
        const { isDragging, shapes, shapeSelected } = get();
        if (!isDragging || !shapeSelected) {
          return;
        }
        const shape = shapes[shapeSelected];
        set({
          shapes: {
            ...shapes,
            [shapeSelected]: {
              ...shape,
              x: e.clientX,
              y: e.clientY,
            },
          },
        });
      },

      // Delete the particular selected shape , removing it from the shapes object
      deleteRect: () => {
        const { shapes, shapeSelected } = get();
        const newShapes = { ...shapes };
        delete newShapes[shapeSelected!];
        set({
          shapes: newShapes,
          shapeSelected: null,
        });
      },
    }),

    //liveblocks presence mapping and storage mapping 
    {
      client,
      presenceMapping: {
        shapeSelected:true,cursor:true,commentDragging:true
      },
      storageMapping: {
        shapes:true,roomIDs:true,path:true,threads:true,commentValues:true
      },
    
    }
  )
);

export default useStore;
