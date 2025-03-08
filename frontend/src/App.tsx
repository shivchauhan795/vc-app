import './App.css'
import { Routes, Route } from "react-router-dom";
import Lobby from './components/Lobby';
import Room from './components/Room';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </>
  )
}

export default App
