import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const roles = [
	{ label: 'Supervisor', value: 'supervisor' },
	{ label: 'Representant', value: 'representant' },
	{ label: 'User', value: 'user' },
] as const;

const Register = () => {
	const [selectedRole, setSelectedRole] = useState('supervisor');

	const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedRole(event.target.value);
	};

	return (
		<section className='section-auth'>
			<h2>Register</h2>

			<form className='form-auth' action=''>
				<select name='role' id='role' value={selectedRole} onChange={handleRoleChange}>
					{roles.map((role) => {
						return (
							<option key={role.value} value={role.value}>
								{role.label}
							</option>
						);
					})}
				</select>
				<Input type='text' name='username' placeholder='Username' />
				<Input type='password' name='password' placeholder='********' />
				<Button type='submit'>Register</Button>
			</form>
		</section>
	);
};

export default Register;
