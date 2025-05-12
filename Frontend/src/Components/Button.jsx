import { useRef } from 'react';

function DraggableButton({ onClick, isOpen, pos, setPos }) {
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const dragMoved = useRef(false);

  const onMouseDown = (e) => {
    dragging.current = true;
    dragMoved.current = false;
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    if (Math.abs(newX - pos.x) > 3 || Math.abs(newY - pos.y) > 3) {
      dragMoved.current = true;
    }
    setPos({ x: newX, y: newY });
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    if (!dragMoved.current) onClick();
    dragging.current = false;
  };

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 1000,
        cursor: 'grab',
        userSelect: 'none',
      }}
    >
      <button
        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition cursor-pointer
          ${isOpen ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        style={{
          color: 'white',
          fontSize: '1.2rem',
          border: 'none',
          outline: 'none',
        }}
        aria-label="Open chatbot"
      >
        💬
      </button>
    </div>
  );
}

export default DraggableButton;
