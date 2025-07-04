"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const [roomSlug, setRoomSlug] = useState<string>('');
  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        gap: '20px',
        width: '100vw',
        height: '100vh'
      }}>
        <input type="text" style={{ padding: '5px' }} onChange={(e)=>setRoomSlug(e.target.value)}/>
        <button style={{ padding: '5px' }} onClick={() => router.push(`/room/${roomSlug}`)}>Join Room</button>
      </div>
    </div>
  );
}
