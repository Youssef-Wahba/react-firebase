/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
	apiKey: 'AIzaSyCCuKaiEcm2WmzrDBr69O6EevfnPw7WTOY',
	authDomain: 'cloud-computing-react-app.firebaseapp.com',
	databaseURL:
		'https://cloud-computing-react-app-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'cloud-computing-react-app',
	storageBucket: 'cloud-computing-react-app.appspot.com',
	messagingSenderId: '283703091883',
	appId: '1:283703091883:web:777bf3178c5f621acd0dee',
	measurementId: 'G-SJ750BFRFX',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage(async (payload) => {
	console.log('Received background message : ', payload);
	// Customize notification here
	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: '../src/assets/firebase.png',
	};
	self.registration.showNotification(notificationTitle, notificationOptions);
});
