import NetworkStatus from '@/components/NetworkStatus';
import SupervisorMap from '@/components/SupervisorMap';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

// import alerts from '@/data/alerts.json';
import { useCallback, useEffect, useRef, useState } from 'react';
import { UserAvatar } from './UserAvatar';
import { CircleAlert, MapPin } from 'lucide-react';
import { getAllAlerts } from '@/services/alert.service';

const SupervisorView = ({ organization }) => {
	const [groups, setGroups] = useState(
		organization.groups.map((group) => ({
			...group,
			users: group.users.map((user) => ({
				...user,
				focused: false,
				image:
					user.image ||
					`https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70) + 1}`,
			})),
		}))
	);

	const [alerts, setAlerts] = useState([]);
	const processedAlertIds = useRef(new Set());
	const alertsMapRef = useRef(new Map()); // Store alerts by ID for comparison
	const isMounted = useRef(true);
	const newAlertsRef = useRef([]);

	const setFocus = (userId) => {
		console.log({ userId });
		setGroups((prevGroups) =>
			prevGroups.map((group) => ({
				...group,
				users: group.users.map((user) =>
					user.user_id === userId
						? { ...user, focused: true }
						: { ...user, focused: false }
				),
			}))
		);
	};

	const PRIORITY_COLORS = {
		high_priority: '255, 0, 0', // Red with 75% opacity
		medium_priority: '255, 215, 0', // Yellow with 75% opacity
		low_priority: '50, 205, 50', // Lime Green with 75% opacity
	};

	// Function to check if alert properties have changed
	const checkAlertChanges = (existingAlert, newAlert) => {
		if (!existingAlert) return null;

		const changes = {};

		// Check if alert_type has changed
		if (existingAlert.alert_type !== newAlert.alert_type) {
			changes.alert_type = {
				from: existingAlert.alert_type,
				to: newAlert.alert_type,
			};
		}

		// Check if alert_message has changed
		if (existingAlert.alert_message !== newAlert.alert_message) {
			changes.alert_message = {
				from: existingAlert.alert_message,
				to: newAlert.alert_message,
			};
		}

		return Object.keys(changes).length > 0 ? changes : null;
	};

	const fetchAlerts = useCallback(async () => {
		if (!isMounted.current) return;

		try {
			const response = await getAllAlerts();

			if (response.success && response.data) {
				const updatedAlerts = [];
				const brandNewAlerts = [];

				// Process each alert from the response
				for (const alert of response.data) {
					const existingAlert = alertsMapRef.current.get(alert.id);

					// Check if this is a new alert or an existing one with changes
					if (!existingAlert) {
						// Brand new alert we haven't seen before
						if (!processedAlertIds.current.has(alert.id)) {
							brandNewAlerts.push(alert);
							processedAlertIds.current.add(alert.id);
						}
					} else {
						// Check for changes in existing alert
						const changes = checkAlertChanges(existingAlert, alert);
						if (changes) {
							console.log(`Alert ${alert.id} has changed:`, changes);
							if (changes.alert_type) {
								console.log(
									`Alert type changed from ${changes.alert_type.from} to ${changes.alert_type.to}`
								);
							}
							if (changes.alert_message) {
								console.log(
									`Alert message changed from "${changes.alert_message.from}" to "${changes.alert_message.to}"`
								);
							}
							updatedAlerts.push(alert);
						}
					}

					// Update our reference map with the latest version of this alert
					alertsMapRef.current.set(alert.id, { ...alert });
				}

				// Handle brand new alerts
				if (brandNewAlerts.length > 0) {
					newAlertsRef.current = brandNewAlerts;

					// Update alerts state with new alerts
					setAlerts((prevAlerts) => {
						const updatedAlertsList = [...prevAlerts, ...brandNewAlerts];
						console.log('Previous alerts count:', prevAlerts.length);
						console.log('New alerts added:', brandNewAlerts.length);
						console.log('Total alerts now:', updatedAlertsList.length);
						console.log('New alert details:', brandNewAlerts);
						return updatedAlertsList;
					});
				}

				// Handle updated alerts (if any properties changed)
				if (updatedAlerts.length > 0) {
					setAlerts((prevAlerts) => {
						// Create a new array with updated alerts replacing their old versions
						const updatedAlertsList = prevAlerts.map((alert) => {
							const updatedAlert = updatedAlerts.find((a) => a.id === alert.id);
							return updatedAlert || alert;
						});

						console.log('Updated existing alerts:', updatedAlerts.length);
						return updatedAlertsList;
					});
				}
			}
		} catch (error) {
			console.error('Error fetching alerts:', error);
		}
	}, []);

	// Log whenever alerts state changes
	useEffect(() => {
		if (alerts.length > 0) {
			console.log('Alerts state updated, current count:', alerts.length);
		}
	}, [alerts]);

	useEffect(() => {
		// Set isMounted to true on component mount
		isMounted.current = true;

		// Set up the initial fetch
		fetchAlerts();

		// Set up polling interval (every 1 second as in your code)
		const intervalId = setInterval(fetchAlerts, 1000);

		// Cleanup function
		return () => {
			isMounted.current = false;
			clearInterval(intervalId);
		};
	}, [fetchAlerts]);

	return (
		<>
			<div className='groups absolute left-4 top-4 rounded-md z-[9999] bg-white'>
				<Accordion type='single' collapsible className='w-full min-w-[200px]'>
					{groups.map((group) => {
						return (
							<AccordionItem
								value={`group-${group.name}-${group.id}`}
								key={`group-${group.id}`}
							>
								<AccordionTrigger>{group.name}</AccordionTrigger>
								<AccordionContent>
									<div className='group-users flex flex-col'>
										{group.users
											.filter(
												(user) =>
													user.roles.includes('Tracked') &&
													user.network_status === 'OK'
											)
											.map((user) => {
												return (
													<div
														key={`org-user-${
															user.user_id || user.id
														}-${user.name.split(' ').join('-')}}`}
														className='group-user flex items-center gap-2 relative border p-2 cursor-pointer hover:bg-slate-100'
														onMouseEnter={() => setFocus(user.user_id)}
														onMouseLeave={() => setFocus(null)}
													>
														<UserAvatar user={user} />
														<p className='font-semibold'>{user.name}</p>
														<div className='flex-1 flex justify-end'>
															<NetworkStatus
																status={user.network_status}
															/>
														</div>
													</div>
												);
											})}
									</div>
								</AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>
			</div>
			{alerts.length > 0 && (
				<div className='alerts flex flex-col gap-2 absolute right-4 top-4 rounded-md z-[9999] bg-white p-4'>
					{alerts.map((alert) => {
						return (
							<div
								key={`alert-${alert.id}`}
								className={'alert flex items-center gap-2 p-2 text-sm'}
								style={{
									backgroundColor: `rgba(${
										PRIORITY_COLORS[alert.alert_type]
									}, .45)`,
								}}
							>
								<CircleAlert
									color={`rgba(${PRIORITY_COLORS[alert.alert_type]}, 1)`}
								/>
								<p className='flex-1 max-w-[175px]'>
									{alert.alert_message || 'Medium priority alert'}
								</p>
								<button
									onClick={() => setFocus(alert.user_id)}
									style={{ width: 'auto' }}
									className='cursor-pointer w-3'
								>
									<MapPin />
								</button>
							</div>
						);
					})}
				</div>
			)}
			<div id='map'>
				<SupervisorMap userGroups={groups} setFocus={setFocus} />
			</div>
		</>
	);
};

export default SupervisorView;
