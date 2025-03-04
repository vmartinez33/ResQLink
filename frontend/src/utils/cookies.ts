export function setCookie(name, value, days = 7) {
	const expires = new Date();
	expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
	document.cookie = `${name}=${encodeURIComponent(
		value
	)}; expires=${expires.toUTCString()}; path=/`;
}

export function getCookie(name) {
	const cookies = document.cookie.split('; ');
	for (let cookie of cookies) {
		const [key, value] = cookie.split('=');
		if (key === name) {
			return decodeURIComponent(value);
		}
	}
	return null;
}

export function removeCookie(name) {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
