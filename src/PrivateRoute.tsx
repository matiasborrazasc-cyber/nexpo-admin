import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navigation from './components/navigation/navigation';
import { Outlet } from 'react-router-dom';

const FULL_PAGE_PATTERN = /^\/(create|edit)-/;

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
        <div className="container-app">
            <Navigation />
            <div className="page">
                <Outlet />
            </div>
        </div>
    );
}
