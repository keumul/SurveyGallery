import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Header from './header/header';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

i18n.init({
  interpolation: { escapeValue: false }, 
  lng: 'rus',                        
  resources: {
    eng: {
      translation: {
        'welcomeMessage': 'Welcome to my app!',
        'logoMessage': 'Servey Gallery',
        'loginMessage': 'Login',
        'registerMessage': 'Register',
        'logoutMessage': 'Logout',
        'nameMessage': 'FIO',
        'emailMessage': 'Email',
        'passwordMessage': 'Password',
        'codeMessage': 'Activation code',
        'addPollMessage': 'Add poll',
        'editPollMessage': 'Edit polls',
        'allPollMessage': 'All polls',
        'titleMessage': 'Title',
        'descriptionMessage': 'Description',
        'optionMessage': 'Option',
        'linkMessage': 'Link',
        'statusMessage': 'Status',
        'coverMessage': 'Cover',
        'saveMessage': 'Save',
        'deleteMessage': 'Delete',
        'activeMessage': 'Active',
        'closedMessage': 'Closed',
        'resultMessage': 'Result',
        'backMessage': 'Back',
        'winnerMessage': ' is in the lead',
        'votesMessage': ' votes',
        'cannotVoteMessage': 'You have already voted',
        'nextMessage': 'Next',
        'addOptionMessage': 'Add +',
        'optionsTitleMessage': 'Current options',
      }
    },
    rus: {
      translation: {
        'welcomeMessage': 'Добро пожаловать в мое приложение!',
        'logoMessage': 'Галерея опросов',
        'loginMessage': 'Войти',
        'registerMessage': 'Зарегистрироваться',
        'logoutMessage': 'Выйти',
        'nameMessage': 'ФИО',
        'emailMessage': 'Почта',
        'passwordMessage': 'Пароль',
        'codeMessage': 'Код активации',
        'addPollMessage': 'Добавить опрос',
        'editPollMessage': 'Редактировать опросы',
        'allPollMessage': 'Все опросы',
        'titleMessage': 'Название',
        'descriptionMessage': 'Описание',
        'optionMessage': 'Опции',
        'linkMessage': 'Ссылка',
        'statusMessage': 'Статус',
        'coverMessage': 'Обложка',
        'saveMessage': 'Сохранить',
        'deleteMessage': 'Удалить',
        'activeMessage': 'Открыть опрос',
        'closedMessage': 'Закрыть опрос',
        'resultMessage': 'Результат',
        'backMessage': 'Назад',
        'winnerMessage': ' лидирует',
        'votesMessage': ' голос(-ов)',
        'cannotVoteMessage': 'Вы уже проголосовали',
        'nextMessage': 'Далее',
        'addOptionMessage': 'Добавить +',
        'optionsTitleMessage': 'Текущие варианты ответов',
      }
    }
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Header />
        <App />
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);

reportWebVitals();
