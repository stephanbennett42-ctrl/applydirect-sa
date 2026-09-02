<template>

   <header class="top-header">

    <div class="logo">
      ApplyDirect-SA
    </div>

    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/universities">Universities</router-link>
      <router-link to="/portfolio">My Profile</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contact" class="active">Contact</router-link>
    </nav>

    <router-link to="/login" class="login-btn">
      Login
    </router-link>

  </header>

  <section class="contact-hero">

  <h1>Contact Us</h1>

  <p>
    Have a question or need help with your tertiary application?
    Our team is here to assist you.
  </p>

</section>

<section class="contact-section">

  <div class="contact-card">

    <h2>Send Us a Message</h2>

    <p>
      Complete the form below and our support team will get back to you.
    </p>

    <form @submit.prevent="sendMessage">

      <div class="form-group">

        <label>Full Name</label>

        <input
          type="text"
          v-model="form.name"
          placeholder="Enter your full name"
          required
        >

      </div>


      <div class="form-group">

        <label>Email Address</label>

        <input
          type="email"
          v-model="form.email"
          placeholder="Enter your email"
          required
        >

      </div>


      <div class="form-group">

        <label>How can we help you?</label>

        <select v-model="form.subject" required>

          <option value="">
            Select an option
          </option>

          <option>
            Application Assistance
          </option>

          <option>
            University Information
          </option>

          <option>
            Document Upload Problem
          </option>

          <option>
            Payment Problem
          </option>

          <option>
            Account Problem
          </option>

          <option>
            Technical Support
          </option>

          <option>
            Other
          </option>

        </select>

      </div>


      <div class="form-group">

        <label>Message</label>

        <textarea
          v-model="form.message"
          rows="6"
          placeholder="Type your message here..."
          required
        ></textarea>

      </div>


      <button type="submit" class="send-btn">
        Send Message
      </button>

    </form>

  </div>

</section>

</template>


<script>

export default {

  name: "Contact",

  data() {

    return {

      form: {

        name: "",
        email: "",
        subject: "",
        message: ""

      }

    }

  },


  methods: {

    sendMessage() {

      console.log("Contact form submitted:", this.form)

      alert("Thank you! Your message has been sent.")

      this.form = {

        name: "",
        email: "",
        subject: "",
        message: ""

      }

    }

  }

}

</script>

<style scoped>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}


/* HEADER */

.top-header {

  height: 72px;

  background: white;

  border-bottom: 1px solid #e5e7eb;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 0 50px;

}


.logo {

  font-size: 24px;

  font-weight: bold;

  color: #123b63;

}


nav {

  display: flex;

  gap: 25px;

}


nav a {

  text-decoration: none;

  color: #555;

  font-size: 14px;

}


nav a:hover,
nav a.active {

  color: #123b63;

  font-weight: bold;

}


.login-btn {

  background: #123b63;

  color: white;

  padding: 10px 20px;

  border-radius: 5px;

  text-decoration: none;

}


/* HERO */

.contact-hero {

  text-align: center;

  padding: 50px 20px 35px;

  background: #f5f7fa;

}


.contact-hero h1 {

  color: #123b63;

  font-size: 32px;

  margin-bottom: 10px;

}


.contact-hero p {

  color: #64748b;

  font-size: 15px;

}


/* CONTACT SECTION */

.contact-section {

  max-width: 1100px;

  margin: 40px auto;

  padding: 0 20px;

  display: grid;

  grid-template-columns: 1.5fr 1fr;

  gap: 30px;

}


/* CARD */

.contact-card,
.contact-info {

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 8px;

  padding: 30px;

}


.contact-card h2,
.contact-info h2 {

  color: #123b63;

  margin-top: 0;

}


.contact-card p,
.contact-info > p {

  color: #64748b;

  font-size: 14px;

}


/* FORM */

.form-group {

  display: flex;

  flex-direction: column;

  margin-bottom: 20px;

}


.form-group label {

  font-size: 13px;

  font-weight: bold;

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

}


.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {

  border-color: #123b63;

}


/* BUTTON */

.send-btn {

  width: 100%;

  padding: 13px;

  background: #123b63;

  color: white;

  border: none;

  border-radius: 5px;

  font-size: 14px;

  font-weight: bold;

  cursor: pointer;

}


.send-btn:hover {

  background: #0d2d4b;

}


/* CONTACT INFORMATION */

.info-item {

  padding: 18px 0;

  border-bottom: 1px solid #edf0f2;

}


.info-item:last-child {

  border-bottom: none;

}


.info-item h3 {

  font-size: 14px;

  color: #123b63;

  margin-bottom: 5px;

}


.info-item p {

  font-size: 14px;

  color: #64748b;

  margin: 0;

}


/* MOBILE */

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