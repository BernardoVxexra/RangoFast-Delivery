import { BrowserRouter, Routes as Switch, Route, Navigate } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CameraScreen } from '../screens/CameraScreen';

export function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/camera" element={<CameraScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Switch>
    </BrowserRouter>
  );
}
