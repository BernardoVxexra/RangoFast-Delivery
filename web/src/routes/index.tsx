// Renomeado para "Switch" só para não colidir com o nosso próprio
// componente "Routes" exportado abaixo.
import { BrowserRouter, Routes as Switch, Route, Navigate } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { OrderDetailScreen } from '../screens/OrderDetailScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

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
          <Route path="/pedido/:code" element={<OrderDetailScreen />} />
          <Route path="/historico" element={<HistoryScreen />} />
          <Route path="/perfil" element={<ProfileScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Switch>
    </BrowserRouter>
  );
}
