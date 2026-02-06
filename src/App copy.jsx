import './App.css';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import linkImage from './link.png'
import copyImage from './copy.png'
import upiJson from './upi.json'
import { useState } from 'react';


function App() {
  document.title = 'UPI QR Code';

  let [upiId, setUpiId] = useState({
    merchant: "",
    name: "",
    amount: "",
    description: "",
    qr: "upi://pay?pa=",
    upi: ""

  });

  const handleUpiId = (e) => {
    let upiData = null;
    if (e.target.value) {
      upiData = upiJson.filter((item) => (item.upi_id === e.target.value))[0];
      setUpiId({
        ...upiId,
        [e.target.name]: e.target.value
      });
    }
    if (upiData.upi_id) {
      setUpiId({
        ...upiId,
        upi: upiData.upi_id
      });
    }
    console.log(e.target.name);
    
    // console.log(upiId);
  }
  
  return (
    <>
      <Container className='py-5'>
        <h1 className='text-center'>UPI QR Code</h1>
        <p className='text-center'>Scan the QR code to pay using UPI</p>
        <div className='d-flex justify-content-center'>
          <Row style={{ maxWidth: '950px', width: '100%' }}>
            <Col md={{ span: 6 }}>
              <Form.Group className="mb-2" controlId="merchantList">
                <Form.Label>Merchant List</Form.Label>
                <Form.Select aria-label="Merchant List" value={upiId.merchant} name='merchant' onChange={handleUpiId}>
                  <option>Select Any of this</option>
                  {upiJson.map((item, index) => { return (<option key={index} value={item.upi_id}>{item.merchant_name}</option>) })}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2" controlId="merchantName">
                <Form.Label>Merchant / Payee Name</Form.Label>
                <Form.Control type="text" value={upiId.name} placeholder="Enter your business name here..." />
              </Form.Group>
              <Form.Group className="mb-2" controlId="upiId">
                <Form.Label>UPI ID</Form.Label>
                <Form.Control type="text" placeholder="Enter your UPI ID here..." value={upiId.upi} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="transactionAmount">
                <Form.Label>Transaction Amount</Form.Label>
                <Form.Control type="text" placeholder="Enter transaction amount here..." value={upiId.amount} onChange={handleUpiId} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="transactionDescription">
                <Form.Label>Description (Notes)</Form.Label>
                <Form.Control type="text" placeholder="Enter description here..." />
              </Form.Group>
              <Form.Group className="mb-2" controlId="button">
                <Button variant="primary" className='w-100'>Download QR Code</Button>
                <a href="#home">Open Link On Phone</a> <span className='text-muted'>(Requires UPI App)</span>
                <a href="#home"><img src={copyImage} alt="" srcSet="" /></a>
                <a href="#home"><img src={linkImage} alt="" srcSet="" /></a>
              </Form.Group>
            </Col>
            <Col md={{ span: 6 }}>
              <div className='rounded-4 shadow border pb-3 bg-white'>
                <div className="mt-3">
                  <p className='text-center fw-bolder text-dark fs-4 text-uppercase lh-md py-1 bg-light'>{'Merchannt Name'}</p>
                </div>
                <div className='mt-4 d-flex justify-content-center'>
                  <QRCode value={upiId.qr} size={225} />
                </div>
                <p className='text-center mt-3'>{/* UPI ID:  */}{ upiId.upi }</p>
                <p className="text-center mt-3 fw-bolder fs-5">Scan and pay with any BHIM UPI app</p>
                <div className="d-flex justify-content-center mt-4" style={{ columnGap: "1.5rem" }}>
                  <img src="/bhim.svg" alt="BHIM" style={{ height: "2.5rem" }} />
                  <img src="/upi.svg" alt="UPI" style={{ height: "2.5rem" }} />
                </div>
                <div className="d-flex justify-content-center mt-4" style={{ columnGap: "1.5rem" }}>
                  <img src="/g-pay.svg" alt="BHIM" style={{ height: "1.5rem" }} />
                  <img src="/phonepe.svg" alt="UPI" style={{ height: "1.5rem" }} />
                  <img src="/paytm.svg" alt="UPI" style={{ height: "1.5rem" }} />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}

export default App;
/* https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=sandiptawhare18081998-1%40okhdfcbank */