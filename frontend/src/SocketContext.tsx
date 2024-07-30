import { createContext, useState, useRef, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import User from './common/interfaces/user.interface';
import MatcherDTO from './common/dtos/matcher.dto';
import Match from './common/interfaces/match.interface';
import ConnectionOfferDTO from './common/dtos/connection.offer.dto';
import ConnectionAnswerDTO from './common/dtos/connection.answer.dto';
import SendCandidateDTO from './common/dtos/send.candidate.dto';


type SocketContextType = {
    myVideo: React.MutableRefObject<HTMLVideoElement | null> | null,
    receiverVideo: React.MutableRefObject<HTMLVideoElement | null> | null,
    stream: MediaStream | null,
    receiverStream: MediaStream | null,
    username: string,
    me: User | null,
    receiver: User | null,

    setUserName: Function,
    next: Function,
}

const SocketContext = createContext<SocketContextType>({
    myVideo: null,
    receiverVideo: null,
    stream: null,
    receiverStream: null,
    username: "",
    me: null,
    receiver: null,
    setUserName: () => {},
    next: () => {},
});
const ContextProvider = ({ children, name }: {children: React.ReactNode, name: string}) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [receiverStream, setReceiverStream] = useState<MediaStream | null>(null);
    const [username, setUserName] = useState<string>(name);
    const [socket, setSocket] = useState<Socket | null>(null);
    const myVideo = useRef<HTMLVideoElement | null>(null);
    const receiverVideo = useRef<HTMLVideoElement | null>(null);
    const [responsible, setResponsible] = useState<boolean|null>(null);
    const connectionRef = useRef<RTCPeerConnection>();
    const [me, setMe] = useState<User|null>(null)
    const [receiver, setReceiver] = useState<User|null>(null)

    const next = () => {
        connectionRef.current = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun2.1.google.com:19302' }],
        })
        socket?.emit('next', {user1: me, user2: receiver})
    }
    
    useEffect(() => {

        const sendAnswer = async (peerConnection: RTCPeerConnection, socket: Socket, offer: RTCSessionDescriptionInit, match: Match) => {
    
            await peerConnection.setRemoteDescription(offer);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            console.log(peerConnection)
        
            socket.emit('answer', { answer, match });
        }
        
        if (username === "") {
            return;
        }

        const connection = io(import.meta.env.VITE_REMOTE_URL, {
            extraHeaders: {
                username: username
            },
            reconnection: true,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 5000,
        });

        setSocket(connection)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
            setStream(currentStream);
            
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }
        })

        connection.on('connected', (data: User) => {
            setMe(data)
        })

        connection.on("matchedReceiver", (data: MatcherDTO) => { 
            setReceiver(data.receiver)
            setResponsible(data.responsible)

            console.log(data.receiver, me)
        })

        connection.on('send_connection_offer', (data: ConnectionOfferDTO) => {
            if (connectionRef.current) {
                sendAnswer(connectionRef.current, connection, data.offer, {user1: data.match.user2, user2: data.match.user1})
            }
        })

        connection.on('send_candidate', (data: SendCandidateDTO) => {
            console.log('receive icecandidate', connectionRef.current)
            connectionRef.current?.addIceCandidate(data.candidate)
        })

        connection.on('answer', (data: ConnectionAnswerDTO) => {
            if(connectionRef.current) {
                connectionRef.current.setRemoteDescription(data.answer);
                console.log(connectionRef.current)
            }

        })

        connection.on('is_valid_match', (data: boolean) => {
            if (!data) {
                setReceiver(null)
                setResponsible(null)
                setReceiverStream(null)
                if (receiverVideo.current) {
                    receiverVideo.current.srcObject = receiverStream
                }
            }
        })


        // const peer = new Peer({ initiator: false, trickle: false, stream });

        // peer.on('stream', (currentStream: MediaStream) => {
        //     receiverVideo.current.srcObject = currentStream;
        // });

        //connectionRef.current = peer;

        return () => { socket?.close() }
    }, [username]);

    useEffect(() => {
        
        if (!socket || !me || !receiver || responsible === null || !stream) {
            return
        }

        const interval = setInterval(() => {
            console.log(me, receiver, 'valid match')

            if (me && receiver) {

                console.log('is_valid_match', me, receiver)
                socket?.emit('is_valid_match', {user1: me, user2: receiver})
            }
        }, 5000)

        const sendOffer = async (peerConnection: RTCPeerConnection, socket: Socket, match: Match) => {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
        
            socket.emit('send_connection_offer', {
                offer,
                match,
            });
        }

        const match = {user1: me, user2: receiver} as Match

        console.log('match', match)

        connectionRef.current = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun2.1.google.com:19302' }],
        })

        connectionRef.current.addEventListener('icecandidate', ({ candidate }) => {
            console.log('sending icecandidate', match)
            socket.emit('send_candidate', { candidate,  match});
        })

        connectionRef.current.addEventListener('track', ({ streams }) => {

            console.log('receiver stream', receiverVideo)
            setReceiverStream(streams[0])

            if (receiverVideo.current) {
                receiverVideo.current.srcObject = streams[0]
            }
        })

        stream.getTracks().forEach((track) => {
            console.log(connectionRef.current)
            if (connectionRef.current) {
                connectionRef.current.addTrack(track, stream)
            }
        })


        if (responsible) {

            sendOffer(connectionRef.current, socket, match)

        }

        return () => {clearInterval(interval)}

    }, [me, socket, receiver, responsible, stream])

    // useEffect(() => {

    //     if (!stream) { 
    //         return
    //     }

    //     console.log('setting stream track')

        
    // }, [stream])
    
    return (
        <SocketContext.Provider value={{
            myVideo,
            receiverVideo,
            stream,
            receiverStream,
            username,
            setUserName,
            me,
            receiver,
            next,
        }}
        >
            {children}
        </SocketContext.Provider>
    );
};
export { ContextProvider, SocketContext };
