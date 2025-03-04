export async function getAllAlerts() {
	try {
		const alerts = await fetch('http://localhost:5000/alerts');
		const alertsJSON = await alerts.json();

		return { success: true, data: alertsJSON };
	} catch (error) {
		return { success: false, message: error.message };
	}
}

export async function createAlert({ userId, longitude, latitude, alertMessage = null }) {
	try {
		const newAlert = {
			user_id: userId,
			longitude,
			latitude,
			alert_type: 'medium_priority', // Default value
			alert_message: alertMessage,
			created_at: new Date().toISOString(),
		};

		const response = await fetch('http://localhost:5000/alerts', {
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

		const response = await fetch(`http://localhost:5000/alerts/${id}`, {
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
