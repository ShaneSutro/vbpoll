import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app';
// eslint-disable-next-line no-unused-vars
import css from '../public/style.css';

// eslint-disable-next-line no-undef
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app'));
