import { Button } from '@/components/ui/button';
import { getCookie, removeCookie } from '@/utils/cookies';
import { LogOut } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
	const navigate = useNavigate();

	const session = JSON.parse(getCookie('session'));

	const handleLogout = () => {
		removeCookie('session');
		navigate('/login');
	};

	return (
		<>
			<header className='flex justify-between items-center py-2 px-4'>
				<h1 className='text-3xl font-bold'>ResQLink</h1>
				<div className='flex items-center gap-2 whitespace-nowrap'>
					{session && (
						<>
							<p>Hello, {session.user.username}</p>
							<Button onClick={handleLogout} style={{ width: 'auto' }}>
								<LogOut className='w-4' color='#fff' />
							</Button>
						</>
					)}
				</div>
			</header>
			<main>
				<Outlet />
				<Toaster />
			</main>
		</>
	);
};

export default Layout;
