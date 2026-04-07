import './App.css';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import linkImage from './link.png';
import copyImage from './copy.png';
import upiJson from './upi.json';
import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import Swal from 'sweetalert2';

const paymentAppLogos = [
  { src: '/g-pay.svg', alt: 'Google Pay' },
  { src: '/phonepe.svg', alt: 'PhonePe' },
  { src: '/paytm.svg', alt: 'Paytm' },
];

const trustBadges = [
  { src: '/bhim.svg', alt: 'BHIM' },
  { src: '/upi.svg', alt: 'UPI' },
];

const amountPattern = /^\d*(\.\d{0,2})?$/;

function App() {
  document.title = 'UPI QR Code';

  const [upi, setUpi] = useState('');
  const [upiId, setUpiId] = useState('');
  const [qr, setQr] = useState('');
  const [marchant, setMarchant] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const contentRef = useRef(null);
  const searchParams = new URLSearchParams(window.location.search);

  const qrcolor = () => '000';

  const handleUpiId = (e) => {
    switch (e.target.name) {
      case 'merchant':
        if (e.target.value !== 'other') {
          const upiData = upiJson.filter((item) => item.upi_id === e.target.value)[0];
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
        if (e.target.value === '' || amountPattern.test(e.target.value)) {
          setAmount(e.target.value);
        }
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
  };

  useEffect(() => {
    setQr(`upi://pay?pa=${upi}&pn=${name}&am=${amount}&tn=${description}&cur=INR`);
  }, [upi, marchant, name, amount, description]);

  useEffect(() => {
    if (searchParams.size > 0) {
      setShowPayment(true);
      const upiData = upiJson.filter((item) => item.id === parseInt(searchParams.get('qr')))[0];

      if (upiData) {
        setUpi(upiData.upi_id ?? '');
        setMarchant(upiData.upi_id ?? '');
        setName(upiData.merchant_name ?? '');
        setUpiId(upiData.id ?? '');
        setDescription(
          searchParams.get('description') === '' ? (upiData.notes ?? '') : searchParams.get('description')
        );
      } else {
        setDescription(searchParams.get('description'));
      }

      setAmount(searchParams.get('amount'));
      setQr(`upi://pay?pa=${upi}&pn=${name}&am=${amount}&tn=${description}&cur=INR`);
    } else {
      setShowPayment(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = (content) => {
    let text = '';

    if (content === 'link') {
      text = `${window.location.origin}/?qr=${upiId}&amount=${encodeURIComponent(amount)}&name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`;
      navigator.clipboard.writeText(text);
    } else {
      navigator.clipboard.writeText(qr);
      text = qr;
    }

    Swal.fire({
      icon: 'success',
      title: 'Copied',
      text,
      showConfirmButton: false,
      timer: 1500,
      background: '#0f172a',
      color: '#f8fafc',
    });
  };

  const handleDownload = () => {
    toPng(contentRef.current)
      .then((dataUrl) => {
        const image_name = name + upi;
        const link = document.createElement('a');
        link.download = `upi_${image_name}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
      });
  };

  const previewName = name === '' ? 'Merchant Name' : name;
  const previewUpi = upi === '' ? 'merchant@upi' : upi;
  const previewAmount = amount === '' ? 'Flexible amount' : `Rs. ${amount}`;

  return (
    <div className="app-shell">
      <div className="app-bg app-bg-one" />
      <div className="app-bg app-bg-two" />
      <div className="app-grid" />

      <Container className="app-layout">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">Modern UPI QR builder</span>
            <h1>Design a payment page that looks sharp before anyone scans it.</h1>
            <p>
              Generate a premium-looking UPI QR experience with faster sharing, cleaner branding, and a
              storefront-style layout that feels made for today’s web.
            </p>

            <div className="hero-actions">
              <div className="hero-badge">
                <strong>Fast setup</strong>
                <span>Create and share in under a minute</span>
              </div>
              <div className="hero-badge">
                <strong>Link-ready</strong>
                <span>Send a payment page instead of plain text</span>
              </div>
            </div>

            <div className="hero-metrics">
              <div className="hero-metric">
                <strong>3 ways</strong>
                <span>Scan, share link, or download card</span>
              </div>
              <div className="hero-metric">
                <strong>All major apps</strong>
                <span>Built for BHIM, GPay, PhonePe, and Paytm</span>
              </div>
              <div className="hero-metric">
                <strong>Flexible pricing</strong>
                <span>Works for fixed requests or open amounts</span>
              </div>
            </div>
          </div>

          <div className="hero-spotlight">
            <div className="hero-card hero-card-main">
              <span className="hero-card-label">Live payment card</span>
              <strong>{previewName}</strong>
              <p>{previewUpi}</p>
              <div className="hero-card-amount">{previewAmount}</div>
            </div>

            <div className="hero-card hero-card-floating hero-card-top">
              <span className="hero-card-label">Ready to share</span>
              <strong>Payment link</strong>
              <p>Cleaner than sending raw UPI text</p>
            </div>

            <div className="hero-card hero-card-floating hero-card-bottom">
              <span className="hero-card-label">Built for mobile</span>
              <strong>Scan or open</strong>
              <p>Looks polished on phone and desktop</p>
            </div>
          </div>
        </section>

        <Row className="g-4 align-items-stretch justify-content-center">
          <Col lg={showPayment ? { span: 8, offset: 2 } : 5} className={showPayment ? '' : 'order-2 order-lg-1'}>
            {!showPayment ? (
              <section className="glass-panel form-panel slide-up">
                <div className="panel-heading">
                  <span className="panel-kicker">Customize payment</span>
                  <h2>Build your QR card</h2>
                  <p>Pick a merchant, fine-tune details, then share or download the finished payment card.</p>
                </div>

                <Form>
                  <Form.Group className="field-group" controlId="merchantList">
                    <Form.Label>Merchant List</Form.Label>
                    <Form.Select aria-label="Merchant List" value={marchant} name="merchant" onChange={handleUpiId}>
                      <option value="">Select Any of this</option>
                      {upiJson.map((item, index) => (
                        <option key={index} value={item.upi_id}>
                          {item.merchant_name}
                        </option>
                      ))}
                      <option value="other">Others</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="field-group" controlId="merchantName">
                    <Form.Label>Merchant / Payee Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={name}
                      placeholder="Enter your business name here..."
                      onChange={handleUpiId}
                    />
                  </Form.Group>

                  <Form.Group className="field-group" controlId="upiId">
                    <Form.Label>UPI ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="upi"
                      value={upi}
                      placeholder="Enter your UPI ID here..."
                      onChange={handleUpiId}
                    />
                  </Form.Group>

                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group className="field-group" controlId="transactionAmount">
                        <Form.Label>Transaction Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="amount"
                          value={amount}
                          inputMode="decimal"
                          pattern="^\d+(\.\d{1,2})?$"
                          placeholder="Enter transaction amount here..."
                          onChange={handleUpiId}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="field-group" controlId="transactionDescription">
                        <Form.Label>Description (Notes)</Form.Label>
                        <Form.Control
                          type="text"
                          name="description"
                          value={description}
                          placeholder="Enter description here..."
                          onChange={handleUpiId}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="action-stack">
                    <Button variant="primary" className="primary-action" onClick={handleDownload}>
                      Download QR Card
                    </Button>

                    <div className="link-actions">
                      <a href={qr} className="text-link">
                        Open on phone
                      </a>
                      <span className="support-text">Requires a UPI app</span>
                    </div>

                    <div className="icon-actions">
                      <a
                        href="/"
                        className="icon-button"
                        aria-label="Copy UPI text"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCopy('text');
                        }}
                      >
                        <img src={copyImage} alt="" />
                      </a>
                      <a
                        href="/"
                        className="icon-button"
                        aria-label="Copy payment link"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCopy('link');
                        }}
                      >
                        <img src={linkImage} alt="" />
                      </a>
                    </div>
                  </div>
                </Form>
              </section>
            ) : (
              <section className="glass-panel payment-panel slide-up">
                <div className="panel-heading">
                  <span className="panel-kicker">Direct payment</span>
                  <h2>Open this payment on your phone</h2>
                  <p>Fields are locked when they arrive from the shared link so the payer sees the intended request.</p>
                </div>

                <Form>
                  <Form.Group className="field-group" controlId="sharedMerchantName">
                    <Form.Label>Merchant / Payee Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={name}
                      disabled={name !== ''}
                      placeholder="Enter your business name here..."
                      onChange={handleUpiId}
                    />
                  </Form.Group>

                  <Form.Group className="field-group" controlId="sharedUpiId">
                    <Form.Label>UPI ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="upi"
                      value={upi}
                      disabled={upi !== ''}
                      placeholder="Enter your UPI ID here..."
                      onChange={handleUpiId}
                    />
                  </Form.Group>

                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group className="field-group" controlId="sharedTransactionAmount">
                        <Form.Label>Transaction Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="amount"
                          value={amount}
                          inputMode="decimal"
                          pattern="^\d+(\.\d{1,2})?$"
                          disabled={amount !== ''}
                          placeholder="Enter transaction amount here..."
                          onChange={handleUpiId}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="field-group" controlId="sharedTransactionDescription">
                        <Form.Label>Description (Notes)</Form.Label>
                        <Form.Control
                          type="text"
                          name="description"
                          value={description}
                          disabled={description !== ''}
                          placeholder="Enter description here..."
                          onChange={handleUpiId}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <a href={qr} className="btn primary-action w-100">
                    Pay now <small>(Requires UPI App)</small>
                  </a>
                </Form>
              </section>
            )}
          </Col>

          {!showPayment && (
            <Col lg={5} className="order-1 order-lg-2 d-flex justify-content-center">
              <section className="glass-panel preview-panel slide-in" ref={contentRef}>
                <div className="preview-header">
                  <div>
                    <span className="panel-kicker">Live preview</span>
                    <h2>{previewName}</h2>
                  </div>
                  <div className="amount-pill">{previewAmount}</div>
                </div>

                <div className="preview-card">
                  <div className="preview-rings" />
                  <div className="qr-frame">
                    <QRCode value={qr} fgColor={`#${qrcolor()}`} title={qr} size={220} level="L" />
                  </div>

                  <div className="preview-copy">
                    <p className="upi-id">{previewUpi}</p>
                    <p className="scan-text">Scan and pay with any supported UPI app.</p>
                  </div>

                  <div className="badge-row">
                    {trustBadges.map((item) => (
                      <div className="brand-chip" key={item.alt}>
                        <img src={item.src} alt={item.alt} />
                      </div>
                    ))}
                  </div>

                  <div className="apps-row">
                    {paymentAppLogos.map((item) => (
                      <div className="app-chip" key={item.alt}>
                        <img src={item.src} alt={item.alt} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default App;
