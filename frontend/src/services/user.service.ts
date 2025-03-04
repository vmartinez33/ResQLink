export async function getAllUsers() {
	try {
		const users = await fetch('http://localhost:5000/users');
		const usersJSON = await users.json();

		return { success: true, data: usersJSON };
	} catch (error) {
		return { success: false, message: error.message };
	}
}

export async function login(username, password) {
	try {
		const fetchedUser = await fetch(`http://localhost:5000/users?username=${username}`);
		const [user] = await fetchedUser.json();

		console.log(user);

		if (!user) {
			return { success: false, message: 'User does not exist' };
		}

		if (user.password !== password)
			return { success: false, message: 'Passwords do not match' };

		return { success: true, data: user };
	} catch (error) {
		return { success: false, message: error.message };
	}
}
