export default interface Message{
    message: string,
    receiverId: string,
    senderId: string | null,
}