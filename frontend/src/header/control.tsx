import React from 'react';
import { Link } from 'react-router-dom';

const Control: React.FC = () => {
    return (
        <Link to='/home' style={{ textDecoration: 'none' }}>
            <p style={{ color: '#27272A', fontSize: '15px', margin: 0 }}>
            ⯇ Back
            </p>
        </Link>
    )
}

export default Control;