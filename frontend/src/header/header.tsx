import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import AddToPhotosRoundedIcon from '@mui/icons-material/AddToPhotosRounded';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import BallotRoundedIcon from '@mui/icons-material/BallotRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import axiosClient from '../services/axiosInstance';
import { User } from '../interfaces/interfaces';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../localization/languageSelector';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const client = axiosClient();
    const navigate = useNavigate();
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [user, setUser] = React.useState<User>();
    const [isRegistered, setIsRegistered] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);

    const handleNavigation = () => {
        navigate('/home');
    };

    useEffect(() => {
        getUser();
    })

    const logout = () => {
        navigate('/home');
        localStorage.removeItem('ACCESS_TOKEN');
        setIsRegistered(false);
    }

    const getUser = () => {
        client.get('/users/me').then((response) => {
            if (response.data) {
                setIsRegistered(true);
                if (response.data.role === 'admin') {
                    setIsAdmin(true);
                }
            } else {
                setIsRegistered(false);
            }
        }).catch((error) => {
            console.error('Error fetching user:', error);
        }
        );
    }

    const toggleDrawer = (newOpen: boolean) => () => {
        client.get('/users/me').then((response) => {
            if (response.data) {
                setUser(response.data);
            }
        }).catch((error) => {
            console.error('Error fetching user:', error);
        });
        setOpenDrawer(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role='presentation' onClick={toggleDrawer(false)}>
            <Box>
                <p className='main-title'>{t('helloMessage')}, {user?.FIO}!</p>
            </Box>
            <List>
                {[t('allPollMessage'), t('addPollMessage'), t('editPollMessage')].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        {index === 0 ?
                            <ListItemButton component={Link} to='/home'>
                                <BallotRoundedIcon />
                                <ListItemText primary={text} sx={{ margin: '0 0 0 30px' }} />
                            </ListItemButton> : index === 1 ? <ListItemButton component={Link} to='/creator'>
                                <AddToPhotosRoundedIcon />
                                <ListItemText primary={text} sx={{ margin: '0 0 0 30px' }} />
                            </ListItemButton> : <ListItemButton component={Link} to='/editor'>
                                <AutoFixHighRoundedIcon />
                                <ListItemText primary={text} sx={{ margin: '0 0 0 30px' }} />
                            </ListItemButton>}
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {[t('logoutMessage')].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={logout}>
                            <ListItemIcon>
                                <LogoutRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <AppBar position='static'
            sx={{ background: '#488eff' }}
        >
            <Toolbar>
                {isRegistered && isAdmin ?
                    <><IconButton onClick={toggleDrawer(true)}
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                        sx={{ mr: 2 }}
                    ><MenuIcon /></IconButton>
                        <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
                            {DrawerList}
                        </Drawer></>
                    : <></>
                }
                <div className='header-container'>
                    <p className='logo-title'
                        onClick={handleNavigation}>{t('logoMessage')}</p>
                    <div><LanguageSelector />
                        {!isRegistered ?
                            <>
                                <Button color='inherit' component={Link} to='/login'>{t('loginMessage')}</Button>
                                <Button color='inherit' component={Link} to='/register'>{t('registerMessage')}</Button>
                            </> : isRegistered && !isAdmin ? 
                            <>
                            <Button onClick={logout} color='inherit' >
                                <LogoutRoundedIcon />
                            </Button>
                            </>
                                : <></>
                        }
                    </div>
                </div>
            </Toolbar>
        </AppBar >
    );
}

export default Header;
