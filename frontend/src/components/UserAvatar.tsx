import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const getInitials = (name) => {
	const [firstName, lastName] = name.split(' ');
	return (firstName[0] + lastName[0]).toUpperCase();
};

export function UserAvatar({ user }) {
	return (
		<div className='relative w-8 h-8 rounded-full'>
			<img
				className='map-avatar absolute w-full h-full object-cover object-center'
				src={user.image}
			/>
		</div>
	);
}
