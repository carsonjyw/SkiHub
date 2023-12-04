import React, { useState, useEffect } from 'react';
import { useLoaderData, useNavigate, useParams, Link } from 'react-router-dom';
import ModalDialog from './reuseable';

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
*/

export default function PlannedTrips() {
    const tripDetails = useLoaderData();
    const { resortName } = useParams();
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedResortData, setSelectedResortData] = useState(null);

    useEffect(() => {
        document.title = 'Detailed Resort Trip';
    }, []);

    const filteredTripDetails = tripDetails.map(trip => ({
        ...trip,
        details: trip.details.filter(detail =>
            detail.resortName.trim().toLowerCase() === resortName.trim().toLowerCase())
    })).filter(trip => trip.details.length > 0);

    const openDeleteModal = (tripId, tripIndex) => {
        setSelectedResortData({ tripId, tripIndex });
        setModalOpen(true);
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
                setFilteredTripDetails(prevFilteredTripDetails =>
                    prevFilteredTripDetails.map(trip =>
                        trip.id === yearId ? { ...trip, details: trip.details.filter((_, index) => index !== tripIndex) } : trip
                    )
                );
            })
            .catch(error => console.error('Error deleting trip:', error));
        setModalOpen(false);
    };

    const hasTrips = filteredTripDetails.some(trip => trip.details.length > 0);

    if (!hasTrips) {
        return (
            <div>
                <h5>You have deleted all trips to {resortName}.</h5>
                <button className="btn btn-light mb-3" onClick={() => navigate('/my-trips')}>Back to My Trips</button>
            </div>
        );
    }

    return (
        <div className='page'>
            <h4>All trips you planned for {resortName}</h4>
            {filteredTripDetails.map((trip, index) => (
                <div key={index}>
                    <h5>Snow Season: {trip.id_year}</h5>
                    {trip.details.sort((a, b) => new Date(a["date-start"]) - new Date(b["date-start"])).map((detail, detailIndex) => (
                        <div key={detailIndex} className='trip'>
                            <div className="card" style={{ width: '100%' }}>
                                <div className="card-body">
                                    <h5 className="card-title">Trip to {detail.resortName}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Date Start: {detail["date-start"]}</h6>
                                    <h6 className="card-subtitle mb-2 text-muted">End Start: {detail["date-end"]}</h6>
                                    <h6 className="card-subtitle mb-2 text-muted">Pass: {detail.pass}</h6>
                                    <p className="card-text">Notes: {detail.note}</p>
                                    <a className="card-link"><button className="btn btn-light mb-3"><Link to={`/resort-details/${detail.resortName}`}>Resort Details</Link></button></a>
                                    <a className="card-link"><button className="btn btn-light mb-3" onClick={() => openDeleteModal(trip.id, detailIndex)}>Delete This Trip</button></a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <ModalDialog
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Confirm Delete"
                onAction={() => handleDeleteTrip(selectedResortData.tripId, selectedResortData.tripIndex)}
            >
                <p>Are you sure you want to delete this trip?</p>
            </ModalDialog>
        </div>
    );
}
