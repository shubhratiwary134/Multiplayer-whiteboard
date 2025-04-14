import { liveblocks } from "@liveblocks/zustand";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { create } from "zustand";
import { client } from "./store";

interface stateInterface {
  roomID: string | null;
  roomIDs: string[];
  fetchRoomIDs: () => Promise<void>;
  setRoomID: (roomID: string) => void;
  addRoomID: (roomID: string) => Promise<void>;
  checkRoomID: (roomID: string | null) => boolean;
  liveblocks: any;
}

const useRoomStore = create<stateInterface>()(
  liveblocks(
    (set, get) => ({
      roomID: "",
      roomIDs: [],
      fetchRoomIDs: async () => {
        const roomIDsCollection = collection(db, "RoomIDs");
        const RoomIDsSnapShot = await getDocs(roomIDsCollection);
        const RoomIDsList = RoomIDsSnapShot.docs.map(
          (doc) => doc.data().roomID
        );
        set({ roomIDs: RoomIDsList });
      },
      setRoomID: (roomID) => {
        set({ roomID });
      },
      addRoomID: async (roomID) => {
        const { roomIDs } = get();
        const newRoomIDs = [...roomIDs, roomID];
        await addDoc(collection(db, "RoomIDs"), { roomID });
        set({ roomIDs: newRoomIDs });
      },
      checkRoomID: (roomID: string | null) => {
        if (!roomID) return false;
        const { roomIDs } = get();
        return roomIDs.includes(roomID);
      },
    }),
    {
      client,
      storageMapping: {
        roomIDs: true,
      },
    }
  )
);

export default useRoomStore;
