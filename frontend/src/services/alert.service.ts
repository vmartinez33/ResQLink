const BASE_API_URL = `${import.meta.env.VITE_BASE_API_URL}/alerts`;

export async function getAllAlerts() {
	try {
		const alerts = await fetch(BASE_API_URL);
		const alertsJSON = await alerts.json();

		return { success: true, data: alertsJSON };
	} catch (error) {
		return { success: false, message: error.message };
	}
}

export async function createAlert({
	userId,
	longitude,
	latitude,
	alert_message = null,
	alert_type,
}) {
	try {
		const newAlert = {
			user_id: userId,
			longitude,
			latitude,
			alert_type,
			alert_message,
			created_at: new Date().toISOString(),
		};

		const response = await fetch(BASE_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newAlert),
		});

		if (!response.ok) {
			throw new Error('Failed to create alert');
		}

		const data = await response.json();
		return { success: true, data };
	} catch (error) {
		return { success: false, message: error.message };
	}
}

export async function updateAlert({
	id,
	user_id,
	longitude,
	latitude,
	alert_message = null,
	alert_type = 'medium_priority',
}) {
	try {
		console.log({ id, user_id, alert_message });

		const updatedAlert = {
			user_id,
			longitude,
			latitude,
			alert_type, // Default value or you can update this dynamically
			alert_message,
			updated_at: new Date().toISOString(), // Include a timestamp for the update
		};

		const response = await fetch(`${BASE_API_URL}/${id}`, {
			method: 'PUT', // Using PUT to update the alert
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedAlert),
		});

		if (!response.ok) {
			throw new Error('Failed to update alert');
		}

		const data = await response.json();
		return { success: true, data };
	} catch (error) {
		return { success: false, message: error.message };
	}
}

export async function deleteAllAlerts() {
	try {
		const alertsResponse = await fetch(BASE_API_URL);
		const alerts = await alertsResponse.json();

		// Delete each alert individually
		const deletePromises = alerts.map((alert) =>
			fetch(`${BASE_API_URL}/${alert.id}`, { method: 'DELETE' })
		);

		await Promise.all(deletePromises);

		return { success: true, message: 'All alerts deleted successfully.' };
	} catch (error) {
		return { success: false, message: error.message };
	}
}
