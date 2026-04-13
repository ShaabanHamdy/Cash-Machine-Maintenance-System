# Cash Machine Maintenance System 🛠️💰

A specialized Full-Stack MERN application designed to automate the maintenance lifecycle and financial tracking for cash-counting machines distributed across regional post offices.

## 🚀 The Problem This Project Solves
In a large-scale operation like national post offices, tracking maintenance for thousands of machines manually via Excel is prone to errors. This system:
- Automates maintenance cycle tracking (every 2 months).
- Eliminates manual data entry errors for machine serial numbers.
- Calculates accurate technician commissions (0.25% per invoice).
- Generates ready-to-use financial reports for accounting departments.

## 🛠️ Tech Stack
- **Frontend:** Next.js, Tailwind CSS (Planned)
- **Backend:** Node.js, Express.js (ES6 Modules)
- **Database:** MongoDB (Mongoose ODM)
- **State Management:** React Context API / Redux (Planned)

## ✨ Key Features (Roadmap)
- [ ] **Asset Management:** Track every machine by Serial Number, Branch, and Region.
- [ ] **Smart Maintenance Logic:** Automatic alerts for machines that haven't been visited within the 2-month cycle.
- [ ] **Financial Engine:** Automated calculation of invoices (EGP 1,066.66 per visit) including VAT.
- [ ] **Commission Tracker:** Real-time calculation of collector commissions after bank deductions.
- [ ] **Reporting:** Exporting maintenance data to Excel/PDF for official billing.

## 📁 Project Structure (Backend)
```text
├── models/           # Mongoose schemas (Machine, Visit)
├── routes/           # API Endpoints
├── controllers/      # Business logic
├── .env              # Environment variables
└── server.js         # Entry point
