import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

type HeaderProps = {
    title: string
    subtitle: string
    buttonText?: string
    actionButton?: () => void
    showAccount?: boolean
}

function Header({ title, subtitle, buttonText, showAccount, actionButton }: HeaderProps) {
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setOpenDropdown(false);
        navigate('/login');
    };

    return (
        <div className="header">
            <div>
                <h2>
                    {title}
                </h2>
                <p>{subtitle}</p>
            </div>

            <div className='container-user-account'>
                {buttonText && (
                    <button className='account-user' onClick={actionButton}>{buttonText}</button>
                )}
                {showAccount && (
                    <div className="header-dropdown-wrapper" ref={dropdownRef}>
                        <button
                            type="button"
                            className='btn-account'
                            onClick={() => setOpenDropdown(prev => !prev)}
                            aria-expanded={openDropdown}
                            aria-haspopup="true"
                        >
                            <FontAwesomeIcon icon={faUser} />
                        </button>
                        {openDropdown && (
                            <div className="dropdown-menu">
                                {user && (
                                    <div className="dropdown-user-info">
                                        <span className="dropdown-user-name">{user.name}</span>
                                        <span className="dropdown-user-email">{user.email}</span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="dropdown-item dropdown-item-logout"
                                    onClick={handleLogout}
                                >
                                    <FontAwesomeIcon icon={faRightFromBracket} />
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header
