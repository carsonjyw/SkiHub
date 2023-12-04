import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import NavigationBar from '../navigationBar';

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
*/

export default function Root() {
  // render any nested routes
  return (
    <div className="container">
      <NavigationBar />
      <Outlet />
      <ToastContainer />
    </div>
  );
}
