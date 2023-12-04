import React, { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import Comments from "./comment";
import Save from "./save";

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
*/

export default function Details() {
  const resortDetails = useLoaderData();
  const dynamicWidth = '20%';
  const allWidth = '600px';

  useEffect(() => {
    document.title = 'Details | ' + resortDetails.Resort;
  }, [resortDetails.Resort]);

  return (
    <div className="page">
      <h4>{resortDetails.Resort}, a member of
        {resortDetails["Ski Pass"].toLowerCase() === "ikon" ? (
          <a><img className="passimg" src="/assets/ikon.png" alt="Ikon Pass" /> Pass</a>
        ) : (
          <a><img className="passimg" src="/assets/epic.png" alt="Ikon Pass" /> Pass</a>
        )} <Save resortName={resortDetails.Resort} /></h4>

      <hr />
      <table className="table table-striped" style={{ width: allWidth }}>
        <tbody>
          <tr>
            <th scope="row" style={{ width: dynamicWidth }}>Location (State)</th>
            <td style={{ width: dynamicWidth }}>{resortDetails["Location (State)"]}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: dynamicWidth }}>Days Open This Season</th>
            <td style={{ width: dynamicWidth }}>{resortDetails["Days Open This Season"]}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: dynamicWidth }}>Avg Total Snowfall (inches)</th>
            <td style={{ width: dynamicWidth }}>{resortDetails["Avg Total Snowfall (inches)"]}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: dynamicWidth }}>Beginner Runs</th>
            <td style={{ width: dynamicWidth }}>{resortDetails["Beginner Runs"]}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: dynamicWidth }}>Intermediate Runs</th>
            <td style={{ width: dynamicWidth }}>{resortDetails["Intermediate Runs"]}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: dynamicWidth }}>Advanced Runs</th>
            <td style={{ width: dynamicWidth }}>{resortDetails["Advanced Runs"]}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: dynamicWidth }}>Expert Runs</th>
            <td style={{ width: dynamicWidth }}>{resortDetails["Expert Runs"]}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: dynamicWidth }}>Lift Amount</th>
            <td style={{ width: dynamicWidth }}>{resortDetails["Lift Amount"]}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: dynamicWidth }}>Skiable Terrain (Acres)</th>
            <td style={{ width: dynamicWidth }}>{resortDetails["Skiable Terrain (Acres)"]}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: dynamicWidth }}>Top Elevation (ft)</th>
            <td style={{ width: dynamicWidth }}>{resortDetails["Top Elevation (ft)"]}</td>
          </tr>
          <tr>
            <th scope="row" style={{ width: dynamicWidth }}>Total Runs</th>
            <td style={{ width: dynamicWidth }}>{resortDetails["Total Runs"]}</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <div>
        <Comments resortName={resortDetails.Resort} />
      </div>
    </div>
  );
}
