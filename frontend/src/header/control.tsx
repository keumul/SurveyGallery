import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Control: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Link to='/home' style={{ textDecoration: 'none' }}>
            <p style={{ color: '#27272A', fontSize: '15px', margin: 0 }}>
            ⯇ {t('backMessage')}
            </p>
        </Link>
    )
}

export default Control;