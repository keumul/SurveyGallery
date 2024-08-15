import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Control: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Link to='/home' style={{ textDecoration: 'none' }}>
            <p className='subtitle-3'>
            ⯇ {t('backMessage')}
            </p>
        </Link>
    )
}

export default Control;