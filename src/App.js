import React from 'react';
import './App.css';
import UserTable from './components/UserTable';
import $ from 'jquery';
window.$ = window.jQuery = $;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React con jQuery DataTables</h1>
      </header>
      <main style={{ padding: '20px' }}>
        <UserTable />
      </main>
    </div>
  );
}

export default App;