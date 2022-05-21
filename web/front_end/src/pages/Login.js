import React from 'react';
import { Button,Form, Container, Row, Col} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import HttpMan from '../util/HttpMan';
import {setCookie} from '../util/CookieMan';


function Login() {
    
    const navigate = useNavigate();
    const [creds, setCreds] = React.useState({});

    const setValues = (e) => {
        const {name, value} = e.target; 
        setCreds({
            ...creds,
            [name]: value
        });
    }

    const doLogin = async (e) =>{
        e.preventDefault();
        const usr = creds["user"];
        const pass = creds["pass"];
        
        if(!usr || !pass){
            alert('Rellena los campos!');
            return;
        } 
        try{
            const {data} = await HttpMan.post('/login', {
                user: usr,
                password: pass
            });

            setCookie('user', data.username);
            navigate('/menu');
        }catch (err){
            alert('Usuario no encontrado!');
        }
    }


    return (
        <Container>
        <h1 className="shadow-sm mt-5 p-3 text-center rounded">Dispensador de pastillas</h1>
        <Row className="mt-5">
            <Col lg={5} md={6} sm={12} className="p-5 m-auto shadow-sm rounded-lg">
                <Form onSubmit={doLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label>Usuario</Form.Label>
                        <Form.Control 
                            name="user"
                            placeholder="Ingrese su usuario" 
                            onChange={(e)=>setValues(e)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control 
                            name="pass"
                            type="password" 
                            placeholder="Ingrese su contraseña" 
                            onChange={(e)=>setValues(e)}
                        />
                    </Form.Group>
                    <Col className="mt-4">
                        <Row>
                            <Button type="submit" variant="primary btn-block">
                                Login
                            </Button>
                        </Row>
                        <Row className='row justify-content-center mt-3'>
                            <a href="/register">Click aquí para crear tu cuenta</a>
                        </Row>
                    </Col>
                </Form>
            </Col>
        </Row>
        <h6 className="mt-5 p-5 text-center text-secondary ">Copyright © 2022 - Alan David González López</h6>
    </Container>
    );
  }


export default Login