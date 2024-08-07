import React, { useEffect, useState } from 'react'
import axiosClient from '../services/axiosInstance';
import { Poll } from '../interfaces/interfaces';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home: React.FC = (props) => {
    const { t } = useTranslation();
    const client = axiosClient();
    const [polls, setPolls] = useState<Poll[]>([]);

    useEffect(() => {
        client
            .get("/poll")
            .then((response) => {
                setPolls(response.data);
                
            })
            .catch((error) => {
                console.error("Error fetching polls:", error);
            });
    }, []);

    return (
        <>
            <form className='poll-form'>
                <div className='poll-list'>
                    {polls.map(poll => (
                        <div className='main-button'>
                            <Button component={Link}
                                to={`/poll/${poll.id}`}
                                sx={{
                                    width: '300px',
                                    height: '300px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    background: '#818CF8',
                                    '&:hover': {
                                        backgroundColor: 'darkgrey',
                                    }
                                }}>
                                {poll.title}
                                <p>{poll.description}</p>
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