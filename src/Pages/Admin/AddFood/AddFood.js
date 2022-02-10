import React, { useState, useEffect } from 'react';
import { Button, Col, FloatingLabel, Form, Modal, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

const AddFood = () => {
    const [fooditem, setFooditem] = useState({})
    const [fooditems, setFooditems] = useState([])
    const [demo, setDemo] = useState([]);
    const size = 4;
    const [totalpage,setTotalpage] = useState(0);
    const [pageno, setPageno] = useState(0);
    const [editItem, setEditItem] = useState({})
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onBlurHandler = e => {
        const dataname = e.target.name;
        const datavalue = e.target.value;

        const newdata = {...fooditem}
        newdata[dataname] = datavalue;

        setFooditem(newdata)
    }
    const onChangeHandler = e => {
        const dataname = e.target.name;
        const datavalue = e.target.value;

        const newdata = {...editItem}
        newdata[dataname] = datavalue;

        setEditItem(newdata)
    }
    const SubmitHandler = (e) => {
        e.preventDefault();

        fetch('https://powerful-plateau-64861.herokuapp.com/foodpost',{
          method: 'POST',
          headers: {
              'content-type':'application/json'
          },
          body: JSON.stringify(fooditem)
      })
      .then(res => res.json())
      .then(data => {
        Swal.fire(
            'Food Item Aded Succesfully',
            '',
            'success'
          )
        e.target.reset()
        setDemo(fooditems)
      })
    }

    useEffect(() => {
      fetch(`https://powerful-plateau-64861.herokuapp.com/getfooditem?page=${pageno}&&size=${size}`)
      .then(res => res.json())
      .then(data =>{
          if(data)
            {
                const count = data.count;
                const pages = Math.ceil(count / size);
                setTotalpage(pages)
                setFooditems(data.result)
            }
      })
    }, [demo, pageno, size]);

    const DeleteHanlder = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://powerful-plateau-64861.herokuapp.com/deletefooditem/${id}`,{
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(data =>{
                    if(data)
                      {
                        Swal.fire(
                            'Food Item Deleted Succesfully',
                            '',
                            'success'
                          )
                          setDemo(fooditems)
                      }
                })
      
            }
          })
    
    }
    const EditHandler = (id) => {
        fetch(`https://powerful-plateau-64861.herokuapp.com/getEditItem/${id}`)
        .then(res => res.json())
        .then(data => {
            setEditItem(data);
            setShow(true);
        })
    }
    const EditsubmitHandler = (e) => {
        e.preventDefault();
        const id = editItem._id
        delete editItem['_id'];

        fetch(`https://powerful-plateau-64861.herokuapp.com/putEditItem/${id}`,{
            method: 'PUT',
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify(editItem)
        })
        .then(res => res.json())
        .then(data => {
            setDemo(fooditems);
            setShow(false);
            Swal.fire(
                'Food Item Edited Succesfully',
                '',
                'success'
              )
        })
    } 
    return (
    <Row className='container-fluid justify-content-around'>
        <Col lg={7} className="mb-4">
          <h4 className='fw-bold my-4 text-center'>All Food Manu</h4>
            <Table responsive striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Food Name</th>
                        <th>Cost Price</th>
                        <th>DELETE</th>
                        <th>EDIT</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        fooditems.map(item =>
                        <tr>
                            <td >{item.name}</td>
                            <td>{item.price}</td>
                            <td><button onClick={() => DeleteHanlder(item._id)} className='btn btn-danger text-light fw-bold'>DELETE</button></td>
                            <td><button onClick={() => EditHandler(item._id)} className='btn btn-warning text-dark fw-bold'>EDIT</button></td>
                        </tr>)
                    }
                </tbody>
            </Table>
            <div className='mt-4'>
                    {
                    
                    [...Array(totalpage).keys()].map(number => <button onClick={() => setPageno(number)} className={number === pageno  ? 'btn btn-info mx-3' : 'btn btn-dark mx-3'} >Page {number}</button>)
                    }
            </div>
        </Col>
        <Col lg={4} className="addfood_colam my-4">
        <h1 className='fw-bold text-primary my-4 ms-4'>Add Food</h1>
        <Form className='p-4' onSubmit={SubmitHandler}>
            <FloatingLabel
            controlId="floatingInput"
            label="Food Name"
            className="mb-3 fw-bold text-info fs-6"
            >
            <Form.Control name="name" onBlur={onBlurHandler}  type="text" placeholder="Food Name" />
            </FloatingLabel>
            <FloatingLabel
            controlId="floatingInput"
            label="Cost Price"
            className="mb-3 fw-bold fs-6 text-info"
            >
            <Form.Control  name="price" onBlur={onBlurHandler}  type="number" placeholder="Cost Price" />
            </FloatingLabel>
            <button type='submit' className='btn btn-dark text-warning my-4'>ADD FOOD</button>
        </Form>
        </Col>

{/* --------------------Edit Modal------------------- */}
    <Modal
      show={show} 
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Food Item
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form className='p-4' onSubmit={EditsubmitHandler}>
            <FloatingLabel
            controlId="floatingInput"
            label="Food Name"
            className="mb-3 fw-bold text-info fs-6"
            >
            <Form.Control value={editItem.name} name="name" onChange={onChangeHandler}  type="text"/>
            </FloatingLabel>
            <FloatingLabel
            controlId="floatingInput"
            label="Cost Price"
            className="mb-3 fw-bold fs-6 text-info"
            >
            <Form.Control value={editItem.price}  name="price" onChange={onChangeHandler}  type="number"/>
            </FloatingLabel>
            <button  className='btn btn-dark text-warning my-4'>EDIT FOOD</button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
    </Row>
    );
};

export default AddFood;