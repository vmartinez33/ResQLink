import { divIcon } from 'leaflet';
import { Marker, Popup, MapContainer, TileLayer, useMapEvents, Circle } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from 'react';

import { getUserLocation } from '@/utils';
import { UserAvatar } from '@/components/UserAvatar';

const Map = ({ user }) => {
	const [userLocation, setUserLocation] = useState(null);

	const [circle, setCircle] = useState<{ lat: number; lng: number } | null>(null);
	const [radius, setRadius] = useState(500);

	useEffect(() => {
		getUserLocation(setUserLocation);
	}, []);

	const iconMarkup = renderToStaticMarkup(<UserAvatar user={user} />);

	const avatarMarker = divIcon({
		html: iconMarkup,
	});

	const MapClickHandler = () => {
		useMapEvents({
			click(e) {
				setCircle({ lat: e.latlng.lat, lng: e.latlng.lng });
			},
		});
		return null;
	};

	return userLocation === null ? (
		'Loading...'
	) : (
		<>
			<MapContainer
				className='min-h-[400px]'
				center={userLocation}
				zoom={14}
				scrollWheelZoom={false}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				<Marker position={userLocation} icon={avatarMarker}>
					<Popup>
						<p className='font-medium'>You&apos;re here!</p>
					</Popup>
				</Marker>
				<MapClickHandler />
				{/* {circle && <Circle center={circle} radius={radius} fillColor='blue' />} */}
			</MapContainer>
		</>
	);
};

export default Map;
