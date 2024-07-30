import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import Match from '../common/interfaces/match.interface';
 
export function useOfferSending(peerConnection: RTCPeerConnection, socket: Socket, match: Match) {
 
  const sendOffer = useCallback(async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log('sending offer')
 
    socket.emit('send_connection_offer', {
      offer,
      match,
    });
  }, []);
 
  return { sendOffer };
}