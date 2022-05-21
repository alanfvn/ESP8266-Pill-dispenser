import React from 'react'

import {
    Nav, Navbar,
    NavDropdown,Row,Col,
}   from 'react-bootstrap'

import {getCookie, cleanCookies} from '../../util/CookieMan';
import {useNavigate} from 'react-router-dom';


function Navigation({location}){
    const user = getCookie('user') ?? "N/A";
    const nav = useNavigate();

    const logout = () =>{
        nav('/');
        cleanCookies();
    }


    return (
            <Navbar bg="dark" variant="dark" expand="sm" collapseOnSelect>    
            <Navbar.Brand>Dispensador de pastillas</Navbar.Brand>
            <Navbar.Toggle className="coloring"/>
            <Navbar.Collapse align="end">
                <Nav activeKey={location.pathname} className="ml-auto">
                    <NavDropdown title="Cuenta" alignRight>
                        <NavDropdown.Item className="disabled" >
                            <Row>
                                <Col>{`Estas logeado como @${user.toUpperCase()}`}</Col>
                            </Row>
                        </NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item onClick={logout}>Cerrar Sesión</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}


export default Navigation