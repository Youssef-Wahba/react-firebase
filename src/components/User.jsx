import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function User() {
	const [userName, setUserName] = useState('');
	const navigat = useNavigate();
	const handleNameSubmit = () => {
		if (userName === '') return;
		navigat(`/upload/${userName}`);
	};
	return (
		<div className="flex justify-center items-center min-h-screen min-w-screen">
			<div className="bg-yellow-400 flex flex-col justify-center items-center px-6 py-10 rounded-lg w-2/3 space-y-7">
				<h2 className="font-semibold text-slate-800 text-3xl">
					Enter Your Name
				</h2>
				<input
					type="text"
					placeholder="username"
					value={userName}
					id="username"
					name="username"
					className="px-3 py-4 rounded-md outline-none focus:outline-slate-800 focus:outline-offset-0 w-2/3"
					autoComplete="off"
					onChange={(e) => setUserName(e.target.value)}
				/>
				<button
					className="px-3 py-4 rounded-md bg-slate-800 text-slate-50 w-2/3 font-medium"
					onClick={handleNameSubmit}
				>
					Continue
				</button>
			</div>
		</div>
	);
}
