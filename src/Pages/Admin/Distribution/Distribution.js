import React, { useState, useEffect } from 'react';
import { Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Distribution = () => {
    const [data, setData] = useState({});
    const [roll, setRoll] = useState('');
    const [student, setStudent] = useState({});
    const [allstudent, setAllstudent] = useState([]);
    const [findstudent, setFindstudent] = useState({});
    const [foodlist, setFoodlist] = useState([])
    const RollHandler = (e) => {
        setRoll(e.target.value)
    }
    const onBlurHandler = e => {
        const dataname = e.target.name;
        const datavalue = e.target.value;

        const newdata = {...data}
        newdata[dataname] = datavalue;

        setData(newdata)
    }
    const SubmitHandler  = (e) => {
        e.preventDefault();
        const newdata = {...data, studentId: student.roll, status: 'served'}
        fetch('https://powerful-plateau-64861.herokuapp.com/foodlistpost',{
            method: 'POST',
            headers: {
                'content-type':'application/json'
            },
            body: JSON.stringify(newdata)
        })
        .then(res => res.json())
        .then(data => {
            Swal.fire(
                'Food Distribution Succesfully',
                '',
                'success'
              )
              setAllstudent([])
              setStudent({})
              setFindstudent({})
              e.target.reset()
        })
    }
    useEffect(() => {
        fetch('https://powerful-plateau-64861.herokuapp.com/getAllstudent')
        .then(res => res.json())
        .then(data => setAllstudent(data))
    }, [student]);
    useEffect(() => {
        fetch('https://powerful-plateau-64861.herokuapp.com/getfoodList')
        .then(res => res.json())
        .then(data => setFoodlist(data))
    },[])
    const SerchHandler = (e) => {
        e.preventDefault();
        fetch(`https://powerful-plateau-64861.herokuapp.com/getSearchStudent/${roll}`)
        .then(res => res.json())
        .then(data => {
            const sts = allstudent.find(st => st.studentId === data?.roll);
            if(sts?.studentId){
                setFindstudent(sts)
            }
            else{
                setFindstudent({})
            }
            setStudent(data)
            e.target.reset()
        })      
    }
    console.log(findstudent)
    return (
        <Row className='container-fluid'>
            <h3 className='text-success fw-bold text-center mt-3'>Distribution Centre</h3>
            <Col lg={6} className="my-4">
                <h4 className='text-center fw-bold my-4 '>Search Student For Distribution Food</h4>
            <Form className='p-4' onSubmit={SerchHandler} >
                <FloatingLabel
                    controlId="floatingInput"
                    label="Entar Student Roll"
                    className="mb-3  fw-bold text-info fs-6"
                    >
                    <Form.Control className='inputs' name="roll" type="text" onBlur={RollHandler} placeholder="Entar Student Roll" />
                </FloatingLabel>
                <button type='submit' className='btn btn-dark text-warning my-4'>Search</button>
            </Form>
            {
                student?.roll ? <div className='mt-4'>
                <h3 className='fw-bold my-2'>Name: {student?.fullName}</h3>
                <h3 className='fw-bold my-2'>Roll: {student?.roll}</h3>
                <h3 className='fw-bold my-2'>Class: {student?.class}</h3>
                <h3 className='fw-bold my-2'>Hall: {student?.hall}</h3>
                <h3 className='fw-bold my-2'>Status: {student?.status}</h3>
            </div> : ''
            }
            </Col>
            <Col lg={6} className="addfood_colam my-4">
               {
                   findstudent?.studentId ? <>
                    <h4 className='fw-bold text-primary my-4 ms-4'>Distribute Food Student</h4>
                <Form className='p-4' onSubmit={SubmitHandler} >
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Student Id"
                        className="mb-3  fw-bold text-info fs-6"
                        >
                        <Form.Control readOnly value={findstudent?.studentId} name="studentId" type="text" onBlur={onBlurHandler} placeholder="Student Id" />
                    </FloatingLabel>

                    <h4 className='text-center fw-bold my-4 text-success'>Already served</h4>

                    <FloatingLabel
                        controlId="floatingInput"
                        label="Set Food Item List"
                        className="mb-3  fw-bold text-info fs-6"
                        >
                        <Form.Control name="foodItemList" type="text" onBlur={onBlurHandler} placeholder="Set Food Item List" />
                    </FloatingLabel>

                    <button type='submit' className='btn btn-dark text-warning my-4'>ADD STUDENT</button>
                </Form>
                   </> : <>
                   <h4 className='fw-bold text-primary my-4 ms-4'>Distribute Food Student</h4>
                <Form className='p-4' onSubmit={SubmitHandler} >
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Student Id"
                        className="mb-3  fw-bold text-info fs-6"
                        >
                        <Form.Control value={student?.roll} readOnly name="studentId" type="text" onBlur={onBlurHandler} placeholder="Student Id" />
                    </FloatingLabel>
                    
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Date"
                        className="mb-3  fw-bold text-info fs-6"
                        >
                        <Form.Control name="date" type="date" onBlur={onBlurHandler} placeholder="Date" />
                    </FloatingLabel>

                    <Form.Select name="shift" onBlur={onBlurHandler} aria-label="Default select example">
                            <option>SELECT SHIFT</option>
                            <option value="day">day</option>
                            <option value="night">night</option>
                    </Form.Select>

               

                    <Form.Select name="foodItemList" onBlur={onBlurHandler} aria-label="Default select example">
                            <option>SELECT Food List</option>
                            {
                                foodlist.map(food => <option value={food.name}>{food.name}</option>)
                            }
                            
        
                    </Form.Select>
                    <button type='submit' className='btn btn-dark text-warning my-4'>ADD STUDENT</button>
                </Form>
                   </>

               }
            </Col>
        </Row>
    );
};

export default Distribution;