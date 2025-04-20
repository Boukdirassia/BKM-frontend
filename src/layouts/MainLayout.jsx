import { useLocation, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const MainLayout = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#ffffff',
        }}>
            {!isAdminRoute && !isAuthRoute && <Navbar />}
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>
            {!isAdminRoute && !isAuthRoute && <Footer />}
        </Box>
    );
};

export default MainLayout;