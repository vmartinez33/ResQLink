import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
	const authorized = false;

	if (authorized) {
		return <Navigate to='/login' />;
	}

	return <Outlet />;
}
