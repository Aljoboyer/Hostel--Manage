import React, { useState , useEffect} from 'react';
import {FloatingLabel, Row, Form, Col, Table, Modal, Button} from 'react-bootstrap'
import Swal from 'sweetalert2';
const Addstudent = () => {
    const [student, setStudent] = useState({});
    const [demo, setDemo] = useState([]);
    const [students, setStudents] = useState([])
    const size = 4;
    const [totalpage,setTotalpage] = useState(0);
    const [pageno, setPageno] = useState(0);
    const [editItem, setEditItem] = useState({})
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [studentarray, setStudentarray] = useState([]);
    const [check, setCheck] = useState(false)
    const onBlurHandler = e => {
        const dataname = e.target.name;
        const datavalue = e.target.value;

        const newdata = {...student}
        newdata[dataname] = datavalue;

        setStudent(newdata)
    }
    const onChangeHandler = e => {
        const dataname = e.target.name;
        const datavalue = e.target.value;

        const newdata = {...editItem}
        newdata[dataname] = datavalue;

        setEditItem(newdata)
    }

     useEffect(() => {
      fetch(`http://localhost:5000/getStudents?page=${pageno}&&size=${size}`)
      .then(res => res.json())
      .then(data =>{
          if(data)
            {
                const count = data.count;
                const pages = Math.ceil(count / size);
                setTotalpage(pages)
                setStudents(data.result)
            }
      })
    }, [demo, pageno, size]);
    const SubmitHandler = (e) => {
        e.preventDefault();

        fetch('http://localhost:5000/studentpost',{
          method: 'POST',
          headers: {
              'content-type':'application/json'
          },
          body: JSON.stringify(student)
      })
      .then(res => res.json())
      .then(data => {
        Swal.fire(
            'Student Added Succesfully',
            '',
            'success'
          )
        e.target.reset()
        setDemo(students)
      })
    }
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
                fetch(`http://localhost:5000/deleteStudent/${id}`,{
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(data =>{
                    if(data)
                      {
                        Swal.fire(
                            'Student Deleted Succesfully',
                            '',
                            'success'
                          )
                          setDemo(students)
                      }
                })
      
            }
          })
    
    }
    const EditHandler = (id) => {
        fetch(`http://localhost:5000/getEditStudent/${id}`)
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

        fetch(`http://localhost:5000/putEditStudent/${id}`,{
            method: 'PUT',
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify(editItem)
        })
        .then(res => res.json())
        .then(data => {
            setDemo(students);
            setShow(false);
            Swal.fire(
                'Student Edited Succesfully',
                '',
                'success'
              )
        })
    }

    const CheckHandler = (item) => {
        if(studentarray.includes(item))
        {
            return
        }
        
        else{
            setStudentarray([...studentarray, item])
        }
    
        
    }
    const StatusChangeHandler = () => {
        
        fetch('http://localhost:5000/changeStatus',{
          method: 'PUT',
          headers: {
              'content-type':'application/json'
          },
          body: JSON.stringify(studentarray)
      })
      .then(res => res.json())
      .then(data =>  {
          setDemo(students)
        Swal.fire(
            'Statuse Changed Succesfully',
            '',
            'success'
          )
          setStudentarray([])
      })
    }
    return (
    <Row className='container-fluid'>
           <Col lg={8} className="my-4">
           <Table responsive striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Roll</th>
                        <th>Age</th>
                        <th>class</th>
                        <th>Hall</th>
                        <th>Status</th>
                        <th>DELETE</th>
                        <th>EDIT</th>
                        <th>Change Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        students?.map(item =>
                        <tr>
                            <td >{item.fullName}</td>
                            <td>{item.roll}</td>
                            <td>{item.age}</td>
                            <td>{item.class}</td>
                            <td>{item.hall}</td>
                            <td>{item.status}</td>
                            <td><button onClick={() => DeleteHanlder(item._id)} className='btn btn-danger text-light fw-bold'>DELETE</button></td>
                            <td><button onClick={() => EditHandler(item._id)} className='btn btn-warning text-dark fw-bold'>EDIT</button></td>
                            <td className='text-center'>
                                <input onClick={() => CheckHandler(item)} type="checkbox" id="checkbox" value={item} />
                            </td>
                            
                        </tr>)
                    }
                </tbody>
            </Table>
            <div className='my-4'>
                    {
                    
                    [...Array(totalpage).keys()].map(number => <button onClick={() => setPageno(number)} className={number === pageno  ? 'btn btn-info mx-3' : 'btn btn-dark mx-3'} >Page {number}</button>)
                    }
            </div>
            <Row className='d-flex justify-content-center mt-4'>
               {
                   studentarray.length > 0 ?  <Col className='mt-4 pt-4' lg={8}>
                   <button onClick={StatusChangeHandler} style={{width: '100%'}} className='btn btn-success text-light fw-bold'>CHANGE STATUS</button>
                    </Col>  : ''
               }
            </Row>
           </Col>
           <Col lg={4} className="addfood_colam my-4">
           <h4 className='fw-bold text-primary my-4 ms-4'>Add Students</h4>
            <Form className='p-4' onSubmit={SubmitHandler} >
                <FloatingLabel
                    controlId="floatingInput"
                    label="Full Name"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control name="fullName" type="text" onBlur={onBlurHandler} placeholder="Full Name" />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Roll"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control name="roll" type="number" onBlur={onBlurHandler} placeholder="Roll" />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Age"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control name="age" type="text" onBlur={onBlurHandler} placeholder="Age" />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Class"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control name="class" type="text" onBlur={onBlurHandler} placeholder="Class" />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Hall Name"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control name="hall" type="text" onBlur={onBlurHandler} placeholder="Hall Name" />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Status"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control name="status" type="text" onBlur={onBlurHandler} placeholder="Status" />
                </FloatingLabel>
                <button type='submit' className='btn btn-dark text-warning my-4'>ADD STUDENT</button>
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
          Edit Student
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
            <Form className='p-4' onSubmit={EditsubmitHandler} >
                <FloatingLabel
                    controlId="floatingInput"
                    label="Full Name"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control value={editItem.fullName} name="fullName" type="text" onChange={onChangeHandler}  />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Roll"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control value={editItem.roll} name="roll" type="number" onChange={onChangeHandler}  />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Age"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control value={editItem.age} name="age" type="text" onChange={onChangeHandler}  />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Class"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control value={editItem.class} name="class" type="text" onChange={onChangeHandler} />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Hall Name"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control value={editItem.hall} name="hall" type="text" onChange={onChangeHandler}  />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Status"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control value={editItem.status} name="status" type="text" onChange={onChangeHandler}  />
                </FloatingLabel>
                <button type='submit' className='btn btn-dark text-warning my-4'>EDIT STUDENT</button>
            </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
    </Row>
    );
};

export default Addstudent;