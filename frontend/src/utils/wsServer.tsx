import { useEffect, createContext, useContext, useState, ReactNode } from "react";

const SocketContext = createContext<WebSocket | null>(null);

// Custom hook to use WebSocket context
export const useWebSocket = () => {
    return useContext(SocketContext);
};

// ✅ Corrected: This is a function component, not a function!
export const WsServer = ({ children }: { children: ReactNode }) => {
    const [ws, setWs] = useState<WebSocket | null>(null); // ✅ useState is inside a function component

    useEffect(() => {
        const websocket = new WebSocket("ws://localhost:8080");

        websocket.onopen = () => {
            console.log("Connected to WebSocket Server");
            setWs(websocket);
        };

        websocket.onclose = () => {
            console.log("WebSocket disconnected");
            setWs(null);
        };

        return () => {
            websocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={ws}>
            {children}
        </SocketContext.Provider>
    );
};
