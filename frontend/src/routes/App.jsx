import Dashboard from '../components/Estadistica/EstadisticasDashboard';
import NotificationsPanel from '../components/Notificaction/NotificationsPanel';
import '../css/Dashboard.css';

function App() {
  return (
    <div className="dashboard-container">
      {/* Panel de notificaciones al lado izquierdo */}
      <div className="notifications-panel">
        <NotificationsPanel />
      </div>

      {/* Contenido del Dashboard al lado derecho */}
      <div className="dashboard-content">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
