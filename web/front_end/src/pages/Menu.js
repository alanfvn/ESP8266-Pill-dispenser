import React from 'react';
import { Button, Form, Container, Table,Row, Col} from 'react-bootstrap';
import { useLocation,} from 'react-router-dom';
import Navigation from './components/Navigation';
//otros
import HttpMan from '../util/HttpMan';
import { getCookie } from '../util/CookieMan';

function Menu(){

    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const auth = getCookie('user');
    const loc = useLocation();

    const [alarms, setAlarms] = React.useState([]);
    const [data, setData] = React.useState({
            "alarm_name": {data: "", error: false},
            "dow": {data: "-1", error: false},
            "hour": {data: "", error: false}
    });

    const cargar = React.useCallback(()=>{
        HttpMan.get(`/fetch_alarms`, { headers: {
                "Authorization": `Bearer ${auth}`
        }}
        ).then(resp =>{
            setAlarms(resp.data);
        });
    }, [auth]);
    
    React.useEffect(()=>{
        cargar();
    }, [cargar]);




    async function deleteAlarm(id){
        await HttpMan.post('/delete_alarm', {alarm_id: id});
        cargar();
    }




    const handleInput = (e) => {
        const { name, value } = e.target;
        setData({ ...data, 
            [name]: { "data": value, "error": false} 
        });
    };  

    const hasError = (name) =>{
        return data[name].error;
    }

    const handleErrors = () => {
        const mapa = {}
        let errors = 0;

        for (const [name, value] of Object.entries(data)) {
            
            const {data} = value;
            let error = false;

            switch (name){

                case "alarm_name":
                case "hour":
                    if(!data){
                        error = true;
                        errors++;
                    }
                break;

                case "dow":
                    if(data === "-1"){
                        error = true;
                        errors++;
                    }
                break;
                
                default: break;
            }
            mapa[name] = {"data": data, "error": error}
        }
        setData(mapa);
        return errors;
    }


    const handleSubmit = async (e) =>{
        e.preventDefault();
        const amount = handleErrors();
        if(amount > 0){
            return;
        }

        const {alarm_name, dow, hour} = data;

        try{
            

            const {data} = await HttpMan.post('/create_alarm', {
                user: auth,
                alarm: alarm_name.data,
                day: dow.data,
                hour: hour.data
            });
    
            const message = data.create_alarm_status_code;

            if(message !== '00000'){
                alert(`No se ha podido crear la alarma, CODIGO DE ERROR: ${message}`);
                e.target.reset();
                return;
            }
            cargar();
            e.target.reset();
            alert('ALARMA CREADA!');

        }catch(err){}


    }   

    return (
        <div>
            <Navigation location={loc}/>
            <Container>
                <Form onSubmit={handleSubmit} className="mt-5">
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre de alarma</Form.Label>
                        <Form.Control 
                            name="alarm_name" 
                            isInvalid={hasError("alarm_name")}
                            placeholder="Ingrese nombre de la alarma" 
                            onChange={handleInput}
                        />
                        <Form.Control.Feedback type='invalid'>Este campo no puede estar vacio</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Row>
                            <Col>
                                <Form.Label>Ingresa el dia</Form.Label>
                                <Form.Control 
                                    name="dow" 
                                    isInvalid={hasError("dow")}
                                    as="select" 
                                    onChange={handleInput}
                                >
                                    <option value="-1">Selecciona un dia de la semana</option>
                                    {
                                        diasSemana.map((val, index) => <option key={index} value={index}>{val}</option>)
                                    }
                                </Form.Control>
                                <Form.Control.Feedback type='invalid'>
                                    Debe seleccionar un dia de la semana
                                </Form.Control.Feedback>
                            </Col>
                            <Col>
                                <Form.Label>Ingresa la hora</Form.Label>
                                <Form.Control 
                                   name="hour"
                                   isInvalid={hasError("hour")}
                                   type="time" 
                                   onChange={handleInput}
                                />
                                <Form.Control.Feedback type='invalid'>Debe ingresar una hora valida</Form.Control.Feedback>
                            </Col>
                        </Row>
                    </Form.Group>

                    <Row className='mt-4'>
                        <Col>
                            <Button type="submit" variant="primary btn-block">Enviar</Button>
                            
                        </Col>
                        <Col>
                            <Button variant="outline-secondary btn-block">Limpiar</Button>       
                        </Col>
                        <Col/>
                        <Col/>
                    </Row>
                </Form>

                <Table striped bordered className='mt-5'>
                    <thead>
                        <tr>
                            <th className='text-center'>Id</th>
                            <th className='text-center'>Nombre de alarma</th>
                            <th className='text-center'>Dia de la semana</th>
                            <th className='text-center'>Hora del dia</th>
                            <th className='text-center'>Borrar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                            alarms.map(alarm =>{
                                const {id_alarm, alarm_name, alarm_time, alarm_day} = alarm;
                                return (
                                    <tr key={id_alarm}>
                                        <td>{id_alarm}</td>
                                        <td>{alarm_name}</td>
                                        <td>{diasSemana[alarm_day]}</td>
                                        <td>{alarm_time}</td>
                                        <td className='text-center'>
                                            <Button variant="danger" onClick={()=>deleteAlarm(id_alarm)}>Borrar</Button></td>
                                     </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}

export default Menu