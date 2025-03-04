export const getUserLocation = (setUserLocation) => {
	const userLocationStorage = localStorage.getItem('userLocation');

	if (userLocationStorage) {
		setUserLocation(JSON.parse(userLocationStorage));
		return;
	}

	if (navigator.geolocation) {
		// The Geolocation API is supported
		navigator.geolocation.getCurrentPosition(
			function (position) {
				// Successfully obtained the user's location
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;

				setUserLocation([latitude, longitude]);

				localStorage.setItem('userLocation', JSON.stringify([latitude, longitude]));

				return;
			},
			function (error) {
				// Handle errors, such as the user denying permission
				console.error(`Error getting location: ${error.message}`);
			}
		);
	} else {
		// Geolocation is not supported by the browser
		console.error('Geolocation is not supported by your browser');
	}
	setUserLocation([41.3851, 2.1734]);
};

export const convertCoordinateToString = (coordinate) => {
	// Convert decimal degrees to degrees, minutes, and seconds
	const degrees = Math.floor(coordinate);
	const minutes = Math.floor((coordinate - degrees) * 60);
	const seconds = ((coordinate - degrees - minutes / 60) * 3600).toFixed(1);

	// Construct the string representation with special characters
	const result = `${degrees}°${minutes}'${seconds}"`;

	return result;
};

export const createGoogleMapsURL = (latitude, longitude) => {
	// Convert latitude and longitude to the required format for the URL
	const latString = convertCoordinateToString(latitude);
	const lngString = convertCoordinateToString(longitude);

	// Construct the Google Maps URL
	const googleMapsURL = `https://www.google.com/maps/place/${latString}+${lngString}`;

	return googleMapsURL;
};

export const formatDate = (isoString: string): string => {
	const date = new Date(isoString);

	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
	const year = date.getFullYear();
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	return `${day}/${month}/${year} ${hours}:${minutes}`;
};
