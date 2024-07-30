import { useState } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import VideoPlayer from './VideoPlayer';
import { useParams } from 'react-router-dom';
import { ContextProvider } from '../SocketContext';



const Video = () => {
    const urlParams = useParams();
    const [name] = useState<string>(urlParams.username ?? "");

    return (
        <ContextProvider name={name}>
            <Box>
                <Container maxW="1200px" mt="8">
                    <Heading as="h2" size="2xl"> Video Chat App </Heading>
                    <VideoPlayer />
                </Container>
            </Box>
        </ContextProvider>
    )
}

export default Video
