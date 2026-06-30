<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/your-username/ucp-website">
    <img src="https://media.discordapp.net/attachments/1508493991392313406/1521103220578058390/logo.png?ex=6a444604&is=6a42f484&hm=17dca858061f59bd03864e8cdf92c3fd7d62bea4dfe619c436e568d70ff62802&=&format=webp&quality=lossless&width=575&height=575" alt="Logo" width="120" height="120">
  </a>

  <h1 align="center">UCP Website</h1>

  <p align="center">
    A modern, fully responsive <strong>User Control Panel</strong> for your game server or community.
    <br />
    Built with React, Express, Tailwind CSS & Bootstrap Icons.
    <br />
    <a href="https://github.com/your-username/ucp-website"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#preview">View Demo</a>
    ·
    <a href="https://github.com/your-username/ucp-website/issues">Report Bug</a>
    ·
    <a href="https://github.com/your-username/ucp-website/issues">Request Feature</a>
  </p>
</div>

<!-- BADGES -->
<div align="center">

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Bootstrap Icons](https://img.shields.io/badge/Bootstrap_Icons-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
  ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

</div>

---

## About The Project

The **UCP Website** is a full‑stack web application designed to give your players complete control over their in‑game experience.  
From managing characters and vehicles to tracking donations and referrals, everything is presented in a clean, modern interface enhanced by **Tailwind CSS** and enriched with over **2,000 Bootstrap Icons**.

> **Why this UCP?**  
> Because a traditional control panel should not look boring. We combined the power of React for seamless interactivity, Express for robust API, and a design system that adapts to any device.

---

## Features

| Feature | Description |
|--------|-------------|
| **Landing Page** | Eye‑catching introduction to your server with call‑to‑action buttons. |
| **Register & Login** | Secure authentication with JWT, hashed passwords, and role‑based access. |
| **Player Dashboard** | Personal statistics, quick access to all owned assets, and recent activities. |
| **Admin Dashboard** | Global overview, user management, and moderation tools with live charts. |
| **Character System** | Create, edit, and delete characters; assign them to different game worlds. |
| **Vehicle System** | Manage vehicles tied to each character with full CRUD operations. |
| **House System** | Own and customize houses; set spawn points and interior upgrades. |
| **Referral System** | Unique referral codes, invite tracking, and rewards for successful referrals. |
| **Donate System** | Browse donation packages, complete payments, and view transaction history. |
| **Settings** | Update profile, change password, and customize UI preferences. |
| **Live Charts** | Dynamic data visualization on both player and admin dashboards using **Chart.js**. |

---

## Preview

*Replace these placeholders with actual screenshots of your project.*

<div align="center">
  <img src="https://media.discordapp.net/attachments/1508493966511964431/1518918610066604092/Screenshot_73.png?ex=6a443c70&is=6a42eaf0&hm=1275dc4914fdea0fc68b1603f25e0259e72595b2929784ae4753ee27f53be18e&=&format=webp&quality=lossless&width=837&height=471" alt="Landing" width="30%" style="margin:5px;"/>
  <img src="https://media.discordapp.net/attachments/1508493966511964431/1518918610544758855/Screenshot_74.png?ex=6a443c70&is=6a42eaf0&hm=556b57cc3a8715274f29bbad81bb4dde398d5b700110c8784a87c645540837e0&=&format=webp&quality=lossless&width=837&height=471" alt="Player Dashboard" width="30%" style="margin:5px;"/>
  <img src="https://media.discordapp.net/attachments/1508493966511964431/1518918611622695013/Screenshot_76.png?ex=6a443c71&is=6a42eaf1&hm=c39e8c1a9b729d2f32be0ee9fa2a0772486d399d08bc0d78899f1974a2bfe77c&=&format=webp&quality=lossless&width=837&height=471" alt="Gallery Roleplay" width="30%" style="margin:5px;"/>
  <img src="https://media.discordapp.net/attachments/1508493966511964431/1518918612264554517/Screenshot_77.png?ex=6a443c71&is=6a42eaf1&hm=60a5d3181c5ba5e00a74253a7fd47d32be5b622e3c9cf3227af6c50d861524e1&=&format=webp&quality=lossless&width=837&height=471" alt="Discord Widght" width="30%" style="margin:5px;"/>
</div>

---

## Tech Stack

### Frontend
- **[React](https://reactjs.org/)** – Component‑based UI library.
- **[Tailwind CSS](https://tailwindcss.com/)** – Utility‑first CSS framework for rapid styling.
- **[Bootstrap Icons](https://icons.getbootstrap.com/)** – High‑quality, open‑source icon library.
- **[Chart.js](https://www.chartjs.org/)** – Flexible JavaScript charting (via `react-chartjs-2`).
- **[Axios](https://axios-http.com/)** – Promise‑based HTTP client.
- **[React Router DOM](https://reactrouter.com/)** – Declarative routing.

### Backend
- **[Node.js](https://nodejs.org/)** – JavaScript runtime.
- **[Express](https://expressjs.com/)** – Minimalist web framework.
- **[MongoDB](https://www.mongodb.com/)** + **[Mongoose](https://mongoosejs.com/)** – NoSQL database and ODM.
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** – Token‑based authentication.
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** – Password hashing.
- **[cors](https://github.com/expressjs/cors)**, **[dotenv](https://github.com/motdotla/dotenv)** – Security & environment variables.

---

## Bootstrap Icons in Action

We’ve carefully selected icons to create a consistent and intuitive experience. Here’s where you’ll find them:

| Section | Icons (class: `bi bi-...`) |
|---------|----------------------------|
| **Navigation** | `house-door`, `person-circle`, `shield-lock`, `box-arrow-right` |
| **Player Dashboard** | `speedometer2`, `people-fill`, `car-front-fill`, `house-door-fill`, `cash-stack` |
| **Character System** | `person-badge`, `plus-circle`, `pencil-square`, `trash3` |
| **Vehicles** | `truck`, `car-front`, `wrench` |
| **Houses** | `building`, `house-check`, `geo-alt` |
| **Referral** | `link-45deg`, `people`, `gift` |
| **Donate** | `wallet2`, `credit-card-2-front`, `check-circle` |
| **Settings** | `gear`, `shield-shaded`, `key`, `palette` |
| **Admin Panel** | `graph-up-arrow`, `table`, `person-gear`, `exclamation-triangle-fill` |

> All icons are rendered using the official **Bootstrap Icons** font, which means no additional image requests — fast and crisp on every screen.

---


---

## Quick Start

Follow these steps to get a local copy up and running in minutes.

### Prerequisites
- **Node.js** v16+ and npm/yarn installed
- A **MYsQL** database

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ucp-website.git
cd ucp-website
