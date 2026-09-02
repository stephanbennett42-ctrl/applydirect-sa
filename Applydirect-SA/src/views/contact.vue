<template>
  <div class="page-shell">
    <header class="top-header">
      <div class="logo">ApplyDirect SA</div>

      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/universities">Universities</router-link>
        <router-link to="/portfolio">Profile</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/contact" class="active">Contact</router-link>
        <router-link to="/subscription">Subscription</router-link>
      </nav>

      <a class="login-btn" href="#">Login</a>
    </header>

    <section class="contact-hero">
      <h1>Contact Us</h1>
      <p>We’re here to help you take the next step in your application journey.</p>
    </section>

    <section class="contact-section">
      <div class="contact-card">
        <h2>Send us a message</h2>
        <p>Need help with your application profile or university choices?</p>

        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input id="fullName" type="text" placeholder="Enter your full name" />
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input id="email" type="email" placeholder="example@email.com" />
        </div>

        <div class="form-group">
          <label for="subject">Subject</label>
          <input id="subject" type="text" placeholder="How can we help?" />
        </div>

        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" rows="5" placeholder="Write your message here..."></textarea>
        </div>

        <button class="send-btn" type="button">Send Message</button>
      </div>

      <div class="contact-info">
        <h2>Contact Information</h2>
        <p>Our team is ready to support you with your study plans and applications.</p>

        <div class="info-item">
          <h3>Email</h3>
          <p>support@applydirectsa.co.za</p>
        </div>

        <div class="info-item">
          <h3>Phone</h3>
          <p>+27 21 123 4567</p>
        </div>

        <div class="info-item">
          <h3>Office Hours</h3>
          <p>Mon - Fri, 8:00 AM - 5:00 PM</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}


/* ================= HEADER ================= */

.top-header {
  height: 76px;
  background: white;
  border-top: 4px solid transparent;
  border-image: linear-gradient(
    to right,
    #0637A6 0%,
    #0637A6 35%,
    #F4C20D 35%,
    #F47B20 68%,
    #008A4C 100%
  ) 1;

  border-bottom: 1px solid #d9dce3;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 0 7%;
}


/* ================= LOGO ================= */

.logo {

  font-size: 30px;

  font-weight: 700;

  color: #0637A6;

}


/* ================= NAVIGATION ================= */

nav {

  display: flex;

  align-items: center;

  gap: 5px;

}


nav a {

  text-decoration: none;

  color: #222;

  font-size: 15px;

  font-weight: 500;

  padding: 12px 17px;

  border-radius: 6px;

  transition: 0.2s;

}


/* HOVER */

nav a:hover {

  color: #0637A6;

}


/* ACTIVE CONTACT BUTTON */

nav a.active {
  background: linear-gradient(135deg, #0f8f4d 0%, #0b7d42 100%);
  color: white;
  font-weight: 600;
}


/* ================= LOGIN ================= */

.login-btn {
  background: linear-gradient(135deg, #0f8f4d 0%, #0b7d42 100%);
  color: white;

  padding: 11px 20px;

  border-radius: 5px;

  text-decoration: none;

  font-size: 14px;

  font-weight: 600;

  transition: 0.2s;

}


.login-btn:hover {

  background: #052d88;

}


/* ================= HERO ================= */

.contact-hero {
  text-align: center;
  padding: 50px 20px 35px;
  background: #edf4ff;
}


.contact-hero h1 {

  color: #0637A6;

  font-size: 32px;

  margin: 0 0 10px;

}


.contact-hero p {

  color: #64748b;

  font-size: 15px;

  margin: 0;

}


/* ================= CONTACT SECTION ================= */

.contact-section {

  max-width: 1100px;

  margin: 40px auto;

  padding: 0 20px;

  display: grid;

  grid-template-columns: 1.5fr 1fr;

  gap: 30px;

}


/* ================= CARDS ================= */

.contact-card,
.contact-info {

  background: white;

  border: 1px solid #e0e3e8;

  border-left: 4px solid #F4C20D;

  border-radius: 7px;

  padding: 30px;

  box-shadow:
    0 3px 12px rgba(0, 0, 0, 0.04);

}


.contact-card h2,
.contact-info h2 {

  color: #0637A6;

  margin-top: 0;

  font-size: 21px;

}


.contact-card p,
.contact-info > p {

  color: #64748b;

  font-size: 14px;

}


/* ================= FORM ================= */

.form-group {

  display: flex;

  flex-direction: column;

  margin-bottom: 20px;

}


.form-group label {

  font-size: 13px;

  font-weight: 600;

  margin-bottom: 7px;

  color: #374151;

}


.form-group input,
.form-group select,
.form-group textarea {

  padding: 12px;

  border: 1px solid #d1d5db;

  border-radius: 5px;

  font-size: 14px;

  outline: none;

  background: white;

  color: #222;

}


.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {

  border-color: #0637A6;

  box-shadow:
    0 0 0 2px rgba(6, 55, 166, 0.08);

}


/* ================= SEND BUTTON ================= */

.send-btn {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #0f8f4d 0%, #0b7d42 100%);
  color: white;

  border: none;

  border-radius: 5px;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;

}


.send-btn:hover {

  background: #00723e;

}


/* ================= CONTACT INFORMATION ================= */

.info-item {

  padding: 18px 0;

  border-bottom: 1px solid #edf0f2;

}


.info-item:last-child {

  border-bottom: none;

}


.info-item h3 {

  font-size: 14px;

  color: #0637A6;

  margin-bottom: 5px;

}


.info-item p {

  font-size: 14px;

  color: #64748b;

  margin: 0;

}


/* ================= MOBILE ================= */

@media (max-width: 800px) {

  .top-header {

    padding: 0 20px;

  }


  nav {

    display: none;

  }


  .contact-section {

    grid-template-columns: 1fr;

  }

}

</style>