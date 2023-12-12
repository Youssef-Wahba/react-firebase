import { Route, BrowserRouter, Routes } from 'react-router-dom';
import User from './components/User';
import FileUpload from './components/FileUpload';
import Home from './components/Home';
export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/user" element={<User />} />
				<Route path="/" element={<Home />} />
				<Route path="/upload/:userName" element={<FileUpload />} />
			</Routes>
		</BrowserRouter>
	);
}
