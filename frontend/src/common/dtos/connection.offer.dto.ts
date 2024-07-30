import Match from "../interfaces/match.interface";

export default interface ConnectionOfferDTO {
    offer: RTCSessionDescriptionInit,

    match: Match,
}