import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHouse,
    faUsers,
    faStore,
    faImage,
    faCalendarDays,
    faMicrophone,
    faStar,
    faGift,
    faTag,
    faHandshake,
    faNewspaper,
    faGear,
} from '@fortawesome/free-solid-svg-icons';
import './style.css';
import { NAVIGATION } from '../../enums/navigation.enum';
import { NavLink } from "react-router-dom";

function Navigation() {
    return (
        <div className='navigation'>
            <div className="navigation-header">
                <span className="navigation-logo">NX</span>
                <span className="navigation-title">Nexpo</span>
            </div>

            <nav className="navigation-menu">
                <NavLink to={NAVIGATION.HOME} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faHouse} />
                    </span>
                    <span className='nav-label'>Inicio</span>
                </NavLink>

                <NavLink to={NAVIGATION.CLIENTS} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faUsers} />
                    </span>
                    <span className='nav-label'>Clientes</span>
                </NavLink>

                <NavLink to={NAVIGATION.STANDS} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faStore} />
                    </span>
                    <span className='nav-label'>Stands</span>
                </NavLink>

                <NavLink to={NAVIGATION.BANNERS} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faImage} />
                    </span>
                    <span className='nav-label'>Banners</span>
                </NavLink>

                <NavLink to={NAVIGATION.EVENTS} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faCalendarDays} />
                    </span>
                    <span className='nav-label'>Eventos</span>
                </NavLink>

                <NavLink to={NAVIGATION.SPEAKERS} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faMicrophone} />
                    </span>
                    <span className='nav-label'>Oradores</span>
                </NavLink>

                <NavLink to={NAVIGATION.INFLUENCERS} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faStar} />
                    </span>
                    <span className='nav-label'>Influencers</span>
                </NavLink>

                <NavLink to={NAVIGATION.GIVEAWAY} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faGift} />
                    </span>
                    <span className='nav-label'>Sorteos</span>
                </NavLink>

                <NavLink to={NAVIGATION.CUPONS} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faTag} />
                    </span>
                    <span className='nav-label'>Cupones</span>
                </NavLink>

                <NavLink to={NAVIGATION.SPONSORS} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faHandshake} />
                    </span>
                    <span className='nav-label'>Sponsors</span>
                </NavLink>

                <NavLink to={NAVIGATION.BLOG} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faNewspaper} />
                    </span>
                    <span className='nav-label'>Blog</span>
                </NavLink>

                <NavLink to={NAVIGATION.SETTINGS} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">
                        <FontAwesomeIcon icon={faGear} />
                    </span>
                    <span className='nav-label'>Configuración</span>
                </NavLink>
            </nav>
        </div>
    )
}

export default Navigation
