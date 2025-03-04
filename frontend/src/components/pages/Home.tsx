import SupervisorView from '@/components/SupervisorView';
import UserView from '@/components/UserView';
import organization from '@/data/mock.json';
import { getUserLocation } from '@/utils';
import { getCookie } from '@/utils/cookies';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
	const navigate = useNavigate();

	const [userLocation, setUserLocation] = useState(null);

	useEffect(() => {
		getUserLocation(setUserLocation);
	}, []);

	const session = JSON.parse(getCookie('session'));

	useEffect(() => {
		if (!session) {
			navigate('/login');
		}
	}, [session, navigate]);

	if (!userLocation) return '';

	return (
		<>
			{session.user.role === 'supervisor' ? (
				<SupervisorView
					organization={organization}
					userLocation={{ latitude: userLocation[0], longitude: userLocation[1] }}
					userArea={{
						name: 'Home',
						coordinates: { latitude: userLocation[0], longitude: userLocation[1] },
						radius_meters: 100,
					}}
				/>
			) : (
				<UserView user={session.user} />
			)}
		</>
	);
};

export default Home;
