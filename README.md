# 🧾 Invoicing ROI Simulator

A full-stack web application that helps businesses **visualize cost savings, ROI, and payback period** when switching from manual to automated invoicing.

Built with:
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** MongoDB
---

## 🎯 Purpose

This project enables companies to quickly estimate the **ROI (Return on Investment)** when automating their invoicing process.  
Users can input their business parameters and instantly see results showing how automation saves time, money, and resources.

---

## 🧩 Features

✅ Real-time ROI Simulation  
✅ CRUD Operations for Scenarios (Save / Load / Delete)  
✅ Gated Report Generation (requires email before download)  
✅ MongoDB-backed Data Persistence  
✅ Bias Factor to ensure positive ROI  
✅ Responsive React UI

---
## Folder Structure 
invoicing-roi-sim/
│
├── backend/
│   ├── server.js
│   ├── config/db.js
│   ├── models/
│   │   ├── Scenario.js
│   │   └── Lead.js
│   ├── routes/
│   │   ├── simulation.js
│   │   ├── scenarios.js
│   │   └── report.js
│   └── utils/calculations.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   ├── styles.css
│   │   └── assets/
│   ├── index.html
│   └── vite.config.js
│
└── README.md

