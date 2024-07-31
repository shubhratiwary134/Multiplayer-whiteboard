import { useParams } from "react-router-dom";
import useStore from '../storage/store';
import { useEffect } from "react";
import Board from "./Board";
import LoadingPage from "./LoadingPage";

// Define the expected shape of the URL parameters
interface RoomParams {
  roomID: string;
}

export default function Room() {
  // Use the defined type for the URL parameters
  const { roomID } = useParams<RoomParams>();
  
  // Define types for the store's state and methods
  const enterRoom = useStore((state) => state.liveblocks.enterRoom);
  const leaveRoom = useStore((state) => state.liveblocks.leaveRoom);
  const isLoading = useStore((state) => state.liveblocks.isStorageLoading);

  useEffect(() => {
    if (roomID) {
      enterRoom(roomID);
    }
    return () => {
      if (roomID) {
        leaveRoom(roomID);
      }
    };
  }, [roomID, enterRoom, leaveRoom]);

  if (isLoading) {
    return (
      <div className="loading">
        <LoadingPage />
      </div>
    );
  }

  return (
    <>
      <div className="room-container">
        <Board />
      </div>
    </>
  );
}
