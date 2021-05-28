import React, {useState, useEffect} from 'react';
import { Col, Row, FormGroup, Label, FormText } from 'reactstrap';
import Validator from './components/validators/Validator';
import { ValidatorForm } from 'react-form-validator-core';
import Swal from 'sweetalert2';
import './App.css';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true
});

function App() {

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [state, setState] = useState();
  const [district, setDistrict] = useState();
  const [pincode, setPincode] = useState();
  const [vaccineName, setVaccineName] = useState('');
  const [age, setAge] = useState('');
  const [feeType, setFeeType] = useState('');
  const [doseType, setDoseType] = useState('');
  const [dayRange, setDayRange] = useState('');
  const [frequency, setFrequency] = useState('');
  const [phoneNo, setPhoneNo] = useState('91');
  const [email, setEmail] = useState('');

  useEffect(()=>{

    async function fetchData(){
      await getStates();
    }
    fetchData();

  },[]);

  const getStates = async ()=>{
    const res = await fetch('/location/states', {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const response = await res.json();
    setStates(response.states);
  }

  const getAllDistrictOfState = async (stateId) => {
    const res = await fetch(`/location/districts/${stateId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const response = await res.json();
    setDistricts(response.districts);
  }

  const onSubmit = async() =>{
    const alertForm = {
      'phone_no': phoneNo
    };
    if(pincode){
      alertForm['pincode'] = Number(pincode);
    }else if(state && districts){
      alertForm['state'] = Number(state);
      alertForm['district'] = Number(district);
    }
    if(vaccineName) alertForm['vaccine_name'] = vaccineName;
    if(age) alertForm['age'] = Number(age);
    if(feeType) alertForm['fee_type'] = feeType;
    if(doseType) alertForm['dose_type'] = Number(doseType);
    if(dayRange) {
      alertForm['day_range'] = Number(dayRange);
    }else{
      alertForm['day_range'] = 1;
    };
    if(frequency) {
      alertForm['alert_frequency'] = Number(frequency);
    }else{
      alertForm['alert_frequency'] = 24;
    }
    if(email) alertForm['email'] = email;

    const res = await fetch('/api/create_alert',{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(alertForm)
    })

    const response = await res.json();

    if (res.status === 200) {
      if (response.status) {
          Toast.fire({
            icon: "success",
            title: response.message,
      });
      } else {
          Toast.fire({
              icon: "error",
              title: response.message,
          });
      }
    } else {
      Toast.fire({
          icon: "error",
          title: response.message,
      });
    }
  }

  return (
    <div className="App">
      <header>
        <div className="Header">Covid-19 Vaccine Live Alert</div>
        <div className="Info">Early vaccination will avoid the potential risk of COVID-19 infection in you. Vaccination will ensure better safety for you and those around you, acting as a shield of protection for all your loved ones.</div>
        <div className="Mobile-Info">Early vaccination will avoid the potential risk of COVID-19 infection in you.</div>
        <div className="Sub-Info">With a motive to support Indian citizens during this difficult COVID situation, we had developed this application, a non-profit web-site to help you in live tracking the vaccine availability @ your area. You will receive an instantaneous alert on your WhatsApp number. Till then STAY HOME. STAY SAFE.</div>
      </header>
      <section className="Form-Container">
          <div className="Form-Area">
            <div className="Form-Header">Provide the required information to get alerts</div>
            <ValidatorForm className="Form" onSubmit={(e)=>{
                                        e.preventDefault(); 
                                        onSubmit();
                                    }}>
              <Row>
              <Col md={6}>
                  <FormGroup>
                    <Label for="pincode" className="Form-Label">Enter Pincode</Label>
                    <Validator id="pincode" type="text" className="form-control" value={pincode}
                        disabled={state}
                        validators={!state && ['required', 'isNumber', 'minStringLength:6', 'maxStringLength:6']}
                        errorMessages={!state && ['This field is required', 'Only digits are allowed', '6 digit valid pincode is allowed', '6 digit valid pincode is allowed']}
                        onChange={(e) => { 
                            setPincode(e.target.value);
                            setState();
                            setDistrict();
                            }} >
                    </Validator>
                  </FormGroup>
                  </Col>
              </Row>
              <Row>
                <div className="Or">Or</div>
              </Row>
              <Row>
                <Col md={6}>
                <FormGroup>
                  <Label for="state" className="Form-Label">Select State</Label>
                  <Validator id="state" type="select" className="form-control" value={state}
                    disabled={pincode}
                    validators={!pincode && ['required']}
                    errorMessages={!pincode && ['This field is required']}
                    onChange={(e) => { 
                        setState(e.target.value);
                        setDistricts([]);
                        getAllDistrictOfState(e.target.value)
                        setDistrict();
                        setPincode();
                        }} >
                    <option value=""></option>
                    {states.length > 0 && states.map((item, key)=>{
                      console.log(item.state_id)
                    return (
                        <option key={key} value={item.state_id}>{item.state_name}</option>
                        )
                    })}
                  </Validator>
                </FormGroup>
                </Col><Col md={6}>
                <FormGroup>
                  <Label className="Form-Label">Select District</Label>
                  <Validator type="select" className="form-control" value={district}
                    disabled={pincode}
                    validators={!pincode && ['required']}
                    errorMessages={!pincode && ['This field is required']}
                    onChange={(e) => { 
                        setDistrict(e.target.value);
                        setPincode();
                        }} >
                    <option value=""></option>
                    {districts.length > 0 && districts.map((item, key)=>{
                      console.log(item.district_id)
                    return (
                        <option key={key} value={item.district_id}>{item.district_name}</option>
                        )
                    })}
                  </Validator>
                </FormGroup>
                </Col>
              </Row>
              <div className="Sub-Group">
              <Row>
                <Col md={6}>
                <FormGroup className="Form-Collate">
                  <Label for="vaccineName" className="Form-Label">Vaccine Name</Label>
                  <select id="vaccineName" type="text" className="form-control" value={vaccineName}
                    onChange={(e) => {
                      setVaccineName(e.target.value); 
                        }} >
                    <option value="">Any</option>
                    <option value="covishield">COVISHIELD</option>
                    <option value="covaxin">COVAXIN</option>
                    <option value="sputnik v">SPUTNIK V</option>
                  </select>
                </FormGroup>
                </Col><Col md={6}>
                <FormGroup className="Form-Collate">
                  <Label for="age" className="Form-Label">Age</Label>
                  <select id="age" type="text" className="form-control" value={age}
                    onChange={(e) => { 
                      setAge(e.target.value);
                        }} >
                    <option value="">Any</option>
                    <option value="18">18+</option>
                    <option value="45">45+</option>
                  </select>
                </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                <FormGroup className="Form-Collate">
                  <Label for="feeType" className="Form-Label">Fee Type</Label>
                  <select id="feeType" type="text" className="form-control" value={feeType}
                    onChange={(e) => { 
                      setFeeType(e.target.value);
                        }} >
                    <option value="">Any</option>
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </FormGroup>
                </Col><Col md={6}>
                <FormGroup className="Form-Collate">
                  <Label for="doseType" className="Form-Label">Dose Type</Label>
                  <select id="doseType" type="text" className="form-control" value={doseType}
                    onChange={(e) => { 
                      setDoseType(e.target.value);
                        }} >
                    <option value="">Any</option>
                    <option value="1">1st Dose</option>
                    <option value="2">2nd Dose</option>
                  </select>
                </FormGroup>
                </Col>
              </Row>
              <Row>
                {/* <Col md={6}>
                <FormGroup className="Form-Collate">
                  <Label for="dayRange" className="Form-Label">Slot Range</Label>
                  <select id="dayRange" type="text" className="form-control" value={dayRange}
                    onChange={(e) => { 
                      setDayRange(e.target.value);
                        }} >
                    <option value="1">1 Day</option>
                    <option value="2">2 Day</option>
                  </select>
                  <FormText>Next availability date range</FormText>
                </FormGroup>
                </Col> */}
                <Col md={6}>
                <FormGroup className="Form-Collate">
                  <Label for="frequency" className="Form-Label">Reminder Frequency</Label>
                  <select id="frequency" type="text" className="form-control" value={frequency}
                    onChange={(e) => { 
                      setFrequency(e.target.value);
                        }} >
                    <option value="24">1 day</option>
                    <option value="3">3 hours</option>
                    <option value="6">6 hours</option>
                  </select>
                  <FormText>Frequency to trigger alert</FormText>
                </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup className="Form-Collate">
                      <Label for="phoneNo" className="Form-Label">Whatsapp No</Label>
                      <Validator id="phoneNo" type="text" className="form-control" value={phoneNo}
                          validators={['required', 'isNumber', 'minStringLength:11']}
                          errorMessages={['This field is required', 'Only digits are allowed', 'Valid phone number with country code is mandatory']}
                          onChange={(e) => { 
                              setPhoneNo(e.target.value);
                              }} >
                      </Validator>
                      <FormText>Add country code at beginning without special characters</FormText>
                    </FormGroup>
                  </Col>
              </Row>
              <Row>
                  <Col md={6} style={{'display': 'none'}}>
                    <FormGroup className="Form-Collate">
                       <Label for="email" className="Form-Label">Email Address</Label>
                       <Validator id="email" type="text" className="form-control" value={email}
                          validators={['isEmail']}
                          errorMessages={['Provide valid email id']}
                          onChange={(e) => { 
                              setEmail(e.target.value);
                              }} >
                      </Validator>
                    </FormGroup>
                  </Col>
              </Row>
              </div>
              <button className="btn btn-primary mr-1" type="submit">Create Alert</button>
          </ValidatorForm>
          </div>
      </section>
      <footer className="Footer-Container">
          <div className="Footer-Area">
              <div className="Footer-Content"><strong>NOTE:</strong> Your privacy is our responsibility. Whatsapp number collected will not be commercialized or shared with any. In case of any clarification or support, feel free to contact us on covid.vaccine.alert.19@gmail.com</div>
          </div>
      </footer>
    </div>
  );
}

export default App;
