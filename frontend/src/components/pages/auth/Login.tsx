import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie, setCookie } from '@/utils/cookies';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/services/user.service';

const Login = () => {
	const navigate = useNavigate();

	const session = JSON.parse(getCookie('session'));

	const [formData, setFormData] = useState({ username: '', password: '' });

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Generate random token (without libraries)
	const generateToken = () => {
		return Math.random().toString(36).substring(2) + Date.now().toString(36);
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		const loginResponse = await login(formData.username, formData.password);

		console.log(loginResponse);

		if (!loginResponse.success) {
			alert(loginResponse.message);
			return;
		}

		// Generate and store token
		const token = generateToken();
		setCookie('session', JSON.stringify({ token, user: loginResponse.data }), 7);

		// Redirect to /home
		navigate('/');
	};

	useEffect(() => {
		if (session) {
			navigate('/');
			return;
		}
	}, [session, navigate]);

	return (
		<section className='section-auth pt-32 w-[540px] max-w-full mx-auto'>
			<h2 className='text-center'>Log In</h2>
			<form className='form-auth' onSubmit={handleSubmit}>
				<Input
					value={formData.username}
					type='text'
					name='username'
					placeholder='Username'
					onChange={handleChange}
				/>
				<Input
					value={formData.password}
					type='password'
					name='password'
					placeholder='********'
					onChange={handleChange}
				/>
				<Button type='submit'>Log In</Button>
			</form>
		</section>
	);
};

export default Login;
