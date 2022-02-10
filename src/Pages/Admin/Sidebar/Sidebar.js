import React from 'react';
import {ListGroup} from  'react-bootstrap';
import {Link} from 'react-router-dom'

const Sidebar = () => {
    return (
        
    <ListGroup className='mt-4'>
            <ListGroup.Item as={Link} to="/"  className="fw-bold sidetxt my-2"  variant="dark">Add Food</ListGroup.Item>
            <ListGroup.Item className="fw-bold sidetxt my-2" as={Link} to="/Addstudent" variant="dark">Add Student</ListGroup.Item>
            <ListGroup.Item className="fw-bold sidetxt my-2" as={Link} to="/Distribution" variant="dark">Distribution</ListGroup.Item>
    </ListGroup>
    );
};

export default Sidebar;
