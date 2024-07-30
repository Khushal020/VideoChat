import Match from "../interfaces/match.interface";

export default interface ConnectionAnswerDTO {
    answer: RTCSessionDescriptionInit,

    match: Match,
}