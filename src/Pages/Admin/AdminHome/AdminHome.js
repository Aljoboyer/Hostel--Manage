import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar';
import {
    Outlet
  } from "react-router-dom";

const AdminHome = () => {
    return (
        <Row className='container-fluid'>
            <Col lg={2} md={3} sm={12}>
                <Sidebar/>
            </Col>
            <Col lg={9} md={9} sm={12}>
                <Outlet/>
            </Col>
        </Row>
    );
};

export default AdminHome;