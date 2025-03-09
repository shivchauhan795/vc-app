import { useEffect, useState } from "react"
import { useWebSocket } from "../utils/wsServer";
import ReactPlayer from "react-player";
import peer from "../service/peer";

const Room = () => {
    const [name, setname] = useState(null);
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState<MediaStream | null>()
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>()
    const ws = useWebSocket();
    useEffect(() => {
        if (ws && ws.readyState === ws.OPEN) {
            ws.onmessage = (message) => {
                const parsedMessage = JSON.parse(message.data);
                if (parsedMessage.type === "joined") {
                    handleUserJoined(parsedMessage);
                }
                else if (parsedMessage.type === "incomming:call-offer") {
                    handleIncommingCall(parsedMessage);
                }
                else if (parsedMessage.type === "call:accepted") {

                    handleCallAccepted(parsedMessage);
                }
                else if (parsedMessage.type === "peer:negotiationneeded") {
                    handleNeedNigotiationIncoming(parsedMessage);
                }
                else if (parsedMessage.type === "peer:negotiationFinal") {
                    console.log(parsedMessage);
                    handleNegotiationFinal(parsedMessage);
                }
            }
        }
        return () => {
            if (ws && ws.readyState === ws.OPEN) {
                ws.onmessage = null;
            }
        }
    }, []);

    const handleUserJoined = (parsedMessage: any) => {
        console.log("join hogya koi", parsedMessage);
        setname(parsedMessage.payload.username);
        setRemoteSocketId(parsedMessage.payload.id);
        console.log("remote socket id", parsedMessage.payload.id);
        console.log("my name", parsedMessage.payload.username);
    }

    const handleIncommingCall = async (parsedMessage: any) => {
        console.log("inside call offer", parsedMessage.payload.remoteSocketId);
        setRemoteSocketId(parsedMessage.payload.remoteSocketId);
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        setMyStream(stream);
        console.log("incomming call", parsedMessage);
        const ans = await peer.getAnswer(parsedMessage.payload.offer);
        ws?.send(JSON.stringify({
            type: "user-call:accepted",
            payload: {
                remoteSocketId: parsedMessage.payload.remoteSocketId,
                ans: ans
            }
        }));
    }

    const handleCallAccepted = async (parsedMessage: any) => {
        console.log("call accepted");
        peer.setLocalDescription(parsedMessage.payload.ans);
        sendStreams();
    }

    const handleNeedNigotiationIncoming = async (parsedMessage: any) => {
        console.log("need negotiation incoming");
        const ans = await peer.getAnswer(parsedMessage.payload.offer);
        ws?.send(JSON.stringify({
            type: "peer:negotiationaccepted",
            payload: {
                ans: ans,
                remoteSocketId: parsedMessage.payload.remoteSocketId
            }
        }))
    }

    const handleNegotiationFinal = async (parsedMessage: any) => {
        await peer.setLocalDescription(parsedMessage.payload.ans);
    }


    const handleNegotiationNeeded = async () => {
        const offer = await peer.getOffer();
        ws?.send(JSON.stringify({
            type: "peer:negotiationneeded",
            payload: {
                offer: offer,
                remoteSocketId: remoteSocketId
            }
        }))
    }

    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
        }
    }, [handleNegotiationNeeded]);


    useEffect(() => {
        peer.peer.addEventListener("track", async (ev: any) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream[0]);
        });
    }, []);



    const sendStreams = () => {
        if (!myStream) return;
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
    }

    const handleCallUser = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        const offer = await peer.getOffer();
        ws?.send(JSON.stringify({ type: "user:call-offer", payload: { offer, name, remoteSocketId } }));
        setMyStream(stream);
    }


    return (
        <div className="flex flex-col justify-center items-center">
            room
            {name && <h1>{name} joined</h1>}
            {myStream && <button onClick={sendStreams}>Send Stream</button>}
            {remoteSocketId &&
                <button className="border" onClick={handleCallUser}>Call</button>
            }
            {myStream &&
                <>
                    <h1>My Stream</h1>
                    <ReactPlayer playing muted width="700px" height="500px" url={myStream} />
                </>
            }
            {remoteStream &&
                <>
                    <h1>Remote Stream</h1>
                    <ReactPlayer playing muted width="700px" height="500px" url={remoteStream} />
                </>
            }
        </div>
    )
}

export default Room
