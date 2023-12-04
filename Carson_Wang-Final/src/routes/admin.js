import React, { useState, useEffect, useRef } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
*/

export default function AdminPage() {
    const tripDetails = useLoaderData();
    const [savedResorts, setSavedResorts] = useState(tripDetails);
    const [selectedResorts, setSelectedResorts] = useState(new Set());
    const selectAllRef = useRef();

    useEffect(() => {
        document.title = 'Administration';
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate =
                selectedResorts.size > 0 && selectedResorts.size < savedResorts.length;
        }
    }, [selectedResorts, savedResorts]);

    const handleSelectAll = (e) => {
        setSelectedResorts(
            e.target.checked ? new Set(savedResorts.map(resort => resort.id)) : new Set()
        );
    };

    const handleSelectResort = (id) => {
        const newSelectedResorts = new Set(selectedResorts);
        if (newSelectedResorts.has(id)) {
            newSelectedResorts.delete(id);
        } else {
            newSelectedResorts.add(id);
        }
        setSelectedResorts(newSelectedResorts);
    };

    const handleBulkDelete = () => {
        Promise.all(Array.from(selectedResorts).map(id =>
            fetch(`http://localhost:3000/saved/${id}`, { method: 'DELETE' })
        ))
            .then(() => {
                setSavedResorts(savedResorts.filter(resort => !selectedResorts.has(resort.id)));
                setSelectedResorts(new Set());
                toast("Successfully deleted!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                    type: toast.TYPE.DEFAULT
                });
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div className='page'>
            <h4>Saved Resorts</h4>
            <hr />
            <input
                type="checkbox"
                ref={selectAllRef}
                onChange={handleSelectAll}
                checked={selectedResorts.size === savedResorts.length && savedResorts.length > 0}
            />
            <label>Select All</label>
            {savedResorts.map(resort => (
                <div key={resort.id}>
                    <input
                        type="checkbox"
                        checked={selectedResorts.has(resort.id)}
                        onChange={() => handleSelectResort(resort.id)}
                    />
                    {resort.Resort} - <Link to={`/resort-details/${resort.Resort}`}>Detail</Link>
                </div>
            ))}
            {selectedResorts.size > 0 && (
                <button onClick={handleBulkDelete}>Delete Selected</button>
            )}
        </div>
    );
};
