import { Button } from '@/components/ui/button';
import { createAlert, updateAlert } from '@/services/alert.service';
import { getUserLocation } from '@/utils';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';

const BtnSendAlert = ({ user }) => {
	const [userLocation, setUserLocation] = useState(null);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [description, setDescription] = useState('');
	const [alert, setAlert] = useState(null);

	const handleSendAlert = async (alert_type) => {
		setPopoverOpen(true);
		console.log({ userLocation });
		console.log({ user });
		const newAlert = await createAlert({
			userId: user.id,
			alert_type,
			alert_message: `${alert_type === 'high_priority' ? 'High' : 'Low'} priority alert`,
			longitude: userLocation[0],
			latitude: userLocation[1],
		});

		setAlert(newAlert.data);

		// setTimeout(async () => {
		// 	if (!description) {
		// 		const updatedAlert = await updateAlert({
		// 			...newAlert.data,
		// 			alert_type,
		// 		});

		// 		if (updatedAlert.success) {
		// 			setAlert(updatedAlert.data);
		// 		}
		// 	}
		// }, 5000);
	};

	useEffect(() => {
		getUserLocation(setUserLocation);
	}, []);

	useEffect(() => {
		console.log({ alert, description });
		const handleAlertUpdate = async () => {
			const updatedAlert = await updateAlert({
				...alert,
				alert_message: description,
			});

			if (updatedAlert.success) {
				setAlert(updatedAlert.data);
			}
		};

		handleAlertUpdate();
	}, [description]);

	return (
		<div className='relative flex flex-col items-center'>
			<Button
				disabled={alert && alert.alert_type === 'medium_priority'}
				type='button'
				onClick={() => handleSendAlert('medium_priority')}
				className='bg-yellow-600 hover:bg-yellow-600 cursor-pointer'
				style={{ opacity: alert && alert.alert_type === 'medium_priority' ? '.75' : '1' }}
			>
				{alert && alert.alert_type === 'medium_priority'
					? 'Alert sent successfully'
					: 'Send Alert'}
			</Button>
			<Button
				disabled={alert && alert.alert_type === 'high_priority'}
				type='button'
				onClick={() => handleSendAlert('high_priority')}
				className='bg-red-600 hover:bg-red-600 cursor-pointer'
				style={{ opacity: alert && alert.alert_type === 'high_priority' ? '.75' : '1' }}
			>
				{alert && alert.alert_type === 'high_priority'
					? 'S.O.S sent successfully'
					: 'S.O.S'}
			</Button>
			{popoverOpen && (
				<div className='alert-popover absolute top-[-12px] -translate-y-full bg-white w-full p-2 rounded-md'>
					<h2>Please specify your emergency</h2>
					<p className='mb-2'>
						We sent someone to assist you, provide as many details as possible, please.
					</p>
					<Input
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						type='text'
						placeholder='Give us more details'
					/>
				</div>
			)}
		</div>
	);
};

export default BtnSendAlert;
