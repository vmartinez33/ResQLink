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

	const handleSendAlert = async (e) => {
		e.preventDefault();
		setPopoverOpen(true);
		console.log({ userLocation });
		console.log({ user });
		const newAlert = await createAlert({
			userId: user.id,
			longitude: userLocation[0],
			latitude: userLocation[1],
		});

		setAlert(newAlert.data);

		setTimeout(async () => {
			if (!description) {
				const updatedAlert = await updateAlert({
					...newAlert.data,
					alert_type: 'high_priority',
				});

				if (updatedAlert.success) {
					setAlert(updatedAlert.data);
				}
			}
		}, 5000);
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
		<div className='relative'>
			<Button
				disabled={popoverOpen}
				type='button'
				onClick={handleSendAlert}
				className='destructive cursor-pointer'
				style={{ opacity: popoverOpen ? '.75' : '1' }}
			>
				{popoverOpen ? 'Alert sent successfully' : 'Send Alert'}
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
						name='description'
						placeholder='Give us more details'
					/>
				</div>
			)}
		</div>
	);
};

export default BtnSendAlert;
