# ApplyDirect-SA

ApplyDirect-SA is a centralized full-stack web platform designed to aggregate application details, courses, and institutional requirements for South African tertiary institutions, simplifying the application process for students.

---

## Features

* **Institution Directory:** Browse a comprehensive list of South African universities and colleges.
* **Dynamic Search & Filtering:** Filter courses and institutions by category, region, or requirements.
* **Responsive Design:** Fully optimized using Bootstrap for seamless viewing across mobile, tablet, and desktop devices.
* **RESTful API Backend:** Powered by Node.js and Express to handle data transactions.
* **Relational Database Integration:** Uses MySQL to securely manage institutional records, user details, and application data.

---

## Tech Stack

### Frontend
* **Vue.js** (Single Page Application framework)
* **Bootstrap 5** (Responsive styling and layout components)
* **HTML5 / CSS3 / JavaScript (ES6+)**

### Backend
* **Node.js** (JavaScript runtime environment)
* **Express.js** (Web application framework)
* **MySQL** (Relational database management)

---

## Project Structure

```text
applydirect-sa/
├── backend/
│   ├── Database/          # MySQL schema and SQL scripts (e.g., sa_tertiary_db.sql)
│   ├── models/            # Database connection & models
│   ├── routes/            # API endpoints & controllers
│   └── server.js          # Entry point for Express server
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable Vue components
│   │   ├── views/         # Page views/screens
│   │   ├── App.vue        # Root component
│   │   └── main.js        # Vue entry point
└── README.md



#How to Start and Run the Project
To run this application locally, you will need Node.js and MySQL Workbench installed. Because this is a full-stack project, you need to run both the backend server and the frontend client simultaneously in two separate terminal windows.

Step 1: Set Up the Database
Open MySQL Workbench and connect to your local MySQL server.

Import the database schema and data file located at backend/Database/sa_tertiary_db.sql.

Verify your database connection settings match your backend configuration file.

Step 2: Start the Backend Server
Open your terminal (such as Git Bash or VS Code integrated terminal).

Navigate into the backend folder:

Bash
cd backend
Install backend dependencies (if you haven't already):

Bash
npm install
Start the server:

Bash
npm run dev
(The backend server should now be running, typically on http://localhost:3000).

Step 3: Start the Frontend Client
Open a second, separate terminal window.

Navigate into the frontend folder:

Bash
cd frontend
Install frontend dependencies (if you haven't already):

Bash
npm install
Launch the Vue development server:

Bash
npm run serve
Open the local URL provided in your terminal (usually http://localhost:8080) in your web browser to view the application.

Contributing
Switch to your feature branch (git checkout -b feature/YourFeature).

Commit your changes (git commit -m "Add some AmazingFeature").

Push to the branch (git push origin feature/YourFeature).

Open a Pull Request.

License
This project is developed as an educational initiative under Life Choices Academy.