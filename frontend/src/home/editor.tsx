import React, { useEffect, useState } from "react";
import axiosClient from "../services/axiosInstance";
import { Poll, Option } from "../interfaces/interfaces";
import { Button, Collapse, Grid, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const Editor = () => {
  const { t } = useTranslation();
  const client = axiosClient();
  const [open, setOpen] = React.useState<{ id: number; open: boolean }[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [covers, setCovers] = useState<{ id: number; cover: string }[]>([]);
  const [cover, setCover] = useState('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = React.useState('');
  const [isExtendedCover, setExtendedCover] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const polls = await client.get('/poll');
        setPolls(polls.data);
        const poll_options = await Promise.all(polls.data.map(async (poll: any) => {
          const optionsResponse = await client.get(`/poll/option/poll/${poll.id}`);
          return optionsResponse.data;
        }));
        setOptions(poll_options.flat());
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
        console.error("Error fetching data", error);
      }
    };

    fetchPollData();
  }, []);


  const selectPoll = (poll: Poll) => {
    const isOpen = open.find((openPoll) => openPoll.id === poll.id);
    if (isOpen) { 
      setOpen((prevOpen) => prevOpen.filter((openPoll) => openPoll.id !== poll.id));
      setSelectedPollId(null);
      console.log('poll is closed');
    } else {
      setOpen((prevOpen) => prevOpen.map((openPoll) => ({ ...openPoll, open: false })));
      setOpen((prevOpen) => [...prevOpen, { id: poll.id, open: true }]);
      setSelectedPollId(poll.id);
      console.log('poll is opened');
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLDataElement>, id: number, field: keyof Poll) => {
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

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, id: number, field: keyof Option) => {
    const newValue = e.target.value;
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, [field]: newValue } : option
      )
    );
  }

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

  const handleСhooseCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc('');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    polls.filter((poll) => {
      if (poll.title.includes(searchValue)) {
        return poll;
      }
    });
  }

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
          if (!selectedFile) {
            console.error('No file selected');
            return;
          }
          const formData = new FormData();
          formData.append('photo', selectedFile);
          client.post(`/cover/upload/${selectedPoll.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }).then(() => {
            console.log('Cover uploaded successfully');
          })
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
        <form action="" className="search-bar">
          <input type="search" name="search"
            placeholder={t('searchMessage')}
            onChange={handleSearch}
            pattern=".*\S.*" required />
          <button className="search-btn" type="submit">
            <span>{t('searchMessage')}</span>
          </button>
        </form>
        <Button type="submit" name="update-button" variant="contained" className="main-button">{t('saveMessage')}</Button>
        <Button type="submit" name="delete-button" variant="contained" className="main-button">{t('deleteMessage')}</Button>

        <List subheader={
          <Typography>{t('allPollMessage')}</Typography>
        }>
          {polls.map((poll) => (
            <>
              <ListItemButton key={poll.id}
                onClick={() => selectPoll(poll)}>
                {poll.id === selectedPollId ?
                <>
                <ListItemText primary={
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <Typography>{poll.title}&nbsp;</Typography>
                  <CheckCircleRoundedIcon className='status' fontSize="small"/></div>} />
                </>
                :<ListItemText primary={poll.title} />}
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open.find(open => open.id === poll.id)?.open} timeout="auto" unmountOnExit>
                <List disablePadding>
                  <ListItem sx={{ pl: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <TextField
                          variant="outlined"
                          type="text"
                          label={t('titleMessage')}
                          value={poll.title}
                          className="table-input"
                          onChange={(e) => handleInputChange(e, poll.id, 'title')}
                          autoFocus
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          type="text"
                          value={poll.link}
                          label={t('linkMessage')}
                          className="table-input"
                          onChange={(e) => handleInputChange(e, poll.id, 'link')}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          variant="outlined"
                          type="text"
                          label={t('descriptionMessage')}
                          value={poll.description}
                          className="table-input"
                          multiline
                          onChange={(e) => handleInputChange(e, poll.id, 'description')}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <select className="table-input"
                          value={poll.status}
                          onChange={(e) => handleSelectChange(e, poll.id, 'status')}>
                          <option value="active">{t('activeMessage')}</option>
                          <option value="closed">{t('closedMessage')}</option>
                        </select>
                      </Grid>
                      {previewSrc ?
                        <Grid item xs={3}>
                          <Typography>{t('previewImageMessage')}</Typography>
                          {previewSrc && <img src={previewSrc} className='big-cover' width="50" />}
                        </Grid> : <></>
                      }
                      <Grid item xs={3}>
                        {covers.find(cover => cover.id === poll.id)?.cover ?
                          <><Typography>{t('currentImageMessage')}</Typography>
                            <img src={covers.find(cover => cover.id === poll.id)?.cover}
                              className='big-cover' alt={t('coverMessage')} /> </>
                          : <></>}
                      </Grid>

                      <Grid item xs={12}>
                        <Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleСhooseCover(e)}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </Collapse >
            </>
          ))}
        </List>
      </form>
    </div >
  );
};

export default Editor;

