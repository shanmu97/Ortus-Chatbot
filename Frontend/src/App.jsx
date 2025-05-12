import { useState } from 'react';
import DraggableButton from './Components/Button';
import ChatbotWidget from './Components/Chatbot';
import './App.css';
import background_image from './background.jpeg';

function App() {
  const [open, setOpen] = useState(false);
  const [buttonPos, setButtonPos] = useState({ x: 30, y: 80 });

  return (
    <>
    <img src={background_image} className='w-full h-screen'/>
      {open && (
        <div
          style={{
            position: 'fixed',
            left: buttonPos.x,
            top: buttonPos.y - 320, // Adjust for chatbot height
            zIndex: 999,
          }}
        >
          <ChatbotWidget onClose={() => setOpen(false)} />
        </div>
      )}
      <DraggableButton
        onClick={() => setOpen((v) => !v)}
        isOpen={open}
        pos={buttonPos}
        setPos={setButtonPos}
      />
    </>
  );
}

export default App;
