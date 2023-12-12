import { useState } from 'react';
import { useParams } from 'react-router-dom';
// import { ref as fDatabaseRef, set } from 'firebase/database';
import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	setDoc,
	updateDoc,
} from 'firebase/firestore';

import {
	ref as fStorageRef,
	getDownloadURL,
	uploadBytesResumable,
} from 'firebase/storage';
import { storage, firestore } from '../config/firebase.js';

export default function FileUpload() {
	const { userName } = useParams();
	const [file, setFile] = useState(null);
	const [progress, setProgress] = useState(0);
	const [dUrl, setDUrl] = useState('');
	const [error, setError] = useState('');
	const handleFileChange = (e) => {
		if (e.target.files[0]) setFile(e.target.files[0]);
	};
	function sanitizePath(path) {
		const p = String(path);
		return p.replace(/[.#$[\]]/g, '_'); // Replace forbidden characters with underscores
	}

	const handleFileUpload = async () => {
		try {
			if (!file) {
				setError('Please select a file.');
				return;
			}
			setError('');
			setDUrl('');
			// sanitize the username and filename to be compatible with firebase restrictions
			const sanitizedUserName = sanitizePath(userName);
			const sanitizedFileName = sanitizePath(file.name);

			const storageRef = fStorageRef(
				storage,
				`${sanitizedUserName}/${sanitizedFileName}`
			);

			const databaseRef = doc(
				collection(firestore, 'userFiles'),
				sanitizedUserName
			);

			const uploadFile = uploadBytesResumable(storageRef, file);
			uploadFile.on(
				'state_changed',
				(snapshot) => {
					const uploadProgress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setProgress(uploadProgress);
				},
				(error) => {
					console.error('Error uploading file:', error);
					setError('Upload failed. Please try again.');
				},
				async () => {
					const downloadURL = await getDownloadURL(storageRef);
					if (downloadURL) {
						const docSnapshot = await getDoc(databaseRef);
						if (docSnapshot.exists()) {
							await updateDoc(databaseRef, {
								fileUrls: arrayUnion(downloadURL),
							});
						} else {
							await setDoc(databaseRef, {
								fileUrls: [downloadURL],
							});
						}
						setDUrl(downloadURL);
						setProgress(0);
					} else {
						setError('Failed to retrieve download URL.');
					}
				}
			);
		} catch (error) {
			console.error('Error uploading file:', error);
			setError('An unexpected error occurred.');
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen min-w-screen">
			<div className="bg-blue-400 flex flex-col justify-center items-center px-6 py-10 rounded-lg w-2/3 space-y-7">
				<h2 className="font-semibold text-slate-800 text-3xl">
					File upload for <span className="text-slate-100">{userName}</span>
				</h2>
				<input type="file" name="file" onChange={handleFileChange} />
				<button
					onClick={handleFileUpload}
					className="px-3 py-4 rounded-md bg-slate-800 text-slate-50 w-2/3 font-medium"
				>
					Upload
				</button>
				{progress > 0 && (
					<span className="mt-5 text-slate-100 font-semibold text-lg">
						{progress}%
					</span>
				)}
				{error.length > 0 && (
					<span className="bg-red-500 text-slate-100 px-6 py-3 rounded-md">
						{error}
					</span>
				)}
				{dUrl.length > 0 && (
					<a
						href={dUrl}
						target="_blank"
						rel="noreferrer"
						className="text-slate-100 font-semibold hover:underline"
					>
						Download Link
					</a>
				)}
			</div>
		</div>
	);
}
