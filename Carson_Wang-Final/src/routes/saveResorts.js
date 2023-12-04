import React, { useState, useEffect } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import ModalDialog from './reuseable';

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
*/

export default function SavedResorts() {
    const resortList = useLoaderData();
    const [savedResorts, setSavedResorts] = useState([]);

    useEffect(() => {
        document.title = 'Saved Resorts';
        const sortedResorts = resortList.sort((a, b) => a.Resort.localeCompare(b.Resort));
        setSavedResorts(sortedResorts);
    }, [resortList]);

    const handleDelete = (resortId) => {
        fetch(`http://localhost:3000/saved/${resortId}`, { method: 'DELETE' })
            .then(() => {
                setSavedResorts(savedResorts.filter(resort => resort.id !== resortId));
                setModalOpen(false);
            })
            .catch(error => {
                console.error('Error deleting resort:', error);
                setModalOpen(false);
            });
    };

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedResortId, setSelectedResortId] = useState();

    const openDeleteModal = (resortId) => {
        setSelectedResortId(resortId);
        setModalOpen(true);
    };

    const width = "18rem";

    return (
        <div className='page'>
            <h4>Saved Resorts</h4>
            <hr />
            {savedResorts.length > 0 ? (
                <div className="card" style={{ width: width }}>
                    {savedResorts.map((resort, index) => (
                        <ul key={index} className="list-group list-group-flush">
                            <li className="list-group-item">
                                <h6>{resort.Resort} in {resort['Location (State)']}</h6>
                                <a className="card-link"><button className="btn btn-light mb-3"><Link to={`/resort-details/${resort.Resort}`}>Detail</Link></button></a>
                                <a className="card-link"><button className="btn btn-light mb-3" onClick={() => openDeleteModal(resort.id)}>Delete</button></a>
                            </li>
                        </ul>
                    ))}
                </div>
            ) : (
                <p>You have not saved any resorts yet.</p>
            )}

            <ModalDialog
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Confirm Delete"
                onAction={() => handleDelete(selectedResortId)}
            >
                <p>Are you sure you want to delete this resort?</p>
            </ModalDialog>
        </div>
    );
}
