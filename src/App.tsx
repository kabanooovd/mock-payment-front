import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PaymentPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;