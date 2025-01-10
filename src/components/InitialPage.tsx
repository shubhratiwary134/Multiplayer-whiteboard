import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../storage/store";
import logo from "../images/backgroundWeb.gif";
import Navbar from "./Navbar";
import { SignOutButton } from "@clerk/clerk-react";

interface State {
  liveblocks: {
    isStorageLoading: boolean;
  };
  setRoomID: (roomID: string) => void;
  addRoomID: (roomID: string) => void;
  checkRoomID: (roomID: string | null) => boolean;
  fetchRoomIDs: () => void;
}

export default function InitialPage() {
  const [join, setJoin] = useState<boolean>(false);
  const [tempRoomId, setTempRoomId] = useState<string | null>(null);

  const isLoading = useStore(
    (state: State) => state.liveblocks.isStorageLoading
  );
  const setRoomID = useStore((state: State) => state.setRoomID);
  const addRoomID = useStore((state: State) => state.addRoomID);
  const checkRoomID = useStore((state: State) => state.checkRoomID);
  const fetchRoomIDs = useStore((state: State) => state.fetchRoomIDs);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomIDs();
  }, [fetchRoomIDs]);

  function EnterRooms() {
    const newRoomId = Math.random().toString().substring(2, 7);
    setRoomID(newRoomId);
    addRoomID(newRoomId);
    if (!isLoading) {
      navigate(`/room/${newRoomId}`);
    }
  }

  function joinRoom() {
    if (tempRoomId && checkRoomID(tempRoomId)) {
      setRoomID(tempRoomId);
      console.log("entering if");
      navigate(`/room/${tempRoomId}`);
    } else {
      window.alert("Wrong input");
    }
  }

  return (
    <>
      <Navbar />
      <div className="text-black flex justify-around items-center h-3/4">
        <div className="hidden sm:flex">
          <img src={logo} alt="Background" />
        </div>
        <div className="flex flex-col md:flex-row w-1/2 justify-around">
          <div>
            <button
              onClick={EnterRooms}
              className="shadow-[inset_0_0_0_2px_#616467] text-white px-10 py-2 mb-5 lg:px-12 lg:py-4 lg:mb-10 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200"
            >
              Create Room
            </button>
          </div>
          <div>
            <button
              onClick={() => setJoin(!join)}
              className="shadow-[inset_0_0_0_2px_#616467] text-white px-10 py-2 mb-5 lg:px-12 lg:py-4 lg:mb-10 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200 flex justify-around items-center"
            >
              Join Room
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#5f6368"
              >
                <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
              </svg>
            </button>
            {join && (
              <div className="flex flex-col p-1">
                <input
                  className="p-1 my-1 bg-black text-white border-b-2 focus:outline-none"
                  type="text"
                  placeholder="Enter The RoomID"
                  onChange={(e) => setTempRoomId(e.target.value)}
                  value={tempRoomId || ""}
                />
                <button
                  onClick={joinRoom}
                  className="shadow-[inset_0_0_0_2px_#616467] text-white my-4 py-2 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
