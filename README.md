# 🏥 Hospital Management System (HMS)

A full-stack Hospital Management System built with **Node.js**, **Express.js**, **MongoDB**, and **EJS**. This application allows hospitals to manage patients, doctors, appointments, and prescriptions efficiently.

## 📌 Features

- 👨‍⚕️ Manage Doctors (Add, View, Edit, Delete)
- 👩‍⚕️ Manage Patients (Add, View, Edit, Delete)
- 📅 Appointment Scheduling
- 💊 Prescription Management
- 🧾 EJS Templating for Dynamic Pages
- 🌐 RESTful API Architecture
- 🔒 Environment Variable Support via `.env`
- 🗂️ MVC Project Structure

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| Node.js    | Server-side JavaScript runtime |
| Express.js | Backend framework |
| MongoDB    | NoSQL database |
| Mongoose   | ODM for MongoDB |
| EJS        | Templating engine |
| CSS/JS     | Frontend styling and interactivity |
| Multer     | File/image upload support (if added) |

## 📁 Folder Structure

.
├── config/
│ └── db.js
├── controllers/
│ ├── appointmentController.js
│ ├── doctorController.js
│ ├── patientController.js
│ └── prescriptionController.js
├── middleware/
│ └── (Upload/auth middleware if needed)
├── models/
│ ├── Appointment.js
│ ├── Doctor.js
│ ├── Patient.js
│ └── Prescription.js
├── public/
│ ├── css/
│ │ └── style.css
│ └── js/
│ └── script.js
├── routes/
│ └── (All express routes)
├── views/
│ ├── patients/
│ ├── prescriptions/
│ ├── error.ejs
│ ├── index.ejs
│ ├── layout.ejs
│ └── ...
├── .env
├── app.js
├── package.json
└── README.md


## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hospital-management-system-nodejs.git
cd hospital-management-system-nodejs


