# 🏥 Hospital Management System (HMS)

A full-stack Hospital Management System built with **Node.js**, **Express.js**, **MongoDB**, and **EJS**. This application allows hospitals to manage patients, doctors, appointments, and prescriptions efficiently.

## 📌 Features

- 👨‍⚕️ Manage Doctors (Add, View, Edit, Delete)
- 👩‍⚕️ Manage Patients (Add, View, Edit, Delete)
- 📅 Appointment Scheduling
- 💊 Prescription Management
- 🧾 EJS Templating for Dynamic Pages
- 🌐 RESTful API Architecture
- 🔒 Environment Variable Support via `config.env`
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
| dotenv     | Environment variable management |

## 📁 Folder Structure

```
hospital-management-system-nodejs/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── appointmentController.js
│   ├── doctorController.js
│   ├── patientController.js
│   └── prescriptionController.js
├── middleware/
├── models/
│   ├── Appointment.js
│   ├── Doctor.js
│   ├── Patient.js
│   └── Prescription.js
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── routes/
│   ├── appointmentRoutes.js
│   ├── doctorRoutes.js
│   ├── patientRoutes.js
│   ├── prescriptionRoutes.js
│   └── index.js
├── views/
│   ├── appointments/
│   ├── doctors/
│   ├── patients/
│   ├── prescriptions/
│   ├── partials/
│   ├── error.ejs
│   ├── index.ejs
│   └── layout.ejs
├── config.env                # Environment variables
├── app.js                    # Main application file
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hospital-management-system-nodejs.git
cd hospital-management-system-nodejs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `config.env` file in the root directory with the following variables:

```env
# MongoDB Connection String

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Configuration
SESSION_SECRET=your-session-secret-key-change-in-production

# Database Configuration
DB_MAX_POOL_SIZE=10
DB_MIN_POOL_SIZE=5
DB_SOCKET_TIMEOUT_MS=45000
DB_CONNECT_TIMEOUT_MS=30000
```

**Important**: Replace the MongoDB connection string with your actual MongoDB connection string.

### 4. Start the Application

For development (with auto-restart):
```bash
npm run dev
```

For production:
```bash
npm start
```

### 5. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 📋 API Endpoints

### Doctors
- `GET /doctors` - List all doctors
- `GET /doctors/add` - Show add doctor form
- `POST /doctors` - Create new doctor
- `GET /doctors/:id` - View doctor details
- `GET /doctors/:id/edit` - Show edit doctor form
- `PUT /doctors/:id` - Update doctor
- `DELETE /doctors/:id` - Delete doctor

### Patients
- `GET /patients` - List all patients
- `GET /patients/add` - Show add patient form
- `POST /patients` - Create new patient
- `GET /patients/:id` - View patient details
- `GET /patients/:id/edit` - Show edit patient form
- `PUT /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient

### Appointments
- `GET /appointments` - List all appointments
- `GET /appointments/add` - Show add appointment form
- `POST /appointments` - Create new appointment
- `GET /appointments/:id` - View appointment details
- `GET /appointments/:id/edit` - Show edit appointment form
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment

### Prescriptions
- `GET /prescriptions` - List all prescriptions
- `GET /prescriptions/add` - Show add prescription form
- `POST /prescriptions` - Create new prescription
- `GET /prescriptions/:id` - View prescription details
- `GET /prescriptions/:id/print` - Print prescription

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `SESSION_SECRET` | Session secret key | hospital-management-secret |
| `DB_MAX_POOL_SIZE` | Max database connection pool size | 10 |
| `DB_MIN_POOL_SIZE` | Min database connection pool size | 5 |
| `DB_SOCKET_TIMEOUT_MS` | Database socket timeout | 45000 |
| `DB_CONNECT_TIMEOUT_MS` | Database connection timeout | 30000 |

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive information like database credentials to version control
2. **Session Secret**: Use a strong, unique session secret in production
3. **Input Validation**: Implement proper input validation for all user inputs
4. **Authentication**: Consider adding user authentication for production use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.


