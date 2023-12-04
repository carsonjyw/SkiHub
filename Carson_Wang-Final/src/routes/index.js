import React from 'react';
import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import TripForm from './planning';

/*
ITP 404, Final Project
Author: Carson Wang
Email: carsonw@usc.edu
*/

export default function mainPage() {
  const resortList = useLoaderData();
  const [searchResort, setSearchResort] = useState(resortList);
  const [searchTerm, setSearchTerm] = useState('');
  const dynamicWidth = '25%';

  useEffect(() => {
    document.title = 'SkiHub | Homepage';
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filteredResorts = resortList.filter((resort) =>
      resort.Resort.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResort(filteredResorts);
  };

  return (
    <div className="page">
      <h4>Welcome!</h4>
      <p>Here, you can plan your winter trips and find your resorts!</p>
      <hr />
      <h6>Plan your trip now.</h6>
      <TripForm />
      <hr />
      <h6>Need to find a resort before making a plan?</h6>
      <div className="form-row">
        <div className="form-group col-md-4">
          <input
            className="form-control"
            type="search"
            placeholder="Search for a resort..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="resort-list">
        {searchTerm ? (
          searchResort.map((resort, index) => (
            <ul key={index} className="list-group list-group-flush">
              <li className="list-group-item">
                <table className="table">
                  <tr>
                    <th style={{ width: dynamicWidth }}>{resort.Resort}</th>
                    <td style={{ width: dynamicWidth }} >{resort["Ski Pass"]} Pass Holder</td>
                    <td style={{ width: dynamicWidth }} >Location: {resort["Location (State)"]}</td>
                    <td style={{ width: dynamicWidth }} ><Link to={`/resort-details/${resort.Resort}`}>Details</Link></td>
                  </tr>
                </table>
                <hr />
              </li>
            </ul>
          ))
        ) : (
          <p className='null-info'>Search to find your ideal resort...</p>
        )}
      </div>
    </div>
  );
}
