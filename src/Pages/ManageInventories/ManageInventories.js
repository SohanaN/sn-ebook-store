import React from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import auth from '../../firebase.init';
import useInventory from '../../hooks/useInventory';
import Inventory from '../Home/Inventory/Inventory';
import "./ManageInventories.css";

const ManageInventories = () => {

    const [inventory, setInventory] = useInventory();
    const navigate = useNavigate();
    const navigateToAdd = () => {
        navigate(`/addItem`);
    }
    const [user] = useAuthState(auth);

    const handleDelete = id => {
        const proceed = window.confirm('Are you sure?');
        if (proceed) {
            const url = `http://localhost:5000/inventory/${id}`;
            fetch(url, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    const remaining = inventory.filter(inventory => inventory._id !== id);
                    setInventory(remaining);
                })
            toast('Item Deleted');
        }
    }

    return (
        <Container>
            <div className='text-center get-in-touch'>
                <h2 className='title'>Manage Inventory Items</h2>
            </div>
            <div className=' d-flex justify-content-end'>
                <Button onClick={() => navigateToAdd()} className="btn-light fw-bold text-primary" type="submit">
                    Add New Item
                </Button>
            </div>

            <Row className="d-flex justify-content-center mt-4">
                {
                    inventory.map(inventory => <div
                        key={inventory._id}>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Price</th>
                                    {
                                        user && <>
                                            <th scope="col">Delete</th>
                                        </>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{inventory.name}</td>
                                    <td><img src={inventory.img} alt="" className="img-fluid img-size2" /></td>
                                    <td>{inventory.quantity}</td>
                                    <td>{inventory.price}</td>
                                    {
                                        user && <>
                                            <td><Button className='btn-danger' onClick={() => handleDelete(inventory._id)}>X</Button></td>
                                        </>
                                    }

                                </tr>
                            </tbody>
                        </table>
                    </div>)
                }
            </Row>
            <ToastContainer />
        </Container>
    );
};

export default ManageInventories;