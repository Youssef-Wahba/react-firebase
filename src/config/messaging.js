import { getToken, onMessage } from 'firebase/messaging';
// import { onBackgroundMessage } from 'firebase/messaging/sw';
import { firestore, messaging } from './firebase.js';
import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	setDoc,
	updateDoc,
} from 'firebase/firestore';

// export const requestPermission = () => {
// 	console.log('Requesting permission...');
// 	Notification.requestPermission().then((permission) => {
// 		if (permission === 'granted')
// 			console.log('Notification permission granted.');
// 		else
// 			console.log('Notification permission denied.');
//
// 	});
// };
export const requestPermission = () => {
	console.log('Requesting permission...');
	Notification.requestPermission().then((permission) => {
		if (permission == 'granted') {
			console.log('permission granted');
			return getToken(messaging, {
				vapidKey: import.meta.env.VITE_FIREBASE_VAP_ID_KEY,
			})
				.then((currentToken) => {
					if (currentToken) {
						console.log('current token for client: ', currentToken);
						// Track the token -> client mapping, by sending to backend server
						// show on the UI that permission is secured
						// setTokenFound(true);
					} else {
						console.log(
							'No registration token available. Request permission to generate one.'
						);
						// shows on the UI that permission is required
						// setTokenFound(false);
					}
				})
				.catch((err) => {
					console.error('An error occurred while retrieving token. ', err);
				});
		}
	});
};
// export const getMessageToken = () => {
// 	// let currentToken = '';
// 	// try {
// 	// 	currentToken = await getToken(messaging, {
// 	// 		vapidKey: import.meta.env.VITE_FIREBASE_VAP_ID_KEY,
// 	// 	});
// 	// 	currentToken && setTokenFound(true);
// 	// 	!currentToken && setTokenFound(false);
// 	// } catch (err) {
// 	// 	console.error('An error occurred while retrieving token. ', err);
// 	// }
// 	console.log('oonfire');

// 	return getToken(messaging, {
// 		vapidKey:
// 			'BB1Xn_4fuDVASD97U3pLgB7Wef-DZ-GfuAVSGRUuNuWy1Ww9lWJN7FGwVLWO97b-sxKi6uRv0BCl8aVIQko93GQ',
// 	})
// 		.then((currentToken) => {
// 			if (currentToken) {
// 				console.log('current token for client: ', currentToken);
// 				// Track the token -> client mapping, by sending to backend server
// 				// show on the UI that permission is secured
// 				// setTokenFound(true);
// 			} else {
// 				console.log(
// 					'No registration token available. Request permission to generate one.'
// 				);
// 				// shows on the UI that permission is required
// 				// setTokenFound(false);
// 			}
// 		})
// 		.catch((err) => {
// 			console.error('An error occurred while retrieving token. ', err);
// 		});
// };
const databaseRef = doc(
	collection(firestore, 'notifications'),
	'notifications'
);
// Foreground messages
export const onMessagListener = () => {
	return new Promise((resolve) => {
		onMessage(messaging, async (payload) => {
			console.log('Received foreground message : ', payload);
			const docSnapshot = await getDoc(databaseRef);
			if (docSnapshot.exists()) {
				await updateDoc(databaseRef, {
					notifications: arrayUnion({
						title: payload.notification.title,
						body: payload.notification.body,
					}),
				});
			} else {
				await setDoc(databaseRef, {
					notifications: {
						title: payload.notification.title,
						body: payload.notification.body,
					},
				});
			}
			resolve(payload);
		});
	});
};
