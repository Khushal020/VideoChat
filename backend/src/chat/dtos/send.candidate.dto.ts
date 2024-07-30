import Match from "../interfaces/match.interface";

export default interface SendCandidateDTO {
    candidate: RTCIceCandidate,
    
    match: Match,

}