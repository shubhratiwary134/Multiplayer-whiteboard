import { useState, useEffect, ChangeEvent, PointerEvent as ReactPointerEvent } from 'react';
import useStore from '../storage/store';
import { FaRegCommentAlt } from 'react-icons/fa';

interface CommentProps {
  threadId: string;
  x: number;
  y: number;
}

export default function Comment({ threadId, x, y }: CommentProps) {
  const updateThread = useStore((state) => state.updateThread);
  const globalCommentValue = useStore((state) => state.commentValues[threadId] || '');
  const setCommentValue = useStore((state) => state.setCommentValue);
  const DissolveMovementPointerDown = useStore((state) => state.DissolveMovementPointerDown);
  const DissolveMovementPointerMove = useStore((state) => state.DissolveMovementPointerMove);
  const DissolveMovementPointerUp = useStore((state) => state.DissolveMovementPointerUp);

  const [localCommentValue, setLocalCommentValue] = useState<string>(globalCommentValue);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [dissolve, setDissolve] = useState<boolean>(false);

  useEffect(() => {
    setLocalCommentValue(globalCommentValue);
  }, [globalCommentValue]);

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setLocalCommentValue(value);
    updateThread(threadId, value);
    setCommentValue(threadId, value);
  }

  function handleSubmit() {
    updateThread(threadId, localCommentValue);
    setCommentValue(threadId, localCommentValue);
    setDisabled(true);
  }

  function handleDissolve() {
    setDissolve(!dissolve);
  }

  function handlePointerDown() {
    DissolveMovementPointerDown();
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }

  function handlePointerMove(e: PointerEvent) {
    DissolveMovementPointerMove(threadId, e);
  }

  function handlePointerUp() {
    DissolveMovementPointerUp();
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }

  return (
    <div
      style={{
        width: '100px',
        height: '100px',
        top: `${y}px`,
        left: `${x}px`,
        position: 'absolute',
      }}
      onPointerDown={handlePointerDown}
      className='flex flex-col items-start'
    >
      <button
        className='rounded w-10 bg-black-200'
        onClick={handleDissolve}
      >
       <FaRegCommentAlt />
      </button>
      {dissolve && (
        <div className='mt-2 flex flex-col items-center'>
          <textarea
            onChange={handleInputChange}
            value={localCommentValue}
            placeholder='Enter Comment'
            disabled={disabled}
            className='bg-white p-2 rounded-xl text-white mb-4 focus:outline-none'
          />
          <button
            onClick={handleSubmit}
            className=' text-black  border-2 border-black text-sm px-3 py-2 rounded-lg  hover:bg-white hover:text-black hover:scale-110  transition duration-500'
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
}
