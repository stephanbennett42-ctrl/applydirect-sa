<template>
  <div class="page-shell">

    <!-- ================= HEADER ================= -->
    <header class="top-header">

      <nav class="navbar">

        <!-- Mobile-only control for opening and closing the navigation links. -->
        <button
          class="navbar-toggler"
          type="button"
          aria-controls="navbarContent"
          :aria-expanded="isNavbarOpen"
          aria-label="Toggle navigation"
          @click="isNavbarOpen = !isNavbarOpen"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- The logo, navigation links, and logged-in user stay in one row on desktop. -->
        <div
          id="navbarContent"
          class="navbar-collapse"
          :class="{ 'is-open': isNavbarOpen }"
        >
          <div class="navbar-nav">

            <router-link to="/" class="navbar-brand logo-nav-item">
              ApplyDirect-<span>SA</span>
            </router-link>

            <router-link to="/" class="sa-nav-tab tab-green text-center">Universities</router-link>
            <router-link to="/portfolio" class="sa-nav-tab tab-gold text-center">Profile</router-link>
            <router-link to="/about" class="sa-nav-tab tab-red text-center">About Us</router-link>
            <router-link to="/contact" class="sa-nav-tab tab-blue text-center">Contact</router-link>
            <router-link to="/subscription" class="sa-nav-tab tab-black text-center">Subscription</router-link>

            <!-- The badge uses the initials of the logged-in user's name. -->
            <div class="profile-account">
              <span>{{ profileDisplayName }}</span>
              <div class="profile-icon" :title="profileInitials">
                {{ profileInitials }}
              </div>
            </div>

          </div>
        </div>

      </nav>

    </header>


    <!-- ================= HERO ================= -->
    <section class="contact-hero">

      <div class="hero-decoration hero-decoration-one"></div>
      <div class="hero-decoration hero-decoration-two"></div>

      <div class="hero-content">

        <div class="hero-tag">
          <span>✦</span>
          WE'RE HERE TO HELP
        </div>

        <h1>
          Let's Talk<span> 👋</span>
        </h1>

        <p>
          Have a question about your application, university choices,
          or profile? Our team is here to help you every step of the way.
        </p>

      </div>

    </section>


    <!-- ================= CONTACT SECTION ================= -->
    <section class="contact-section">

      <!-- ================= CONTACT INFO ================= -->
      <div class="contact-info">

        <div class="section-label">
          GET IN TOUCH
        </div>

        <h2>
          We're here for<br />
          <span>you.</span>
        </h2>

        <p class="info-intro">
          Starting your university journey can feel overwhelming.
          If you have questions, we're only a message away.
        </p>


        <!-- EMAIL -->
        <div class="info-item">

          <div class="info-icon email-icon">
            ✉
          </div>

          <div>
            <h3>Email Us</h3>
            <p>applydirectsa@gmail.com</p>
          </div>

        </div>


        <!-- HOURS -->
        <div class="info-item">

          <div class="info-icon hours-icon">
            ◷
          </div>

          <div>
            <h3>Office Hours</h3>
            <p>Monday - Friday</p>
            <span>8:00 AM - 5:00 PM</span>
          </div>

        </div>


        <!-- SOUTH AFRICAN ACCENT -->
        <div class="sa-accent">

          <div class="accent-blue"></div>
          <div class="accent-red"></div>
          <div class="accent-yellow"></div>
          <div class="accent-green"></div>

        </div>

      </div>


      <!-- ================= CONTACT FORM ================= -->
      <div class="contact-card">

        <div class="form-heading">

          <div>
            <div class="section-label">
              SEND A MESSAGE
            </div>

            <h2>
              How can we help?
            </h2>
          </div>

          <div class="message-icon">
            💬
          </div>

        </div>

        <p class="form-intro">
          Fill in the form below and our team will get back to you.
        </p>


        <!-- FULL NAME -->
        <div class="form-group">

          <label for="fullName">
            Full Name
          </label>

          <input
            id="fullName"
            type="text"
            v-model="form.full_name"
            placeholder="Enter your full name"
          />

        </div>


        <!-- EMAIL -->
        <div class="form-group">

          <label for="email">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            v-model="form.email"
            placeholder="example@email.com"
          />

        </div>


        <!-- SUBJECT -->
        <div class="form-group">

          <label for="subject">
            Subject
          </label>

          <input
            id="subject"
            type="text"
            v-model="form.subject"
            placeholder="What would you like help with?"
          />

        </div>


        <!-- MESSAGE -->
        <div class="form-group">

          <div class="message-label">

            <label for="message">
              Message
            </label>

            <span>
              {{ form.message.length }}/500
            </span>

          </div>

          <textarea
            id="message"
            rows="6"
            maxlength="500"
            v-model="form.message"
            placeholder="Tell us how we can help..."
          ></textarea>

        </div>


        <!-- SEND -->
        <button
          class="send-btn"
          type="button"
          @click="sendMessage"
          :disabled="sending"
        >

          <span v-if="!sending">
            Send Message
          </span>

          <span v-else>
            Sending...
          </span>

          <span class="button-arrow">
            →
          </span>

        </button>


        <!-- SUCCESS -->
        <div
          v-if="successMessage"
          class="success-message"
        >
          <span class="message-status-icon">✓</span>

          <div>
            <strong>Message sent!</strong>
            <p>{{ successMessage }}</p>
          </div>
        </div>


        <!-- ERROR -->
        <div
          v-if="errorMessage"
          class="error-message"
        >
          <span class="message-status-icon">!</span>

          <div>
            <strong>Something went wrong</strong>
            <p>{{ errorMessage }}</p>
          </div>
        </div>

      </div>

    </section>


    <!-- ================= FOOTER NOTE ================= -->
    <section class="bottom-note">

      <div class="bottom-line"></div>

      <p>
        Helping South African students take the next step toward their future.
      </p>

      <div class="bottom-line"></div>

    </section>

  </div>
</template>


<script>
export default {
  name: 'ContactView',

  data() {
    return {
      sending: false,

      isNavbarOpen: false,

      successMessage: '',
      errorMessage: '',

      profile: {
        firstName: '',
        surname: ''
      },

      form: {
        student_id: 1,
        full_name: '',
        email: '',
        subject: '',
        message: ''
      }
    };
  },

  computed: {

    // Use the first name in the account label and provide a fallback before data loads.
    profileDisplayName() {
      return this.profile.firstName.trim() || 'My Profile';
    },

    // Owam uses OG by default; other users receive their first and surname initials.
    profileInitials() {
      const firstName = this.profile.firstName.trim();
      const surname = this.profile.surname.trim();

      if (firstName.toLowerCase() === 'owam') {
        return `O${surname.charAt(0) || 'G'}`.toUpperCase();
      }

      if (!firstName && !surname) {
        return '--';
      }

      return `${firstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();
    }
  },

  methods: {

    async sendMessage() {

      this.successMessage = '';
      this.errorMessage = '';

      // Check that all fields are completed
      if (
        !this.form.full_name ||
        !this.form.email ||
        !this.form.subject ||
        !this.form.message
      ) {
        this.errorMessage = 'Please complete all fields.';
        return;
      }

      this.sending = true;

      try {

        console.log('Sending contact form:', this.form);
        const response = await fetch("/api/contact", {
          method: "POST",

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(this.form)
        });


        // Get response as text first
        const responseText = await response.text();

        console.log('Server status:', response.status);
        console.log('Server response:', responseText);

        let data = {};


        // Parse JSON if response contains data
        if (responseText) {

          try {

            data = JSON.parse(responseText);

          } catch (error) {

            console.error(
              'Invalid JSON from server:',
              error
            );

            throw new Error(
              `Server returned an invalid response. Status: ${response.status}`
            );

          }

        }


        // Handle server errors
        if (!response.ok) {

          throw new Error(
            data.message ||
            `Failed to send message. Status: ${response.status}`
          );

        }


        // Success
        this.successMessage =
          data.message ||
          'Your message has been sent successfully.';


        // Clear form
        this.form.full_name = '';
        this.form.email = '';
        this.form.subject = '';
        this.form.message = '';

      } catch (error) {

        console.error(
          'Contact form error:',
          error
        );

        this.errorMessage =
          error.message ||
          'Something went wrong. Please try again.';

      } finally {

        this.sending = false;

      }

    }

  }

};
</script>


<style scoped>

/* ===============================
   GLOBAL
================================ */

* {
  box-sizing: border-box;
}

.page-shell {
  --navy-dark: #001242;
  --green: #007a3d;
  --green-dark: #005c2d;
  --gold: #ffb81c;
  --red: #de3831;
  --blue: #002395;
  min-height: 100vh;
  background: #f6f8fc;
  color: #111827;
  font-family: Arial, Helvetica, sans-serif;
}


/* ===============================
   HEADER
================================ */

.top-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--navy-dark);
  box-shadow: 0 6px 24px rgba(0, 18, 66, 0.22);
}

.navbar {
  min-height: 74px;
  display: flex;
  align-items: center;
  padding: 10px 24px;
}

.navbar-toggler {
  display: none;
  margin-left: auto;
  padding: 8px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.navbar-toggler-icon,
.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
}

.navbar-toggler-icon {
  position: relative;
}

.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
  content: "";
  position: absolute;
  left: 0;
}

.navbar-toggler-icon::before { top: -7px; }
.navbar-toggler-icon::after { top: 7px; }

/* Keep the full navigation visible on desktop. The mobile media query below
  switches this panel to a toggle-controlled menu. */
.navbar-collapse {
  width: 100%;
}

.navbar-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
}

.navbar-brand {
  margin-right: auto;
  color: #fff;
  text-decoration: none;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.navbar-brand span { color: var(--gold); }

.profile-account {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-left: 8px;
  padding-left: 14px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}

.profile-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gold);
  color: #14223b;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 4px 12px rgba(255, 184, 28, 0.35);
}

.sa-nav-tab {
  display: inline-block;
  padding: 9px 18px;
  border-radius: 999px;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.sa-nav-tab:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.11);
  transform: translateY(-1px);
}

.sa-nav-tab.tab-green.router-link-exact-active { background: var(--green); box-shadow: 0 5px 16px rgba(0, 122, 61, 0.4); }
.sa-nav-tab.tab-gold.router-link-exact-active { background: var(--gold); color: #101010; box-shadow: 0 5px 16px rgba(255, 184, 28, 0.4); }
.sa-nav-tab.tab-red.router-link-exact-active { background: var(--red); box-shadow: 0 5px 16px rgba(222, 56, 49, 0.4); }
.sa-nav-tab.tab-blue.router-link-exact-active { background: var(--blue); box-shadow: 0 5px 16px rgba(0, 35, 149, 0.4); }
.sa-nav-tab.tab-black.router-link-exact-active { background: #191919; box-shadow: 0 5px 16px rgba(0, 0, 0, 0.4); }


/* ===============================
   HERO
================================ */

.contact-hero {

  position: relative;

  overflow: hidden;

  background:
    linear-gradient(
      135deg,
      #001B5E 0%,
      #0637A6 55%,
      #002f72 100%
    );

  min-height: 310px;

  display: flex;

  align-items: center;

  justify-content: center;

  text-align: center;

  padding: 55px 20px;

}


/* Decorative circles */

.hero-decoration {

  position: absolute;

  border-radius: 50%;

  opacity: 0.12;

  pointer-events: none;

}


.hero-decoration-one {

  width: 300px;
  height: 300px;

  background: #F4C20D;

  left: -100px;
  top: -130px;

}


.hero-decoration-two {

  width: 230px;
  height: 230px;

  background: #DE3831;

  right: -70px;
  bottom: -100px;

}


.hero-content {

  position: relative;

  z-index: 2;

  max-width: 720px;

}


/* ===============================
   HERO TAG
================================ */

.hero-tag {

  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 8px 15px;

  border-radius: 50px;

  background: rgba(244, 194, 13, 0.14);

  border: 1px solid rgba(244, 194, 13, 0.4);

  color: #F4C20D;

  font-size: 12px;

  font-weight: 800;

  letter-spacing: 1.5px;

  margin-bottom: 17px;

}


.hero-tag span {

  font-size: 15px;

}


/* ===============================
   HERO TITLE
================================ */

.contact-hero h1 {

  margin: 0;

  color: white;

  font-size: clamp(40px, 6vw, 62px);

  font-weight: 800;

  letter-spacing: -2px;

}


.contact-hero h1 span {

  color: #F4C20D;

}


.contact-hero p {

  max-width: 610px;

  margin: 17px auto 0;

  color: #dbe7ff;

  font-size: 16px;

  line-height: 1.7;

}


/* ===============================
   CONTACT SECTION
================================ */

.contact-section {

  max-width: 1120px;

  margin: -35px auto 0;

  padding: 0 22px 50px;

  display: grid;

  grid-template-columns: 0.85fr 1.25fr;

  gap: 28px;

  position: relative;

  z-index: 5;

}


/* ===============================
   CONTACT INFO
================================ */

.contact-info {

  background: #001B5E;

  color: white;

  border-radius: 18px;

  padding: 34px;

  box-shadow:
    0 16px 40px rgba(0, 27, 94, 0.18);

  position: relative;

  overflow: hidden;

}


.contact-info::after {

  content: "";

  position: absolute;

  width: 160px;
  height: 160px;

  border-radius: 50%;

  right: -80px;
  bottom: -70px;

  background: #008A4C;

  opacity: 0.2;

}


/* ===============================
   SECTION LABEL
================================ */

.section-label {

  color: #F4C20D;

  font-size: 11px;

  font-weight: 800;

  letter-spacing: 1.7px;

  margin-bottom: 10px;

}


.contact-info h2 {

  margin: 0;

  font-size: 32px;

  line-height: 1.12;

  letter-spacing: -1px;

}


.contact-info h2 span {

  color: #F4C20D;

}


.info-intro {

  color: #c7d5f2;

  font-size: 14px;

  line-height: 1.7;

  margin: 18px 0 28px;

}


/* ===============================
   INFO ITEMS
================================ */

.info-item {

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 17px 0;

  border-top: 1px solid rgba(255,255,255,0.12);

}


.info-icon {

  width: 45px;
  height: 45px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  font-size: 20px;

  color: white;

}


.email-icon {

  background: #008A4C;

}


.phone-icon {

  background: #DE3831;

}


.hours-icon {

  background: #F4C20D;

  color: #001B5E;

}


.info-item h3 {

  margin: 0 0 5px;

  font-size: 14px;

  color: white;

}


.info-item p {

  margin: 0;

  font-size: 13px;

  color: #d7e2f7;

}


.info-item span {

  display: block;

  margin-top: 3px;

  font-size: 12px;

  color: #9fb3d9;

}


/* ===============================
   SA ACCENT
================================ */

.sa-accent {

  display: flex;

  height: 5px;

  width: 100%;

  margin-top: 27px;

  border-radius: 20px;

  overflow: hidden;

}


.sa-accent div {

  flex: 1;

}


.accent-blue {
  background: #0637A6;
}

.accent-red {
  background: #DE3831;
}

.accent-yellow {
  background: #F4C20D;
}

.accent-green {
  background: #008A4C;
}


/* ===============================
   FORM CARD
================================ */

.contact-card {

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 18px;

  padding: 35px;

  box-shadow:
    0 12px 35px rgba(15, 23, 42, 0.08);

}


/* ===============================
   FORM HEADING
================================ */

.form-heading {

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

}


.contact-card h2 {

  margin: 0;

  font-size: 30px;

  color: #001B5E;

  letter-spacing: -1px;

}


.form-intro {

  margin: 8px 0 27px;

  color: #64748b;

  font-size: 14px;

}


.message-icon {

  width: 52px;
  height: 52px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #fff7d6;

  border-radius: 14px;

  font-size: 23px;

}


/* ===============================
   FORM
================================ */

.form-group {

  margin-bottom: 18px;

}


.form-group label {

  display: block;

  margin-bottom: 7px;

  font-size: 13px;

  font-weight: 700;

  color: #263246;

}


.form-group input,
.form-group textarea {

  width: 100%;

  padding: 13px 14px;

  border: 1.5px solid #dbe1ea;

  border-radius: 10px;

  outline: none;

  background: #fafbfd;

  color: #111827;

  font-family: inherit;

  font-size: 14px;

  transition:
    border 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

}


.form-group textarea {

  resize: vertical;

  min-height: 135px;

}


.form-group input::placeholder,
.form-group textarea::placeholder {

  color: #9aa4b2;

}


.form-group input:focus,
.form-group textarea:focus {

  background: white;

  border-color: #0637A6;

  box-shadow:
    0 0 0 4px rgba(6, 55, 166, 0.08);

}


/* ===============================
   MESSAGE LABEL
================================ */

.message-label {

  display: flex;

  justify-content: space-between;

  align-items: center;

}


.message-label label {

  margin-bottom: 7px;

}


.message-label span {

  font-size: 11px;

  color: #94a3b8;

}


/* ===============================
   SEND BUTTON
================================ */

.send-btn {

  width: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  padding: 14px 18px;

  border: none;

  border-radius: 10px;

  background: #008A4C;

  color: white;

  font-size: 14px;

  font-weight: 800;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;

}


.send-btn:hover:not(:disabled) {

  background: #006f3e;

  transform: translateY(-2px);

  box-shadow:
    0 8px 20px rgba(0, 138, 76, 0.22);

}


.send-btn:disabled {

  opacity: 0.65;

  cursor: not-allowed;

}


.button-arrow {

  font-size: 18px;

  transition: transform 0.2s ease;

}


.send-btn:hover .button-arrow {

  transform: translateX(4px);

}


/* ===============================
   SUCCESS / ERROR
================================ */

.success-message,
.error-message {

  margin-top: 17px;

  padding: 13px 15px;

  display: flex;

  align-items: flex-start;

  gap: 11px;

  border-radius: 10px;

  font-size: 13px;

}


.success-message {

  background: #ecfdf5;

  border: 1px solid #bbf7d0;

  color: #166534;

}


.error-message {

  background: #fef2f2;

  border: 1px solid #fecaca;

  color: #991b1b;

}


.message-status-icon {

  width: 24px;
  height: 24px;

  flex-shrink: 0;

  border-radius: 50%;

  display: flex;

  align-items: center;
  justify-content: center;

  font-weight: 800;

}


.success-message .message-status-icon {

  background: #008A4C;

  color: white;

}


.error-message .message-status-icon {

  background: #DE3831;

  color: white;

}


.success-message strong,
.error-message strong {

  display: block;

  margin-bottom: 2px;

}


.success-message p,
.error-message p {

  margin: 0;

  line-height: 1.5;

}


/* ===============================
   BOTTOM NOTE
================================ */

.bottom-note {

  max-width: 1120px;

  margin: 0 auto;

  padding: 0 22px 35px;

  display: flex;

  align-items: center;

  gap: 15px;

}


.bottom-note p {

  margin: 0;

  text-align: center;

  white-space: nowrap;

  color: #64748b;

  font-size: 12px;

}


.bottom-line {

  height: 1px;

  flex: 1;

  background: #dfe4eb;

}


/* ===============================
   MOBILE
================================ */

@media (max-width: 900px) {

  /* Stack the shared navbar items on smaller screens. */
  .top-header {

    padding: 0 25px;

  }

  nav {

    display: none;

  }

  .contact-section {

    grid-template-columns: 1fr;

    margin-top: 25px;

  }

  .contact-info {

    order: 2;

  }

  .contact-card {

    order: 1;

  }

}


@media (max-width: 600px) {

  .top-header {

    height: 70px;

    padding: 0 18px;

  }

  .logo {

    font-size: 23px;

  }

  .login-btn {

    padding: 9px 15px;

    font-size: 12px;

  }

  .contact-hero {

    min-height: 280px;

    padding: 45px 20px;

  }

  .contact-hero h1 {

    font-size: 42px;

  }

  .contact-hero p {

    font-size: 14px;

  }

  .contact-section {

    padding: 0 15px 40px;

  }

  .contact-info,
  .contact-card {

    padding: 25px 21px;

    border-radius: 15px;

  }

  .contact-info h2,
  .contact-card h2 {

    font-size: 26px;

  }

  .bottom-note {

    padding: 0 15px 25px;

  }

  .bottom-note p {

    white-space: normal;

  }

  .bottom-line {

    display: none;

  }

}

</style>
