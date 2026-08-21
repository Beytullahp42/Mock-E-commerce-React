# Mock E-Commerce Frontend

React frontend for my mock e-commerce portfolio project.

I originally wrote this application as the final project for the **SE-016 Web Applications** course at the Estonian Entrepreneurship University of Applied Sciences during my Erasmus exchange in the **2024-2025 spring semester**. The preserved, polished school submission is available on the [`course-final-2025`](https://github.com/Beytullahp42/Mock-E-commerce-React/tree/course-final-2025) branch. The `master` branch contains the post-course portfolio improvements while keeping the project's simple handwritten Tailwind identity.

## Live demo

- Customer application: https://mock-ecommerce.beytullahp.com
- Admin panel: https://mock-ecommerce.beytullahp.com/admin
- API: https://mec-api.beytullahp.com

The public demo is reset every day. Accounts, orders, products, and admin changes may disappear.

Demo administrator:

- Email: `admin@admin.com`
- Password: `password123`

The login page also exposes these credentials through its small `?` help button.

## Features

- Public responsive product catalog
- Email registration and login with one-hour JWTs stored intentionally in `localStorage`
- Authenticated per-account cart, checkout, and order history
- Role-protected product and order administration
- Product image upload with FilePond
- Hard product deletion with a confirmation explaining that completed orders remain unchanged
- Historical order-item snapshots that retain their checkout-time name, description, price, quantity, and image
- Mobile, tablet, and desktop layouts using the original solid amber, blue, green, and red styling

The checkout card form is demonstration-only. Card values never leave the browser and are not stored or processed.

## Run locally with Docker Compose

The sibling `Mock-E-commerce-SpringBoot` repository contains the Compose file for the entire application. It builds this repository and the backend from their current local source code.

```bash
cd ../Mock-E-commerce-SpringBoot
cp .env.example .env
docker compose up -d --build
```

The frontend is then available at http://localhost:3000. The default API URL is http://localhost:8080.

`VITE_BASE_URL` is a Docker build argument, so set it before building when the API is hosted elsewhere. The backend's `CORS_ALLOWED_ORIGINS` value must contain the exact frontend origin.

## Local Node development

```bash
npm install
npm run dev
```

Verification commands:

```bash
npm run lint
npm run build
```

## Technologies

- React 19, Vite, and TypeScript
- Tailwind CSS
- Axios
- FilePond
- React Router

Backend repository: https://github.com/Beytullahp42/Mock-E-commerce-SpringBoot

## Screenshots from the original course version

<img src="Screenshots/Screenshot_25-5-2025_185930_localhost.jpeg" width="600"/>
<img src="Screenshots/Screenshot_25-5-2025_19048_localhost.jpeg" width="600"/>
<img src="Screenshots/Screenshot_25-5-2025_19251_localhost.jpeg" width="600"/>
<img src="Screenshots/Screenshot_25-5-2025_19158_localhost.jpeg" width="600"/>
<img src="Screenshots/Screenshot_25-5-2025_19823_localhost.jpeg" width="600"/>
<img src="Screenshots/Screenshot%202025-05-25%20190615.png" width="600"/>
