import { useEffect, useState } from 'react';
import { onMessagListener, requestPermission } from '../config/messaging';
import toast, { Toaster } from 'react-hot-toast';
import Toast from './Toast';
const Notification = () => {
	const [notification, setNotification] = useState({ title: '', body: '' });

	useEffect(() => {
		if (notification?.title)
			toast.custom((t) => (
				<Toast t={t} title={notification?.title} body={notification?.body} />
			));
	}, [notification]);

	useEffect(() => {
		requestPermission();
		const unSubscribe = onMessagListener().then((payload) => {
			setNotification({
				title: payload?.notification?.title,
				body: payload?.notification?.body,
			});
		});

		return () => {
			unSubscribe.catch((err) => {
				console.error('on message listener error : ', err);
			});
		};
	}, []);
	// console.log(isTokenFound);
	// getMessageToken();

	// onMessagListener()
	// 	.then((payload) => {
	// 		setNotification({
	// 			title: payload?.notification?.title,
	// 			body: payload?.notification?.body,
	// 		});
	// 	})
	// 	.catch((err) => {
	// 		console.error('on message listener error : ', err);
	// 	});

	return <Toaster position="top-center" reverseOrder={false} />;
};

export default Notification;
