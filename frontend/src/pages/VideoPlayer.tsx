import { Box, Button, Grid, Heading } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";


const VideoPlayer = () => {

    const { myVideo, receiverVideo, stream, receiverStream, username, receiver, next } = useContext(SocketContext)

    const [hideLocalStream, setHideLocalStream] = useState<boolean>(true)

    const [hideRemoteStream, setHideRemoteStream] = useState<boolean>(true)

    const connectNext = () => {
        next()
    }

    useEffect(() => {
        if (stream) {
            setHideLocalStream(false)
        }

        console.log('receiver stream', receiverStream)

        if (receiverStream) {
            setHideRemoteStream(false)
        }
    })

    return (
        <Grid justifyContent="center" templateColumns='repeat(2, 1fr)' mt="12">
            {/* my video */}

        {
            <Box hidden={hideLocalStream}>
                <Grid>
                    <Heading as="h5">
                        {username || 'Name'}
                    </Heading>

                    <video playsInline muted ref={myVideo} autoPlay width="600" />
                </Grid>
            </Box>
        }
              {/* user's video */}
        {
             
                <Box hidden={hideRemoteStream}>
                    <Grid>
                        <Heading as="h5">
                            {receiver?.username || 'Name'}
                        </Heading>
                        <video playsInline ref={receiverVideo} autoPlay width="600" />
                    </Grid>
                </Box>
        }

        <Button onClick={connectNext}>Next</Button>
    </Grid>
    )
}

export default VideoPlayer;