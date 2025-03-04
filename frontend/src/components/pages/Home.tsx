import SupervisorView from '@/components/SupervisorView';
import UserView from '@/components/UserView';
import organization from '@/data/mock.json';
import { getCookie } from '@/utils/cookies';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
	const navigate = useNavigate();

	const session = JSON.parse(getCookie('session'));

	useEffect(() => {
		if (!session) {
			navigate('/login');
		}
	}, [session, navigate]);

	return (
		<>
			{session.user.role === 'supervisor' ? (
				<SupervisorView organization={organization} />
			) : (
				<UserView user={session.user} />
			)}
		</>
	);
};

export default Home;
