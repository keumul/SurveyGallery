import React, { useEffect, useState } from 'react';
import axiosClient from '../services/axiosInstance';
import { Poll, Option } from '../interfaces/interfaces';
import { Alert, Button, Collapse, Divider, Grid, InputLabel, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PublishedWithChangesRoundedIcon from '@mui/icons-material/PublishedWithChangesRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const Editor = () => {
  const { t } = useTranslation();
  const client = axiosClient();
  const [open, setOpen] = React.useState<{ id: number; open: boolean }[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [covers, setCovers] = useState<{ id: number; cover: string }[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = React.useState('');
  const [searchText, setSearchText] = useState<string>('');
  const [option, setOption] = React.useState<Option>({
    id: 0,
    title: '',
    description: '',
    pollId: 0,
    votesCount: 0
  });
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [openMessage, setOpenMessage] = useState({
    open: false,
    type: ''
  });

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
        console.error('Error fetching data', error);
      }
    };

    fetchPollData();
  }, []);


  const selectPoll = (poll: Poll) => {
    const isOpen = open.find((openPoll) => openPoll.id === poll.id);
    if (isOpen) {
      setOpen((prevOpen) => prevOpen.filter((openPoll) => openPoll.id !== poll.id));
      setSelectedPollId(null);
      setOpenMessage({ open: false, type: 'none' });
    } else {
      setOpen((prevOpen) => prevOpen.map((openPoll) => ({ ...openPoll, open: false })));
      setOpen((prevOpen) => [...prevOpen, { id: poll.id, open: true }]);
      setSelectedPollId(poll.id);
    }
  };

  const addOption = () => {
    client.post(`/poll/${selectedPollId}`, option).then(() => {
      if (option.title === '') {
        setMessage(t('fieldsMessage'));
        setOpenMessage({ open: true, type: 'error-add' });
      } else {
        setMessage(t('successCreateMessage'));
        setOpenMessage({ open: true, type: 'success-add' });
        client.get(`/poll/option/poll/${selectedPollId}`).then((response) => {
          setOptions(response.data);
        }).catch((error) => {
          console.error('Error fetching options:', error);
        });
      }
    }).catch((error) => {
      console.error('Error creating option:', error);
    });
  }

  const deleteOption = (id: number) => {
    client.delete(`/poll/option/${id}`).then(() => {
      client.get(`/poll/option/poll/${selectedPollId}`).then((response) => {
        setOpenMessage({ open: false, type: '' });
        setOptions(response.data);
      }).catch((error) => {
        console.error('Error fetching options:', error);
      });
    }).catch((error) => {
      console.error('Error deleting option:', error);
    });
  }

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

  const handleOptionChange = (e: React.ChangeEvent<HTMLDataElement>, id: number, field: keyof Option) => {
    setSelectedOptionId(id);
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
        setOpenMessage({ open: false, type: '' });
      }).catch((error) => {
        console.error('Error fetching polls:', error);
      });
    }).catch((error) => {
      console.error('Error deleting poll:', error);
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

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
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
          setMessage(t('successUpdateMessage'));
          setOpenMessage({ open: true, type: 'success-update-poll' });
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
            console.error('Error fetching polls:', error);
          });
        }).catch((error) => {
          console.error('Error updating poll:', error);
        });
      }
    } else if (buttonName === 'update-option-button') {
      if (selectedOptionId) {
        client.patch(`/poll/option/${selectedOptionId}`, options.find(option => option.id === selectedOptionId)).then(() => {
          setMessage(t('successUpdateMessage'));
          setOpenMessage({ open: true, type: 'success-update' });
          client.get('/poll').then((response) => {
            setPolls(response.data);
          }).catch((error) => {
            console.error('Error fetching polls:', error);
          });

        }).catch((error) => {
          console.error('Error updating option:', error);
        });
      }
    } else if (buttonName === 'add-option-button') {
      addOption();
    } else if (buttonName === 'delete-option-button') {
      if (selectedOptionId) {
        deleteOption(selectedOptionId);
      }
    } else if (buttonName === 'search-button') {
      searchPoll(searchText);
    }
  };

  const handleChangeOption = (e: any, field: keyof Option) => {
    const { value } = e.target;
    setOption((prevOptions) => ({
      ...prevOptions,
      [field]: value,
    }));
  }

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
        <List subheader={<p className='subtitle-1'>{t('allPollMessage')}</p>}>
          <div className='header-container'>
            <div>
              <Button type='submit' name='update-button' disabled={selectedPollId ? false : true}
                variant='contained' className='main-button'>
                <PublishedWithChangesRoundedIcon />
              </Button>
              <Button type='submit' name='delete-button' variant='contained'
                disabled={selectedPollId ? false : true}
                className='main-button'>
                <DeleteForeverRoundedIcon />
              </Button>
              {selectedPollId ?
                <Alert severity='info'>
                  {t('editorInfoMessage')}
                </Alert> : <></>
              }
            </div>
            <div className='search'>
              <input type='search'
                name='search-text'
                placeholder={t('searchMessage')}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                pattern='.*\S.*'
                className='search-text'
              />
              <button name='search-button' type='submit' className='search-button'>
                <SearchRoundedIcon />
              </button>
            </div>
          </div>
          {polls.map((poll) => (
            <>
              <ListItemButton key={poll.id}
                onClick={() => {selectPoll(poll); }}>
                {poll.id === selectedPollId ?
                  <>
                    <ListItemText primary={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>{poll.title}&nbsp;</Typography>
                        <CheckCircleRoundedIcon className='status' fontSize='small' /></div>} />
                  </>
                  : <ListItemText primary={poll.title} />}
                {open.find(open => open.id === poll.id)?.open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open.find(open => open.id === poll.id)?.open} timeout='auto' unmountOnExit>
                <>{
                  openMessage.type === 'success-update-poll' ?
                    <Alert severity='success' sx={{ 'margin-top': '10px' }}>
                      {message}
                    </Alert> : <></>}
                </>
                <List disablePadding>
                  <ListItem sx={{ pl: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <TextField
                          variant='outlined'
                          type='text'
                          label={t('titleMessage')}
                          value={poll.title}
                          className='table-input'
                          onChange={(e) => handleInputChange(e, poll.id, 'title')}
                          autoFocus
                          required
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          type='text'
                          required
                          value={poll.link}
                          label={t('linkMessage')}
                          className='table-input'
                          onChange={(e) => handleInputChange(e, poll.id, 'link')}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          variant='outlined'
                          type='text'
                          label={t('descriptionMessage')}
                          value={poll.description}
                          className='table-input'
                          multiline
                          onChange={(e) => handleInputChange(e, poll.id, 'description')}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <select className='table-input'
                          value={poll.status}
                          onChange={(e) => handleSelectChange(e, poll.id, 'status')}>
                          <option value='active'>{t('activeMessage')}</option>
                          <option value='closed'>{t('closedMessage')}</option>
                        </select>
                      </Grid>
                      {previewSrc ?
                        <Grid item xs={3}>
                          <Typography>{t('previewImageMessage')}</Typography>
                          {previewSrc && <img src={previewSrc} className='big-cover' width='50' />}
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
                            type='file'
                            accept='image/*'
                            onChange={(e) => handleСhooseCover(e)}
                          />
                        </Button>
                      </Grid>
                      <Grid>
                        <Divider variant='middle' sx={{ 'margin': '10px' }} />
                        <Typography sx={{ margin: '0px 17px' }}>{t('optionsTitleMessage')}</Typography>
                        <List>
                          {options.filter(option => option.pollId === poll.id).map((option) => (
                            <ListItem key={option.id}>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <TextField
                                    variant='outlined'
                                    type='text'
                                    required
                                    label={t('titleMessage')}
                                    value={option.title}
                                    className='table-input'
                                    onChange={(e) => handleOptionChange(e, option.id, 'title')}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    variant='outlined'
                                    type='text'
                                    label={t('descriptionMessage')}
                                    value={option.description}
                                    className='table-input'
                                    onChange={(e) => handleOptionChange(e, option.id, 'description')}
                                  />
                                </Grid>
                              </Grid>
                              <Button type='submit' name='update-option-button' variant='contained' className='main-button' >
                                <PublishedWithChangesRoundedIcon />
                              </Button>
                              <Button type='submit' name='delete-option-button' variant='contained' className='main-button' >
                                <DeleteForeverRoundedIcon />
                              </Button>
                            </ListItem>
                          ))}
                          <>{
                            openMessage.type === 'success-update' ?
                              <Alert severity='success' sx={{ 'margin-top': '10px' }}>
                                {message}
                              </Alert> : <></>}
                          </>
                        </List>
                        <Grid sx={{ marginLeft: '17px' }}>
                          <Typography sx={{ marginBottom: '10px' }}>{t('addOptionMessage')}</Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <TextField
                                id='title_option'
                                name='title_option'
                                label={t('titleMessage')}
                                value={option?.title}
                                className='table-input'
                                autoComplete='off'
                                variant='outlined'
                                onChange={(e) => handleChangeOption(e, 'title')}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                id='description_option'
                                label={t('descriptionMessage')}
                                value={option?.description}
                                className='table-input'
                                multiline
                                onChange={(e) => handleChangeOption(e, 'description')}
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <Button variant='contained' className='main-button' type='submit' name='add-option-button'>
                                <AddCircleRoundedIcon />
                              </Button>
                            </Grid>
                          </Grid>
                          <>{openMessage.type === 'error-add' ?
                            <Alert severity='error' sx={{ 'margin-top': '10px' }}>
                              {message}
                            </Alert> :
                            openMessage.type === 'success-add' ?
                              <Alert severity='success' sx={{ 'margin-top': '10px' }}>
                                {message}
                              </Alert> : <></>}
                          </>
                        </Grid>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider variant='middle' sx={{ 'margin': '10px' }} />
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

