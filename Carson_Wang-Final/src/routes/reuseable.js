import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/*
ITP 404, Final
Author: Carson Wang
Email: carsonw@usc.edu
*/

export default function ModalDialog(props) {
    if (!props.isOpen) return null;

    const handleAction = async () => {
        try {
            await props.onAction();
            toast("Successfully deleted!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
                type: toast.TYPE.DEFAULT
            });
        } catch (error) {
            toast.error('An error occurred.');
        }
    };

    return (
        <div className="backdrop">
            <div className="content">
                <div className="header">
                    <h5 className="title">{props.title}</h5>
                    <button type="button" className="close" onClick={props.onClose}>
                        <span>&times;</span>
                    </button>
                </div>
                <div className="body">
                    {props.children}
                    <div className="footer">
                        <button onClick={handleAction} className="btn btn-primary">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

