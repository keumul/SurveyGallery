import { Box, Button, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import axiosClient from '../services/axiosInstance';
import { Poll } from '../interfaces/interfaces';
import { useParams } from 'react-router-dom';
import Control from '../header/control';

const PollCard: React.FC = () => {
    const client = axiosClient();
    const [poll, setPoll] = useState<Poll>();
    const { pollId } = useParams<{ pollId: string }>();
    const [winner, setWinner] = useState<string>();
    const [maxVotes, setMaxVotes] = useState<number>(0);
    const [selectedOptions, setSelectedOptions] = useState<number | null>(null);
    const [answerIsOpen, setAnswerIsOpen] = useState<boolean>(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [image, setImage] = useState('');

    useEffect(() => {
        client
            .get(`/poll/${pollId}`)
            .then((response) => {
                setPoll(response.data);
                client
                    .get(`/poll/vote/${pollId}`)
                    .then((response) => {
                        console.log(response.data);
                        if (response.data === true) {
                            setAnswerIsOpen(true);
                            handleResult();
                            console.log('User already voted');
                        }
                    })
                client.
                    get(`/cover/${pollId}`).
                    then(buffer => {
                        const base64Flag = 'data:image/jpeg;base64,';
                        const imageStr = arrayBufferToBase64(buffer.data[0].image.data);
                        setImage(base64Flag + imageStr);
                    }).catch((error) => {
                        console.error("Error fetching image:", error);
                    })
            })
            .catch((error) => {
                console.error("Error fetching polls:", error);
            });
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

    const handleOptionChange = (optionId: number) => {
        setSelectedOptions(optionId);
    };

    const handleResult = () => {
        client
            .get(`/poll/winner/${pollId}`)
            .then((response) => {
                setWinner(response.data.title);
                setMaxVotes(response.data.votesCount);
            })
            .catch((error) => {
                console.error("Error fetching winner:", error);
            });
    }

    const handleSubmit = () => {
        if (selectedOptions === null) {
            console.error('No option selected');
            return;
        }

        client.post(`/poll/:userId/${selectedOptions}`, { optionId: selectedOptions })
            .then(() => {
                handleResult();
                setAnswerIsOpen(true);
            })
            .catch((error) => {
                setErrorMessages(error.response.data.message);
                console.error('Error:', error.message);
            });
    };

    return (
        <>
            <div>
                <div className="poll-card">
                    <Control />
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <p className='main-title'>{poll?.title}</p>
                        <div key={pollId} className='poll-info'>
                            <FormControl component="fieldset" disabled={answerIsOpen}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <RadioGroup
                                    aria-label={poll?.title}
                                    name={`poll-${pollId}`}
                                    value={selectedOptions || ''} >
                                    {poll?.options.map(option => (
                                        <FormControlLabel
                                            key={option.id}
                                            value={option.id.toString()}
                                            control={<Radio />}
                                            label={
                                                <div>
                                                    {option.title}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 170,
                                                                height: 10,
                                                                backgroundColor: 'grey.300',
                                                                borderRadius: 1,
                                                                position: 'relative'
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: `${(option.votesCount / maxVotes) * 100}%`,
                                                                    height: '100%',
                                                                    background: 'linear-gradient(10deg, #06B6D4, #3B82F6, #8B5CF6)',
                                                                    borderRadius: 1,
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="caption">
                                                        {option.votesCount} votes
                                                    </Typography>
                                                </div>
                                            }
                                            onChange={() => handleOptionChange(option.id)}
                                        />
                                    ))}
                                </RadioGroup>
                                {answerIsOpen ? (
                                    <p className='tip-title'>You cannot vote again</p>
                                ) : (<p></p>)}
                            </FormControl>
                            <FormControl>
                                <img src={image} className='cover'/>
                                <h1 className='tip-title'>{poll?.link}</h1>
                            </FormControl>
                        </div>

                        <Button sx={{ align: 'center' }}
                            type="submit"
                            variant="outlined"
                            disabled={selectedOptions === null || answerIsOpen}>Result</Button>
                        {answerIsOpen ? (
                            <p className='info-title'>Current winner is
                                <span className='higlight-title'> {winner}</span>
                            </p>
                        ) : (
                            <p>{errorMessages}</p>
                        )}
                    </form>
                </div>
            </div>
        </>
    )
}

export default PollCard