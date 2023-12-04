import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
*/

export default function TripForm() {
    const [resortList, setResortList] = useState([]);
    const [year, setYear] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [resortName, setResortName] = useState('');
    const [note, setNote] = useState('');

    const [yearError, setYearError] = useState('');
    const [startDateError, setStartDateError] = useState('');
    const [endDateError, setEndDateError] = useState('');
    const [resortNameError, setResortNameError] = useState('');

    const validate = () => {
        let isValid = true;
        const currentYear = new Date().getFullYear();

        if (!year.trim()) {
            setYearError('Snow Season is required.');
            isValid = false;
        } else if (parseInt(year) < currentYear) {
            setYearError(`Year must not be earlier than ${currentYear}.`);
            isValid = false;
        } else {
            setYearError('');
        }

        if (!startDate.trim()) {
            setStartDateError('Start Date is required.');
            isValid = false;
        } else if (new Date(startDate).getFullYear() < parseInt(year)) {
            setStartDateError('Start Date cannot be earlier than the Snow Season year.');
            isValid = false;
        } else {
            setStartDateError('');
        }

        if (!endDate.trim()) {
            setEndDateError('End Date is required.');
            isValid = false;
        } else if (new Date(endDate) < new Date(startDate)) {
            setEndDateError('End Date cannot be before Start Date.');
            isValid = false;
        } else {
            setEndDateError('');
        }

        if (!resortName.trim()) {
            setResortNameError('Selecting a resort is required.');
            isValid = false;
        } else {
            setResortNameError('');
        }

        return isValid;
    };

    useEffect(() => {
        fetch('http://localhost:3000/resorts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setResortList(data);
            })
            .catch(error => {
                console.error('Error fetching resorts:', error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTripDetail = {
            "date-start": startDate,
            "date-end": endDate,
            resortName,
            pass: resortList.find(resort => resort.Resort === resortName)?.['Ski Pass'] || 'Unknown',
            note
        };

        const isValidForm = validate();

        if (isValidForm) {
            try {
                const response = await fetch(`http://localhost:3000/trips?id_year=${year}`);
                const data = await response.json();

                if (data.length > 0) {
                    const existingEntry = data[0];
                    existingEntry.details.push(newTripDetail);

                    await fetch(`http://localhost:3000/trips/${existingEntry.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(existingEntry)
                    });
                } else {
                    const newEntry = {
                        id_year: year,
                        details: [newTripDetail]
                    };

                    await fetch('http://localhost:3000/trips', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newEntry)
                    });
                }

                setYear('');
                setStartDate('');
                setEndDate('');
                setResortName('');
                setNote('');

                toast("You have successfully planned your trip!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                    type: toast.TYPE.DEFAULT
                });

            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group col-md-2">
                    Snow Season:
                    <input type="number" className="form-control" value={year} onChange={(e) => setYear(e.target.value)} data-testid="snow-season-input" />
                    {yearError && <div className="error">{yearError}</div>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group col-md-2">
                    <label>Start Date:</label>
                    <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} data-testid="start-date-input" />
                    {startDateError && <div className="error">{startDateError}</div>}
                </div>
                <div className="form-group col-md-2">
                    <label>End Date:</label>
                    <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} data-testid="end-date-input" />
                    {endDateError && <div className="error">{endDateError}</div>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group col-md-4">
                    Select Resort Name:
                    <select className="form-select" aria-label="Default select example" value={resortName} onChange={(e) => setResortName(e.target.value)}>
                        <option value="" data-testid="resort-select">Select a resort</option>
                        {resortList.map((resort, index) => (
                            <option key={index} value={resort.Resort}>{resort.Resort}</option>
                        ))}
                    </select>
                    {resortNameError && <div className="error">{resortNameError}</div>}
                </div>
            </div>

            <div className="form-row">
                <label className="form-label">Trip Notes:</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="3" data-testid="trip-notes-textarea"></textarea>
            </div>

            <div className="form-row">
                <button type="submit" className="btn btn-primary mb-3" data-testid="submit-button">Add Trip</button>
            </div>
        </form>
    );
};
