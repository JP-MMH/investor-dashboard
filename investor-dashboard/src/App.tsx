import { Routes, Route } from 'react-router-dom';
import { InvestorDashboardPage } from './InvestorDashboardPage';
import { ResidentPage } from './pages/ResidentPage';
import { NavigationBubble } from './components/navigation/NavigationBubble';

function App() {
  return (
    <>
      <NavigationBubble />
      <Routes>
        <Route path="/" element={<InvestorDashboardPage />} />
        <Route path="/residents" element={<ResidentPage />} />
      </Routes>
    </>
  );
}

export default App;
