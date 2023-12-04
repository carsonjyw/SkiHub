import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
*/

export default function Saved({ resortName }) {
    const [resort, setResort] = useState([]);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchUrl = `http://localhost:3000/resorts?Resort=${encodeURIComponent(resortName)}`;

        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data);
                if (data.length > 0) {
                    setResort(data[0]);
                } else {
                    console.log('No resort found with the name:', resortName);
                }
            })
            .catch(error => console.error('Error fetching resort:', error));

        fetch(`http://localhost:3000/saved?resortName=${encodeURIComponent(resortName)}`)
            .then(response => response.json())
            .then(data => setIsSaved(data.length > 0))
            .catch(error => console.error('Error:', error));
    }, [resortName]);

    const handleSave = () => {
        if (isSaved) {
            fetch(`http://localhost:3000/saved?resortName=${encodeURIComponent(resortName)}`)
                .then(response => response.json())
                .then(savedItems => {
                    if (savedItems.length > 0) {
                        return fetch(`http://localhost:3000/saved/${savedItems[0].id}`, { method: 'DELETE' });
                    }
                    throw new Error('Item not found for deletion.');
                })
                .then(() => setIsSaved(false))
                .catch(error => console.error('Error:', error));
            toast("You have successfully unsaved this resort!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
                type: toast.TYPE.DEFAULT
            });
        } else {
            const resortToSave = {
                ...resort,
                resortName
            };

            fetch('http://localhost:3000/saved', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resortToSave)
            })
                .then(() => setIsSaved(true))
                .catch(error => console.error('Error:', error));
            toast("You have successfully saved this resort!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
                type: toast.TYPE.DEFAULT
            });
        }
    };

    if (!resort) return <p>Loading...</p>;

    return (
        <div>
            <button type="button" className="btn btn-secondary" onClick={handleSave}>
                {isSaved ? 'Unsave Resort' : 'Save Resort'}
            </button>
        </div>
    );
}
