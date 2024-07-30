import { useCallback } from 'react';
import { Socket } from 'socket.io-client';
import Match from '../common/interfaces/match.interface';
 
export function useOffersListening(peerConnection: RTCPeerConnection, socket: Socket, match: Match) {
 
  const handleConnectionOffer = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
 
      socket.emit('answer', { answer, match });
    },
    [],
  );
 
  return {
    handleConnectionOffer,
  };
}