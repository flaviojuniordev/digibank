import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Transferencia from '../pages/TransferenciaNew';
import Historico from '../pages/HistoricoNew';
import PainelClientes from '../pages/PainelClientes';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transferencia" element={<Transferencia />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="/clientes" element={<PainelClientes />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
