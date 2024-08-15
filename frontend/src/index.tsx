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
        'lng': 'ENG',
        'helloMessage': 'Hello',
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
        'allPollMessage': 'List of polls',
        'titleMessage': 'Title',
        'descriptionMessage': 'Description',
        'optionMessage': 'Option',
        'linkMessage': 'Link',
        'statusMessage': 'Status',
        'coverMessage': 'Cover',
        'updateMessage': 'Update',
        'deleteMessage': 'Delete',
        'activeMessage': 'Active',
        'closedMessage': 'Closed',
        'creatingMessage': 'Creating a poll',
        'creatingOptionsMessage': 'Creating options',
        'addingCoverMessage': 'Adding a cover',
        'resultMessage': 'Result',
        'backMessage': 'Back',
        'winnerMessage': 'Leaders: ',
        'votesMessage': ' votes',
        'cannotVoteMessage': 'You have already voted',
        'nextMessage': 'Next',
        'addOptionMessage': 'New option',
        'optionsTitleMessage': 'Current options',
        'searchMessage': 'Search',
        'previewImageMessage': 'Preview cover',
        'currentImageMessage': 'Current cover',
        'addPollWarningMessage': 'During the creation of the survey, you will not be able to return to the previous step. Further changes can be made on the "Poll Editor" tab',
        'editorInfoMessage': 'You can edit or delete the selected poll',
      }
    },
    rus: {
      translation: {
        'lng': 'РУС',
        'helloMessage': 'Привет',
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
        'allPollMessage': 'Список опросов',
        'titleMessage': 'Название',
        'descriptionMessage': 'Описание',
        'optionMessage': 'Опции',
        'linkMessage': 'Ссылка',
        'statusMessage': 'Статус',
        'coverMessage': 'Обложка',
        'updateMessage': 'Изменить',
        'deleteMessage': 'Удалить',
        'activeMessage': 'Открыть опрос',
        'closedMessage': 'Закрыть опрос',
        'creatingMessage': 'Создание опроса',
        'creatingOptionsMessage': 'Создание вариантов ответов',
        'addingCoverMessage': 'Добавление обложки',
        'resultMessage': 'Результат',
        'backMessage': 'Назад',
        'winnerMessage': 'Лидеры: ',
        'votesMessage': ' голос(-ов)',
        'cannotVoteMessage': 'Вы уже проголосовали',
        'nextMessage': 'Далее',
        'addOptionMessage': 'Новый вариант ответа',
        'optionsTitleMessage': 'Текущие варианты ответов',
        'searchMessage': 'Поиск',
        'previewImageMessage': 'Превью обложки',
        'currentImageMessage': 'Текущая обложка',
        'addPollWarningMessage': 'Во время создания опроса вы не сможете вернуться на предыдущий шаг. После создания изменения можно внести на вкладке "Редактор опросов".',
        'editorInfoMessage': 'Вы можете изменить или удалить выбранный опрос',
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
