# UPI QR Code Generator - System Architecture Document

## 1. Introduction

This document outlines the system architecture of the "UPI QR Code" application. The application is a single-page web application designed to generate UPI (Unified Payments Interface) QR codes dynamically based on user input. It allows users to input merchant details, UPI ID, amount, and description, and then generates a scannable QR code. Additionally, it supports downloading the generated QR code as an image and copying the UPI payment link. The application can also pre-fill payment details via URL parameters.

## 2. Technology Stack

The application is built using the following core technologies and libraries:

*   **Frontend Framework:** React (with `create-react-app` boilerplate)
*   **State Management:** React's `useState` and `useEffect` hooks
*   **UI Framework:** Bootstrap (via `react-bootstrap` components)
*   **Styling:** SCSS (Sass) and CSS
*   **QR Code Generation:** `react-qr-code`
*   **Image Handling:** `html-to-image` (for downloading QR code as PNG)
*   **Alerts/Notifications:** `sweetalert2`
*   **Module Bundler:** Webpack (via `react-scripts`)
*   **Package Manager:** npm

## 3. Application Architecture

The application follows a component-based architecture, characteristic of React applications.

### 3.1. Component Diagram

The core of the application resides within the `App.jsx` component.

```
+-----------------+
|   index.js      |
|-----------------|
| - Initializes   |
|   React app     |
| - Renders <App/>|
+--------|--------+
         |
         v
+--------v--------+
|    App.jsx      |
|-----------------|
| - Main UI/Logic |
| - State Mgmt    |
| - QR Code Gen.  |
| - Handles Input |
| - Download/Copy |
| - Fetches UPI   |
|   data from     |
|   upi.json      |
+--------|--------+
         |
         v
+--------v--------+
|  React-Bootstrap|
|  Components     |
| (Form, Button,  |
|  Col, Container,|
|  Row)           |
+--------|--------+
         |
         v
+--------v--------+
|   react-qr-code |
|  (QR Code Display)|
+-----------------+
```

### 3.2. Data Flow and Logic

1.  **Initialization (`index.js`):** The `index.js` file is the entry point, rendering the root `App` component into the DOM. It also imports global styles (`bootstrap/scss/bootstrap.scss`, `index.css`).
2.  **Main Application Logic (`App.jsx`):**
    *   **State Management:** The `App.jsx` component uses `useState` hooks to manage various pieces of data: `upi` (the UPI ID), `upiId` (internal ID from `upi.json`), `qr` (the generated UPI QR string), `marchant` (selected merchant), `name` (merchant/payee name), `amount`, `description`, and `showPayment` (for conditional rendering based on URL parameters).
    *   **Form Handling:** The `handleUpiId` function updates the component's state based on user input in the various form fields (merchant list, name, UPI ID, amount, description).
    *   **QR String Generation:** A `useEffect` hook monitors changes in `upi`, `marchant`, `name`, `amount`, and `description` to dynamically construct the `qr` string in the `upi://pay` format.
    *   **UPI Data Source:** The `upi.json` file is imported and used to populate the "Merchant List" dropdown and to pre-fill UPI details based on selection.
    *   **URL Parameter Handling:** Another `useEffect` hook runs on component mount to check for URL search parameters (e.g., `?qr=ID&amount=...`). If found, it populates the form fields and generates the QR code accordingly, enabling direct payment links.
    *   **QR Code Display:** The `react-qr-code` component takes the `qr` state as its `value` prop to render the QR code visually.
    *   **Copy Functionality (`handleCopy`):** Uses `navigator.clipboard.writeText` to copy either the generated UPI string or a shareable link (constructed from current URL and parameters). `sweetalert2` is used to provide user feedback upon successful copy.
    *   **Download Functionality (`handleDownload`):** Utilizes the `html-to-image` library to capture the QR code container (`contentRef`) and convert it into a PNG image, which is then downloaded by the user. `sweetalert2` is used for notifications.

## 4. Key Features

*   **Dynamic QR Code Generation:** Real-time generation of UPI QR codes based on user input.
*   **Merchant Selection:** Option to select from a predefined list of merchants (`upi.json`) to pre-fill details.
*   **Custom Input:** Ability to manually enter UPI ID, merchant name, amount, and description.
*   **Copy UPI Link/Data:** One-click functionality to copy the generated UPI payment link or the raw UPI string.
*   **Download QR Code:** Download the generated QR code as a PNG image.
*   **URL Parameter Support:** Pre-fill payment details directly from URL query parameters for quick payments or sharing.
*   **Responsive UI:** Uses Bootstrap for a responsive and mobile-friendly interface.

## 5. Dependencies

The `package.json` lists the following key dependencies:

*   `@testing-library/jest-dom`
*   `@testing-library/react`
*   `@testing-library/user-event`
*   `bootstrap`
*   `html-to-image`
*   `react`
*   `react-bootstrap`
*   `react-dom`
*   `react-qr-code`
*   `react-scripts`
*   `sass`
*   `sweetalert2`
*   `web-vitals`

## 6. Styling

The application's visual presentation is managed through:

*   **Bootstrap:** Provides a robust set of UI components and a responsive grid system.
*   **SCSS:** Custom styling leveraging Sass (`bootstrap/scss/bootstrap.scss`).
*   **CSS:** Specific styles defined in `App.css` and `index.css`.

## 7. Deployment

Given the `react-scripts` dependency and the `build` script in `package.json`, the application is intended to be built into static assets (HTML, CSS, JS) and deployed as a static website on platforms like GitHub Pages (as suggested by the commented-out link in `App.jsx`), Netlify, Vercel, or any standard web server.