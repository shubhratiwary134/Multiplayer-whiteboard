//type definitions
export interface Shape {
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
  type: "rectangle" | "line" | "pen";
  path?: { x: number; y: number }[];
}

export interface Thread {
  text: string;
  x: number;
  y: number;
}

export interface CommentValues {
  [key: string]: string;
}

export interface State {
  shapes: { [key: string]: Shape };
  threads: { [key: string]: Thread };
  roomID: string | null;
  roomIDs: string[];
  shapeSelected: string | null;
  isDragging: boolean;
  drawing: boolean;
  type: "rectangle" | "line" | "pen";
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
  checkRoomID: (roomID: string | null) => boolean;
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
