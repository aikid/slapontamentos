import React from 'react';
import { useDispatch,useSelector } from 'react-redux';
import moment from "moment";
import createRouter from './routes';

export default function App() {
  const signed = useSelector(state => state.auth.signed);
  const Routes = createRouter(signed);
  return <Routes />
}
