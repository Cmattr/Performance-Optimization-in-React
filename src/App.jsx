import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Display from "./components/Homepage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import CrudAdd from './components/Add';
import CrudDelete from './components/Delete';
import CrudPut from './components/Put';
import DisplayFilter from './components/Homepage';
import UserSelector from './components/UserSelector';

// Initialize the QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Display />} />
          <Route path="/posts/:userId" element={<DisplayFilter />} />
          <Route path="/Add" element={<CrudAdd />} />
          <Route path="/Delete" element={<CrudDelete />} />
          <Route path="/Put" element={<CrudPut />} />
          <Route path="/UserSelector" element={<UserSelector />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;