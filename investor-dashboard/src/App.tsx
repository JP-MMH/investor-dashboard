import { Routes, Route, Navigate } from 'react-router-dom';
import { InvestorDashboardPage } from './InvestorDashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<InvestorDashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
