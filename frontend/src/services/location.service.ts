export async function getGeolocation() {
	return {
		id: 'test',
		device_id: 'device_id_test',
		latitude: 1.703936,
		longitude: 41.3564928,
		created_at: new Date(),
	};
}

export async function getArea() {
	return {
		id: 'test',
		device_id: 'device_id_test',
		latitude: 1.703936,
		longitude: 41.3564928,
		area: 10,
	};
}

export async function isInsideArea(
	point: { lat: number; lng: number },
	area: { center: { lat: number; lng: number }; radius: number }
): Promise<boolean> {
	const earthRadius = 6371000; // Radius of the Earth in meters

	const toRadians = (deg: number) => (deg * Math.PI) / 180;

	const dLat = toRadians(area.center.lat - point.lat);
	const dLng = toRadians(area.center.lng - point.lng);

	const lat1 = toRadians(point.lat);
	const lat2 = toRadians(area.center.lat);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distance = earthRadius * c; // Distance in meters

	return distance <= area.radius;
}

export async function checkArea() {
	const isInArea = await fetch('https://yuvi.es/resqlink/api/geolocation/check-area');

	return isInArea;
}
