import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../utils/wsServer";

const Lobby = () => {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");

    const navigate = useNavigate();


    const ws = useWebSocket();
    const handleJoinRoom = (username: string, room: string) => {
        console.log(username, room);

        if (ws && ws.readyState === ws.OPEN) {

            ws.send(JSON.stringify({
                type: "join",
                payload: {
                    roomId: room,
                    name: username
                }
            }))
            navigate(`/room/${room}`);
        }

    }






    return (
        <div className='flex justify-center items-center h-screen'>
            <div className=' w-fit flex justify-center items-center flex-col'>
                <input type="text" className='text-3xl border m-5 pl-2 py-1' placeholder='Name' value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="text" className='text-3xl border m-5 pl-2 py-1' placeholder='room' value={room} onChange={(e) => setRoom(e.target.value)} />
                <div className='flex gap-2'>

                    <button onClick={() => handleJoinRoom(username, room)} className='bg-green-300 text-black w-20 p-3 h-fit cursor-pointer'>Join</button>
                    <button className='bg-red-300 text-black w-20 p-3 h-fit cursor-pointer'>Hangup</button>
                </div>
            </div>
        </div>
    )
}

export default Lobby
