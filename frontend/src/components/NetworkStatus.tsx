import { cn } from '@/lib/utils';

const NetworkStatus = ({ status, absolute = false }) => {
	return (
		<div
			className={cn(
				'top-2 left-2 flex items-center gap-1 flex-row-reverse',
				absolute && 'absolute flex-row'
			)}
		>
			<div
				className={cn(
					'w-2 h-2 rounded-full',
					status === 'OK' ? 'bg-green-500' : 'bg-red-500'
				)}
			></div>
			{status !== 'OK' ? '⚠️' : ''}
		</div>
	);
};

export default NetworkStatus;
