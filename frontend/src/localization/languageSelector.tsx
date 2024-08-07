import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: any) => {
    i18n.changeLanguage(lng);
  };

  return (

    <div className="switch">
      <input id="language-toggle" className="check-toggle check-toggle-round-flat" type="checkbox" />
      <label htmlFor="language-toggle"></label>
      <span className="on" onClick={() => changeLanguage('rus')}>РУС</span>
      <span className="off" onClick={() => changeLanguage('eng')}>ENG</span>
    </div>
  )
}

export default LanguageSelector;