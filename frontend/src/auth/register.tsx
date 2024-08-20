import { Container, CssBaseline, Box, TextField, Button, Snackbar, IconButton, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../services/axiosInstance';
import { useTranslation } from 'react-i18next';
import React from 'react';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const client = axiosClient();
  const [info, setInfo] = useState({
    FIO: '',
    email: '',
    password: '',
    activationCode: '',
    role: 'user',
  });
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isCode, setIsCode] = useState(false);

  const handleChange = (e: any) => {
    const value = e.target.value;
    setInfo({
      ...info,
      [e.target.name]: value
    });
  };

  const handleRegister = (e: any) => {
    e.preventDefault();
    const buttonName = e.nativeEvent.submitter.name;
    if (buttonName === 'register') {
      register();
    } else if (buttonName === 'code') {
      activateCode();
    }
  };

  const register = () => {
    const userData = {
      FIO: info.FIO,
      email: info.email,
      password: info.password,
      role: info.role
    };

    client.post('/auth/register', userData).then((response) => {
      setIsCode(true);
      setOpen(false);
    }).catch((error) => {
      if (error.response.status === 400) {
        setMessage(t('invalidUserMessage'));
        setOpen(true);
        setIsCode(false);
      }
    });
  }

  const activateCode = () => {
    const userData = {
      FIO: info.FIO,
      email: info.email,
      password: info.password,
      activationCode: info.activationCode
    };
    client.post('/auth/login', userData).then((response) => {
      localStorage.setItem('ACCESS_TOKEN', response.data.access_token);
      navigate('/home');
    }).catch((error) => {
      if (error.response.status === 400) {
        setMessage(t('invalidCodeMessage'));
        setOpen(true);
      }
    });
  }


  return (
    <>
      <form onSubmit={handleRegister}>
        <Container maxWidth='xs'>
          <CssBaseline />
          <Box
            sx={{
              mt: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>

            <p className='main-title' style={{ 'margin': '0px' }}>
              {t('registerMessage')}</p>
            <Box sx={{ mt: 1 }}>
              <>{!isCode ?
                <>
                  <TextField
                    required
                    margin='dense'
                    fullWidth
                    id='FIO'
                    label={t('nameMessage')}
                    name='FIO'
                    autoFocus
                    value={info.FIO}
                    onChange={handleChange}
                  />

                  <TextField
                    required
                    margin='dense'
                    fullWidth
                    id='email'
                    label={t('emailMessage')}
                    name='email'
                    autoFocus
                    value={info.email}
                    onChange={handleChange}
                  />

                  <TextField
                    sx={{ borderColor: '#fffff' }}
                    margin='dense'
                    required
                    fullWidth
                    name='password'
                    label={t('passwordMessage')}
                    type='password'
                    id='password'
                    value={info.password}
                    onChange={handleChange}
                  />
                  {open ? <Alert
                    severity='error'>
                    {message}
                  </Alert> : <></>}
                  <Button type='submit' name='register'
                    variant='contained' className='auth-button' fullWidth>
                    {t('registerMessage')}
                  </Button>
                </> :
                <>
                  <TextField
                    sx={{ borderColor: '#fffff' }}
                    margin='dense'
                    required
                    fullWidth
                    name='activationCode'
                    label={t('codeMessage')}
                    type='activationCode'
                    id='activationCode'
                    value={info.activationCode}
                    onChange={handleChange}></TextField>
                    {open ? <Alert
                    severity='error'>
                    {message}
                  </Alert> : <></>}
                  <Button type='submit' name='code'
                    variant='contained' className='auth-button' fullWidth>
                    {t('submitMessage')}
                  </Button>
                </>
              }</>
            </Box>
          </Box>
        </Container>
      </form>
    </>
  );
}

export default Register;
