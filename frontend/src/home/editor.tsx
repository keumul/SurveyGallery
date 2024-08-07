import React, { useEffect, useState } from "react";
import axiosClient from "../services/axiosInstance";
import { Poll } from "../interfaces/interfaces";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const Editor = () => {
  const { t } = useTranslation();
  const client = axiosClient();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newPoll, setNewPoll] = useState<Poll | null>(null);
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [covers, setCovers] = useState([]);

  useEffect(() => {
    client.get('/poll').then((response) => {
      setPolls(response.data);
      client.get('/cover').then((response) => {
        for(let i = 0; i < response.data.length; i++) {
          const base64Flag = 'data:image/jpeg;base64,';
          const imageStr = arrayBufferToBase64(response.data[i].image.data);
          setCovers(response.data.map((cover: any) => base64Flag + imageStr));
          console.log(covers);
          
        }
      }).catch((error) => {
        console.error("Error fetching covers:", error);
      });
    }).catch((error) => {
      console.error("Error fetching polls:", error);
    });
  }, []);

  const selectPoll = (poll: Poll) => {
    setSelectedPollId(poll.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: number, field: keyof Poll) => {
    const newValue = e.target.value;
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === id ? { ...poll, [field]: newValue } : poll
      )
    );
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, id: number, field: keyof Poll) => {
    const newValue = e.target.value;
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === id ? { ...poll, [field]: newValue } : poll
      )
    );
  }

  // const addRow = () => {
  //   const maxId = Math.max(...polls.map(poll => poll.id));
  //   const newId = maxId + 1;
  //   const newPoll: Poll = { id: newId, title: '', description: '', link: '', status: 'active', type: 'poll', creatorId: 1, coverId: 1, options: [] };
  //   setPolls([...polls, newPoll]);
  // };

  const deleteRow = (id: number) => {
    client.delete(`/poll/${id}`).then(() => {
      client.get('/poll').then((response) => {
        setPolls(response.data);
      }).catch((error) => {
        console.error("Error fetching polls:", error);
      });
    }).catch((error) => {
      console.error("Error deleting poll:", error);
    });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0]; 
    if (file) {
      const reader = new FileReader(); 
      reader.onloadend = () => {
        const photoData = reader.result as string; 
        client.post(`/cover/upload/${id}`, { image: photoData }).then(() => {
          client.get('/cover').then((response) => {
            console.log(response.data);
          }).catch((error) => {
            console.error("Error fetching covers:", error);
          });
        }).catch((error) => {
          console.error("Error uploading cover:", error);
        });
      };
        // setPolls((prevPolls) => 
        //   prevPolls.map((poll) =>
        //     poll.id === id ? { ...poll, photo: photoData } : poll
        //   )
        // );
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const buttonName = e.nativeEvent.submitter.name;
    if (buttonName === 'delete-button') {
      if (selectedPollId) {
        deleteRow(selectedPollId);
      } else {
        console.log('no');
      }
    } else if (buttonName === 'update-button') {
      const selectedPoll = polls.find(poll => poll.id === selectedPollId);
      if (selectedPoll) {
        client.patch(`/poll/${selectedPoll.id}`, selectedPoll).then(() => {
          client.get('/poll').then((response) => {
            setPolls(response.data);
          }).catch((error) => {
            console.error("Error fetching polls:", error);
          });
        }).catch((error) => {
          console.error("Error updating poll:", error);
        });
      }
    }
  };

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
    <div>
      <form onSubmit={handleSubmit}>
        <Button type="submit" name="update-button" variant="contained" className="main-button">{t('saveMessage')}</Button>
        <Button type="submit" name="delete-button" variant="contained" className="main-button">{t('deleteMessage')}</Button>
        <Typography></Typography>
        <TableContainer component={Paper}>
          <Table className="main-table">
            <TableHead>
              <TableRow sx={{
                '&:last-child td, &:last-child th':
                {
                  color: '#374151;',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }
              }}>
                <TableCell>{t('titleMessage')}</TableCell>
                <TableCell>{t('descriptionMessage')}</TableCell>
                <TableCell>{t('linkMessage')}</TableCell>
                <TableCell>{t('statusMessage')}</TableCell>
                <TableCell>{t('coverMessage')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {polls.map((poll) => (
                <TableRow
                  key={poll.id}
                  onClick={() => selectPoll(poll)}
                >
                  {selectedPollId !== poll.id ? (
                    <>
                      <TableCell component="th" scope="row">{poll.title}</TableCell>
                      <TableCell>{poll.description}</TableCell>
                      <TableCell>{poll.link}</TableCell>
                      <TableCell>{poll.status}</TableCell>
                      <TableCell>
                      <img src={covers[poll.coverId]} className='small-cover'/>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell component="th" scope="row">
                        <input
                          type="text"
                          value={poll.title}
                          className="table-input"
                          onChange={(e) => handleInputChange(e, poll.id, 'title')}
                          autoFocus
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={poll.description}
                          className="table-input"
                          onChange={(e) => handleInputChange(e, poll.id, 'description')}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="text"
                          value={poll.link}
                          className="table-input"
                          onChange={(e) => handleInputChange(e, poll.id, 'link')}
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={poll.status}
                          onChange={(e) => handleSelectChange(e, poll.id, 'status')}>
                          <option value="active">{t('activeMessage')}</option>
                          <option value="closed">{t('closedMessage')}</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, poll.id)}
                        />
                        {poll.coverId && (
                          <img
                            src={poll.coverId.toString()}
                            alt="cover"
                            style={{ width: '50px', height: '50px', marginTop: '10px' }}
                          />
                        )}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    </div>
  );
};

export default Editor;

