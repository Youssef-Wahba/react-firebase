import { useEffect, useState } from 'react';
import Notification from './Notification';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
const Home = () => {
	const [notifications, setNotifications] = useState([]);
	useEffect(() => {
		const databaseRef = doc(
			collection(firestore, 'notifications'),
			'notifications'
		);
		const getNotify = async () => {
			const data = (await getDoc(databaseRef)).data();
			setNotifications(data.notifications);
		};
		getNotify();
	}, []);
	return (
		<>
			<Notification />
			<div className="w-fll md:w-2/3 m-auto pt-40">
				<div className="flex flex-col space-y-4">
					<h1 className="text-center font-bold text-3xl">Notifications</h1>
					{notifications.map((notification, i) => {
						return (
							<div key={i} className="px-3 mx-3 rounded-md bg-blue-500">
								<p className="px-3 pt-2 text-xl">{notification.title}</p>
								<p className="px-3 py-2">{notification.body}</p>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};
export default Home;
