import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navigation from './components/navigation/navigation';
import { Outlet } from 'react-router-dom';
import { MobileNavProvider, useMobileNav } from './contexts/MobileNavContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const FULL_PAGE_PATTERN = /^\/(create|edit)-/;

function MobileNavTrigger() {
    const { toggle } = useMobileNav();
    return (
        <button
            type="button"
            className="mobile-nav-trigger"
            onClick={toggle}
            aria-label="Abrir menú"
        >
            <FontAwesomeIcon icon={faBars} />
        </button>
    );
}

export default function PrivateLayout() {
    const { isAuthenticated } = useAuth();
    const { pathname } = useLocation();
    const isFullPage = FULL_PAGE_PATTERN.test(pathname);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (isFullPage) {
        return (
            <div className="container-app container-app-full">
                <div className="page page-full">
                    <Outlet />
                </div>
            </div>
        );
    }

    return (
        <MobileNavProvider>
            <div className="container-app">
                <Navigation />
                <MobileNavTrigger />
                <div className="page">
                    <Outlet />
                </div>
            </div>
        </MobileNavProvider>
    );
}
