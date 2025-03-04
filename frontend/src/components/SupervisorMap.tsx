import { divIcon } from 'leaflet';
import { Marker, Popup, MapContainer, TileLayer, Circle, ZoomControl } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

import 'leaflet/dist/leaflet.css';

import { useEffect, useRef, useState } from 'react';

import { formatDate, getUserLocation } from '@/utils/index';
import { UserAvatar } from '@/components/UserAvatar';
import NetworkStatus from '@/components/NetworkStatus';

export const UserMarker = (position, icon) => (
	<Marker position={position} icon={icon}>
		<Popup>
			<p className='font-medium'>You&apos;re here!</p>
		</Popup>
	</Marker>
);

const Map = ({ userGroups, setFocus }) => {
	const [userLocation, setUserLocation] = useState(null);
	const [circle, setCircle] = useState<{ lat: number; lng: number } | null>(null);
	const [radius, setRadius] = useState(500);
	const mapRef = useRef(null);

	useEffect(() => {
		getUserLocation(setUserLocation);
	}, []);

	const allUsers = userGroups.flatMap((group) => group.users);
	const focusedUser = allUsers.find((user) => user.focused);

	useEffect(() => {
		if (mapRef.current && focusedUser) {
			const map = mapRef.current;
			map.flyTo([focusedUser.location.latitude, focusedUser.location.longitude]);
		}
	}, [focusedUser]);

	const handleMarkerClick = (coordinates, radius, userId) => {
		setCircle({ lat: coordinates.latitude, lng: coordinates.longitude });
		setRadius(radius);
		setFocus(userId);
	};

	return userLocation === null ? (
		'Loading...'
	) : (
		<MapContainer
			zoomControl={false}
			className='min-h-[400px]'
			center={userLocation}
			zoom={15}
			scrollWheelZoom={false}
			ref={mapRef}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			/>
			{circle && <Circle center={circle} radius={radius} fillColor='blue' />}

			{allUsers
				.filter((user) => user.roles.includes('Tracked') && user.network_status === 'OK')
				.map((user) => {
					const iconMarkup = renderToStaticMarkup(<UserAvatar user={user} />);

					const avatarMarker = divIcon({
						html: iconMarkup,
					});

					return (
						<Marker
							eventHandlers={{
								click: () => {
									handleMarkerClick(
										user.trust_zone.coordinates,
										user.trust_zone.radius_meters,
										user.user_id
									);
								},
								popupclose: () => setCircle(null),
							}}
							key={`map-user-${user.user_id}`}
							position={[user.location.latitude, user.location.longitude]}
							icon={avatarMarker}
						>
							<Popup>
								<div className='flex flex-col gap-2'>
									<div className='font-semibold'>
										<NetworkStatus
											absolute={true}
											status={user.network_status}
										/>
										<p>
											<strong>Name:</strong> {user.name}
										</p>
										<p>
											<strong>Network status:</strong> {user.network_status}
										</p>
										<p>
											<strong>Last connection: </strong>
											{formatDate(user.last_connection)}
										</p>
										<p>
											<strong>Latest location update: </strong>

											{formatDate(user.last_location_updated)}
										</p>
									</div>
								</div>
							</Popup>
						</Marker>
					);
				})}
			<ZoomControl position='bottomright' zoomInText='+' zoomOutText='-' />
		</MapContainer>
	);
};

export default Map;
