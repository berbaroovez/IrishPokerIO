import { Socket } from "socket.io-client"
import { Game } from "../../util/types"

interface props {
    gameState: Game
    socketState: Socket | null
    room: string
}


const DebugMenu = ({gameState, socketState,room}:props)=>{



    return (
        <div>

            <button onClick={()=>{
                socketState?.emit("flipCards",{room:room})
            }}>Flip Cards</button>
            <code>
                {
                    JSON.stringify(gameState, null, 4)
                }
            </code>
        </div>
    )

}

export default DebugMenu