import { useCallback } from 'react';
 
export function useAnswerProcessing(peerConnection: RTCPeerConnection) {
  const handleOfferAnswer = useCallback(
    (answer: RTCSessionDescriptionInit) => {
      peerConnection.setRemoteDescription(answer);
    },
    [peerConnection],
  );
 
  return {
    handleOfferAnswer,
  };
}