import { Button } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === 'eng' ? 'rus' : 'eng');
  };

  return (
    <>
      <Button
        sx={{
          color: 'white',
          borderRadius: '5px',
          fontWeight: '800',
          fontSize: '13px'
        }}
        onClick={() => changeLanguage()}>{t('lng')}</Button>
    </>
  )
}

export default LanguageSelector;