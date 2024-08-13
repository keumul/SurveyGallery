import React, { useEffect, useState } from 'react'
import axiosClient from '../services/axiosInstance';
import { Poll } from '../interfaces/interfaces';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home: React.FC = (props) => {
    const { t } = useTranslation();
    const client = axiosClient();
    const [polls, setPolls] = useState<Poll[]>([]);
    const [covers, setCovers] = useState<{ id: number; cover: string }[]>([]);

    useEffect(() => {
        const fetchPollData = async () => {
            try {
                const polls = await client.get('/poll');
                setPolls(polls.data);
                const poll_covers = await Promise.all(polls.data.map(async (poll: any) => {
                    const coverResponse = await client.get(`/cover/${poll.id}`);
                    if (coverResponse.data.length !== 0) {
                        const base64Flag = 'data:image/jpeg;base64,';
                        const imageStr = arrayBufferToBase64(coverResponse.data[0].image.data);
                        return { id: poll.id, cover: base64Flag + imageStr };
                    } else {
                        return { id: poll.id, cover: '' };
                    }
                }));
                setCovers(poll_covers);
                console.log(covers);

            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchPollData();
    }, []);

    const arrayBufferToBase64 = (buffer: any) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const length = bytes.byteLength;
        for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    return (
        <>
            <form className='poll-form'>
                <div className='poll-list'>
                    {polls.map(poll => (
                        <div className='main-poll-button'>
                            <Button component={Link}
                                to={`/poll/${poll.id}`}
                                sx={{
                                    width: '290px',
                                    height: '290px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'end',
                                    alignItems: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    backgroundImage: covers.find(cover => cover.id === poll.id)?.cover ?
                                        `url(${covers.find(cover => cover.id === poll.id)?.cover})` :
                                        '#3f51b5',
                                    backgroundSize: 'cover',
                                }}>
                                <Box sx={{
                                        backgroundColor: 'rgb(250, 250, 249, 0.3)',
                                        width: '100%',
                                        textAlign: 'center',
                                        borderRadius: '5px',
                                    }}>
                                    {poll.title}<br />
                                    {poll.description}
                                </Box>
                            </Button>
                        </div>
                    )
                    )}
                </div>
            </form>
        </>
    )
}

export default Home