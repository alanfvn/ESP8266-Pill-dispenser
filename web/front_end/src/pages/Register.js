import React from 'react';
import { Button,Form, Container, Row, Col} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
//imports
import HttpMan from '../util/HttpMan';

function Register() {
    //variables
    const navigate = useNavigate();
    const defValues = {data: "", errors: false};
    const [values, setValues] = React.useState({
        "names": defValues, "surnames": defValues,
        "username": defValues, "password": defValues,
        "confirm": defValues
    });
    

    const handleInput = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, 
            [name]: { "data": value,"errors": false} 
        });
    };  

    const handleErrors = () =>{
        const replace = {};
        let errFound = 0;

            for (const [name, value] of Object.entries(values)) {
                const data = value.data;
                let error = false;
                switch(name){
                    case "username":
                    case "surnames":
                    case "names":                    
                        if(!data){
                            error = true;
                            errFound++;
                        }
                    break;
        
                    case "password":
                        if(data.length < 5){
                            error = true;
                            errFound++;
                        }
                    break;

                    case "confirm":
                        if(values["password"].data !== data){
                            error = true;
                            errFound++;
                        }
                    break;

                    default: break;
            }
            replace[name] = {"data": data, "errors": error}
        } 
        setValues(replace);
        return errFound;
    }

    const isError = (name) => {
        const err = values[name].errors;
        return err;
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const errors = handleErrors();

        if(errors > 0){
            alert("Verifica tus datos por favor...");
            return;
        }

        try{

           const {username, password, names, surnames} = values;

           const {data} = await HttpMan.post('/create_account', {
                user: username.data,
                password: password.data,
                name: names.data,
                surname: surnames.data
           });
           
           const message = data.create_account_status_code;
           if(message !== '00000'){
               alert(`No se ha podido crear tu cuenta, CODIGO DE ERROR: ${message}`);
               e.target.reset();
               return;
           }
           alert('CUENTA CREADA!');
           navigate('/');
        }catch(err){ }


    }

    return (
        <Container>
        <h1 className="shadow-sm mt-5 p-3 text-center rounded">Registro</h1>
        <Row className="mt-5">
            <Col lg={5} md={6} sm={12} className="p-5 m-auto shadow-sm rounded-lg">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombres</Form.Label>
                        <Form.Control 
                            isInvalid={isError("names")}
                            name="names"
                            placeholder="Ingrese sus nombres" 
                            onChange={(e)=>handleInput(e)}
                        />
                        <Form.Control.Feedback type='invalid'>Este campo no puede estar vacio</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Apellidos</Form.Label>
                            <Form.Control
                                isInvalid={isError("surnames")} 
                                name="surnames"
                                placeholder="Ingrese sus apellidos" 
                                onChange={(e)=>handleInput(e)}
                            />
                            <Form.Control.Feedback type='invalid'>Este campo no puede estar vacio</Form.Control.Feedback>
                    </Form.Group>
        
                    <Form.Group  className="mb-3">
                        <Form.Label>Usuario</Form.Label>
                        <Form.Control 
                            isInvalid={isError("username")} 
                            name="username"
                            placeholder="Ingrese su usuario" 
                            onChange={(e)=>handleInput(e)}
                        />
                        <Form.Control.Feedback type='invalid'>Este campo no puede estar vacio</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control 
                            isInvalid={isError("password")} 
                            name="password" 
                            type="password" 
                            placeholder="Ingrese su contraseña" 
                            onChange={(e)=>handleInput(e)}
                        />
                        <Form.Control.Feedback type='invalid'>La contraseña es invalida</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group  className="mb-3">
                        <Form.Label>Confirmar contraseña</Form.Label>
                        <Form.Control
                            isInvalid={isError("confirm")} 
                            name="confirm"
                            type="password" 
                            placeholder="Ingrese su contraseña" 
                            onChange={(e)=>handleInput(e)}
                        />
                        <Form.Control.Feedback type='invalid'>Las contraseñas no coinciden</Form.Control.Feedback>
                    </Form.Group>
                    <Row className="mt-5">
                        <Col>
                            <Button type="submit" variant="primary btn-block">
                                Registrarse
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="secondary btn-block" onClick={()=>navigate('/')}>
                                Cancelar
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
        <h6 className="mt-5 p-5 text-center text-secondary ">Copyright © 2022 - Alan David González López</h6>
    </Container>
    );
  }

export default Register