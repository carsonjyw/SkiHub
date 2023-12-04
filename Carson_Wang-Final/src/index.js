import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.css";
import 'react-toastify/dist/ReactToastify.css';

import Root from './routes/root';
import Index from './routes/index';
import DetailPage from './routes/details';
import UserTrips from './routes/trips';
import ResortTrips from './routes/tripByName';
import SavedResorts from './routes/saveResorts';
import Admin from './routes/admin';

import './css/index.css';

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
Create router, loader for react-router-dom
*/

// Create the router with route configurations
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Index />,
        loader() {
          return fetch("http://localhost:3000/resorts")
            .then((response) => {
              // Check if the response is successful
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((json) => {
              // Assuming the data is directly in the JSON and not in a `data` property
              return json;
            })
            .catch((error) => {
              console.error('There has been a problem with your fetch operation:', error);
              // Return null or an appropriate fallback value if there's an error
              return null;
            });
        }
      },
      {
        path: '/resort-details/:resortName',
        element: <DetailPage />,
        loader: async ({ params }) => {
          try {
            const response = await fetch('http://localhost:3000/resorts');
            if (!response.ok) {
              throw new Error(`Network error: ${response.statusText}`);
            }
            const resorts = await response.json();

            // Find the resort that matches the URL parameter
            const matchedResort = resorts.find(
              (resort) => resort.Resort === params.resortName
            );

            if (!matchedResort) {
              throw new Error(`No resort found with name: ${params.resortName}`);
            }

            return matchedResort;
          } catch (error) {
            // Handle any errors that occurred during fetch
            throw new Error('Error fetching resort details: ' + error.message);
          }
        }
      },
      {
        path: '/my-trips',
        element: <UserTrips />,
        loader() {
          return fetch("http://localhost:3000/trips")
            .then((response) => {
              // Check if the response is successful
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((json) => {
              // Assuming the data is directly in the JSON and not in a `data` property
              return json;
            })
            .catch((error) => {
              console.error('There has been a problem with your fetch operation:', error);
              // Return null or an appropriate fallback value if there's an error
              return null;
            });
        }
      },
      {
        path: '/my-trips/:resortName',
        element: <ResortTrips />,
        loader() {
          return fetch("http://localhost:3000/trips")
            .then((response) => {
              // Check if the response is successful
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((json) => {
              // Assuming the data is directly in the JSON and not in a `data` property
              return json;
            })
            .catch((error) => {
              console.error('There has been a problem with your fetch operation:', error);
              // Return null or an appropriate fallback value if there's an error
              return null;
            });
        }
      },
      {
        path: '/savedResorts',
        element: <SavedResorts />,
        loader() {
          return fetch("http://localhost:3000/saved")
            .then((response) => {
              // Check if the response is successful
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((json) => {
              // Assuming the data is directly in the JSON and not in a `data` property
              return json;
            })
            .catch((error) => {
              console.error('There has been a problem with your fetch operation:', error);
              // Return null or an appropriate fallback value if there's an error
              return null;
            });
        }
      },
      {
        path: '/admin',
        element: <Admin />,
        loader() {
          return fetch("http://localhost:3000/saved")
            .then((response) => {
              // Check if the response is successful
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((json) => {
              // Assuming the data is directly in the JSON and not in a `data` property
              return json;
            })
            .catch((error) => {
              console.error('There has been a problem with your fetch operation:', error);
              // Return null or an appropriate fallback value if there's an error
              return null;
            });
        },
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
