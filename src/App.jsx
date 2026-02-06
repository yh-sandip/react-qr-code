import './App.css';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import linkImage from './link.png'
import copyImage from './copy.png'
import upiJson from './upi.json'
import { useEffect, useRef, useState } from 'react';
import { toPng } from "html-to-image";
import Swal from 'sweetalert2';


function App() {
  document.title = 'UPI QR Code';

  let [upi, setUpi] = useState('');
  let [upiId, setUpiId] = useState('');
  let [qr, setQr] = useState('');
  let [marchant, setMarchant] = useState('');
  let [name, setName] = useState('');
  let [amount, setAmount] = useState('');
  let [description, setDescription] = useState('');
  let [showPayment, setShowPayment] = useState('');


  let qrcolor = () => {
    let qrcolor = '1234567890abcdef';
    qrcolor = qrcolor.split('').sort(function () { return 0.5 - Math.random() }).join('').substring(0, 6);

    return '000';
  }

  const handleUpiId = (e) => {
    switch (e.target.name) {
      case 'merchant':
        if (e.target.value !== 'other') {
          let upiData = upiJson.filter((item) => (item.upi_id === e.target.value))[0];
          setUpi(upiData.upi_id);
          setMarchant(upiData.upi_id);
          setName(upiData.merchant_name);
          setUpiId(upiData.id);

        } else {
          setUpi('');
          setMarchant(e.target.value);
          setName('');
        }
        break;

      case 'name':
        setName(e.target.value);
        break;

      case 'amount':
        setAmount(e.target.value);
        break;

      case 'description':
        setDescription(e.target.value);
        break;

      case 'upi':
        setUpi(e.target.value);
        break;

      default:
        break;
    }
  }

  useEffect(() => { setQr(`upi://pay?pa=${upi}&pn=${name}&am=${amount}&tn=${description}&cur=INR`); }, [upi, marchant, name, amount, description]);
  const useSearchParams = new URLSearchParams(window.location.search);
  useEffect(() => {
    if (useSearchParams.size > 0) {
      setShowPayment(true);
      let upiData = upiJson.filter((item) => (item.id === parseInt(useSearchParams.get('qr'))))[0];
      if (upiData) {
        setUpi(upiData.upi_id ?? '');
        setMarchant(upiData.upi_id ?? '');
        setName(upiData.merchant_name ?? '');
        setUpiId(upiData.id ?? '');
        setDescription(useSearchParams.get('description') === '' ? (upiData.notes ?? '') : useSearchParams.get('description'));
      } else {
        setDescription(useSearchParams.get('description'));
      }
      setAmount(useSearchParams.get('amount'))
      setQr(`upi://pay?pa=${upi}&pn=${name}&am=${amount}&tn=${description}&cur=INR`);
    } else {
      setShowPayment(false);
    }
    setShowPayment(showPayment);

  }, []);
  const contentRef = useRef(null);

  const handleCopy = (content) => {
    var text = '';
    if (content === 'link') {
      // text = `https://codersandip.github.io/upi/?qr=${qr}&amount=${amount}&name=${name}&description=${description}`;
      text = window.location.origin + `/?qr=${upiId}&amount=${amount}&name=${name}&description=${description}`;
      navigator.clipboard.writeText(text);
    } else {
      navigator.clipboard.writeText(qr);
      text = qr;
    }
    Swal.fire({
      icon: 'success',
      title: 'Copied..!',
      text: text,
      showConfirmButton: false,
      timer: 1500
    });
  }

  const handleDownload = () => {
    toPng(contentRef.current)
      .then(function (dataUrl) {
        var image_name = name + upi;
        var link = document.createElement('a');
        link.download = `upi_${image_name}.png`;
        link.href = dataUrl;
        link.click();
        document.body.removeChild(link);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });

  }

  return (
    <>
      <Container className='py-5'>
        <h1 className='text-center'>UPI QR Code</h1>
        <p className='text-center'>Scan the QR code to pay using UPI</p>
        <div className='d-flex justify-content-center'>
          <Row style={{ maxWidth: '950px', width: '100%' }}>
            <Col md={{ span: 6 }} className={showPayment ? 'd-none' : ''}>
              <div className='d-flex align-items-center h-100'>
                <div>
                  <Form.Group className="mb-2" controlId="merchantList">
                    <Form.Label>Merchant List</Form.Label>
                    <Form.Select size='sm' aria-label="Merchant List" value={marchant} name='merchant' onChange={handleUpiId}>
                      <option value="">Select Any of this</option>
                      {upiJson.map((item, index) => { return (<option key={index} value={item.upi_id}>{item.merchant_name}</option>) })}
                      <option value="other">Others</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="merchantName">
                    <Form.Label>Merchant / Payee Name</Form.Label>
                    <Form.Control size='sm' type="text" name='name' value={name} placeholder="Enter your business name here..." onChange={handleUpiId} />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="upiId">
                    <Form.Label>UPI ID</Form.Label>
                    <Form.Control size='sm' type="text" name='upi' value={upi} placeholder="Enter your UPI ID here..." onChange={handleUpiId} />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="transactionAmount">
                    <Form.Label>Transaction Amount</Form.Label>
                    <Form.Control size='sm' type="text" name='amount' value={amount} placeholder="Enter transaction amount here..." onChange={handleUpiId} />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="transactionDescription">
                    <Form.Label>Description (Notes)</Form.Label>
                    <Form.Control size='sm' type="text" name='description' value={description} placeholder="Enter description here..." onChange={handleUpiId} />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="button">
                    <Button variant="primary" className='w-100' onClick={handleDownload}>Download QR Code</Button>
                    <a href={qr}>Open Link On Phone</a> <span className='text-muted'>(Requires UPI App)</span>
                    <a href="/" onClick={(e) => { e.preventDefault(); handleCopy('text') }}><img src={copyImage} alt="" srcSet="" /></a>
                    <a href="/" onClick={(e) => { e.preventDefault(); handleCopy('link') }}><img src={linkImage} alt="" srcSet="" /></a>
                  </Form.Group>
                </div>
              </div>
            </Col>
            <Col md={{ span: 6 }} className={showPayment ? 'd-none' : ''}>
              <div className='px-4'>
                <div className='rounded-4 shadow border pb-3 bg-white' ref={contentRef}>
                  <div className="mt-3">
                    <p className='text-center fw-bolder text-dark fs-4 text-uppercase py-1 bg-light'>{name === '' ? 'Merchannt Name' : name}</p>
                  </div>
                  <div className='mt-4 d-flex justify-content-center'>
                    <QRCode value={qr} fgColor={'#' + qrcolor()} title={qr} size={190} level='L' />
                  </div>
                  <p className='text-center mt-3'>{upi === '' ? 'merchant@upi' : upi}</p>
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
              </div>

            </Col>
            <Col md={{ span: 6, offset: 3 }} className={showPayment ? '' : 'd-none'}>
              <Form.Group className="mb-2" controlId="merchantName">
                <Form.Label>Merchant / Payee Name</Form.Label>
                <Form.Control type="text" name='name' value={name} disabled={name === '' ? false : true} placeholder="Enter your business name here..." onChange={handleUpiId} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="upiId">
                <Form.Label>UPI ID</Form.Label>
                <Form.Control type="text" name='upi' value={upi} disabled={upi === '' ? false : true} placeholder="Enter your UPI ID here..." onChange={handleUpiId} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="transactionAmount">
                <Form.Label>Transaction Amount</Form.Label>
                <Form.Control type="text" name='amount' value={amount} disabled={amount === '' ? false : true} placeholder="Enter transaction amount here..." onChange={handleUpiId} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="transactionDescription">
                <Form.Label>Description (Notes)</Form.Label>
                <Form.Control type="text" name='description' value={description} disabled={description === '' ? false : true} placeholder="Enter description here..." onChange={handleUpiId} />
              </Form.Group>
              <Form.Group className="mb-2" controlId="button">
                <a href={qr} className='btn btn-primary w-100'>Pay&nbsp;<small>(Requires UPI App)</small></a>
              </Form.Group>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}

export default App;
/* https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=sandiptawhare18081998-1%40okhdfcbank */

