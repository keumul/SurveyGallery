import React, { useEffect, useState } from 'react'
import axiosClient from '../services/axiosInstance';
import { Poll } from '../interfaces/interfaces';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const Home: React.FC = (props) => {
    const { t } = useTranslation();
    const client = axiosClient();
    const [polls, setPolls] = useState<Poll[]>([]);
    const [covers, setCovers] = useState<{ id: number; cover: string }[]>([]);
    const [searchText, setSearchText] = useState('');

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
            } catch (error) {
                console.error('Error fetching data', error);
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

    const handleSearch = () => {
        searchPoll(searchText);
    }

    const searchPoll = (searchText: string) => {
        setPolls(polls.filter(poll => poll.title.toLowerCase().includes(searchText.toLowerCase())));
        if (searchText === '') {
            client.get('/poll').then((response) => {
                setPolls(response.data);
            }).catch((error) => {
                console.error('Error fetching polls:', error);
            });
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        handleSearch();
    }


    return (
        <>
            <form className='poll-form' onSubmit={handleSubmit}>
                    <div className='search'>
                        <input type='search'
                            name='search-text'
                            placeholder={t('searchMessage')}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            pattern='.*\S.*'
                            className='search-text'/>
                        <button type='submit' className='search-button'>
                            <SearchRoundedIcon />
                        </button>
                    </div>

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
                                    borderRadius: '5px 5px 0 0',
                                }}>
                            </Button>
                            <Box sx={{
                                backgroundColor: 'white',
                                width: '100%',
                                textAlign: 'center',
                                borderRadius: '0 0 5px 5px',
                                height: '80px',
                            }}>
                                <p className='subtitle-1'>{poll.title}</p>
                            </Box>
                        </div>
                    )
                    )}
                </div>
            </form>
        </>
    )
}

export default Home