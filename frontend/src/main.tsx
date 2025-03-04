import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';

import Layout from './layouts/Layout';
import ProtectedRoute from './layouts/ProtectedRoute';
import NotFound from '@/components/pages/NotFound';
import Login from '@/components/pages/auth/Login';
import Register from '@/components/pages/auth/Register';
import Home from '@/components/pages/Home';

createRoot(document.getElementById('root')!).render(
	<Router>
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route path='*' element={<NotFound />}></Route>
				<Route element={<ProtectedRoute />}>
					<Route index element={<Home />}></Route>
				</Route>
				<Route path='/login' element={<Login />}></Route>
				<Route path='/register' element={<Register />}></Route>
			</Route>
		</Routes>
	</Router>
);
