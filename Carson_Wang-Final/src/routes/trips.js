import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import TripForm from './planning';
import Collapsible from './collapsible.js';
import ModalDialog from './reuseable';

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
*/

export default function Planning() {
    const tripDetails = useLoaderData();
    const [trips, setTrips] = useState(tripDetails);
    const [selectedYear, setSelectedYear] = useState('');
    const [years, setYears] = useState([...new Set(tripDetails.map(trip => trip.id_year))]);
    const [selectedResort, setSelectedResort] = useState('');

    useEffect(() => {
        document.title = 'Planned Trips';
    }, []);

    const filteredTrips = trips.filter(trip => selectedYear === '' || trip.id_year === selectedYear);

    const handleDeleteYear = (yearId) => {
        fetch(`http://localhost:3000/trips/${yearId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setTrips(trips.filter(trip => trip.id !== yearId));
            })
            .catch(error => console.error('Error deleting year:', error));
    };

    const handleDeleteTrip = (yearId, tripIndex) => {
        fetch(`http://localhost:3000/trips/${yearId}`)
            .then(response => response.json())
            .then(data => {
                const updatedDetails = data.details.filter((_, index) => index !== tripIndex);
                return fetch(`http://localhost:3000/trips/${yearId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...data, details: updatedDetails }),
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setTrips(trips.map(trip =>
                    trip.id === yearId ? { ...trip, details: trip.details.filter((_, index) => index !== tripIndex) } : trip
                ));
            })
            .catch(error => console.error('Error deleting trip:', error));
    };

    const resortNames = Array.from(new Set(trips.flatMap(trip => trip.details.map(detail => detail.resortName))));

    const navigate = useNavigate();
    const handleResortChange = (event) => {
        setSelectedResort(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedResort) {
            navigate(`/my-trips/${selectedResort}`);
        }
    };

    const width = "30rem";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState();
    const [selectedData, setSelectedData] = useState();

    const handleDeleteYearModal = (tripId) => {
        setIsModalOpen(true);
        setModalAction('deleteYear');
        setSelectedData(tripId);
    };

    const handleDeleteTripModal = (tripId, tripIndex) => {
        setIsModalOpen(true);
        setModalAction('deleteTrip');
        setSelectedData({ tripId, tripIndex });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalAction(null);
        setSelectedData(null);
    };

    const handleConfirmDelete = async () => {
        try {
            if (modalAction === 'deleteYear') {
                await handleDeleteYear(selectedData);
            } else if (modalAction === 'deleteTrip') {
                await handleDeleteTrip(selectedData.tripId, selectedData.tripIndex);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred.');
        }
    };

    return (
        <div className='page'>
            <h4>My Trips</h4>
            <Collapsible
                header="Need to add another trip? (click + button)"
                renderTriggerIcon={(isOpen) => isOpen ? <span className='icon'>-</span> : <span className='icon'>+</span>}
            >
                <TripForm />
            </Collapsible>

            <hr />
            <div className="form-row">
                <form onSubmit={handleSubmit}>
                    <div className="form-group col-md-4">
                        <h6>Need to find a trip by resort name?</h6>
                        <select className="form-select" aria-label="Default select example" value={selectedResort} onChange={handleResortChange}>
                            <option value="">Select a Resort</option>
                            {resortNames.map(resort => (
                                <option key={resort} value={resort}>{resort}</option>
                            ))}
                        </select>
                        <br />
                        <button className="btn btn-light mb-3" type="submit">Go to Trips</button>
                    </div>
                </form>
            </div>

            <hr />

            <div className="form-row">
                <div className="form-group col-md-4">
                    <h6>Or Select Year:</h6>
                    <select className="form-select" aria-label="Default select example" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="">All Years</option>
                        {years.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className='tripDetail'>
                {
                    filteredTrips.length > 0 ? (
                        filteredTrips.map((trip, index) => (
                            <div key={index}>
                                <h5>Snow Season: {trip.id_year}</h5>
                                <button className="btn btn-light mb-3" onClick={() => handleDeleteYearModal(trip.id)}>Delete This Year</button>
                                {trip.details.sort((a, b) => new Date(a["date-start"]) - new Date(b["date-start"])).map((detail, detailIndex) => (
                                    <div key={detailIndex} className='trip'>
                                        <div className="card" style={{ width: width }}>
                                            <div className="card-body">
                                                <h5 className="card-title" >Trip to {detail.resortName}</h5>
                                                <h6 className="card-subtitle mb-2 text-muted" >Date Start: {detail["date-start"]}</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" >End Start: {detail["date-end"]}</h6>
                                                <h6 className="card-subtitle mb-2 text-muted">Pass: {detail.pass}</h6>
                                                <p className="card-text" >Notes: {detail.note}</p>
                                                <a className="card-link"><button className="btn btn-light mb-3"><Link to={`/resort-details/${detail.resortName}`}>Resort Details</Link></button></a>
                                                <a className="card-link"><button className="btn btn-light mb-3" onClick={() => handleDeleteTripModal(trip.id, detailIndex)}>Delete This Trip</button></a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>No trips available for the selected year.</p>
                    )
                }
                <ModalDialog
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onAction={handleConfirmDelete}
                    title={modalAction === 'deleteYear' ? "Confirm Delete Year" : "Confirm Delete Trip"}
                >
                    <p>Are you sure you want to {modalAction === 'deleteYear' ? "delete this year?" : "delete this trip?"}</p>
                </ModalDialog>
            </div>
        </div >
    );
}
