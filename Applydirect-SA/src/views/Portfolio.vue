<template>
  <div class="profile-page">

    <!-- ================= HEADER ================= -->
    <header class="top-header">

      <div class="logo">
        ApplyDirect SA
      </div>

      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/universities">Universities</router-link>
        <router-link to="/portfolio" class="active">Profile</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/contact">Contact</router-link>
        <router-link to="/subscription">Subscription</router-link>
      </nav>

      <div class="header-right">
        <span>My Profile</span>
        <div class="profile-icon" :title="profileInitials">
          {{ profileInitials }}
        </div>
      </div>

    </header>


    <!-- ================= PAGE LAYOUT ================= -->

    <div class="page-layout">

      <!-- SIDEBAR -->
      <aside class="sidebar">

        <div class="sidebar-title">
          My Application
        </div>

        <button
          class="sidebar-item"
          :class="{ active: activeSection === 'personal' }"
          type="button"
          @click="activeSection = 'personal'"
        >
          <span class="number">1</span>
          Personal Details
        </button>

        <button
          class="sidebar-item"
          :class="{ active: activeSection === 'academic' }"
          type="button"
          @click="activeSection = 'academic'"
        >
          <span class="number">2</span>
          Academic Details
        </button>

        <button
          class="sidebar-item"
          :class="{ active: activeSection === 'preferences' }"
          type="button"
          @click="activeSection = 'preferences'"
        >
          <span class="number">3</span>
          Study Preferences
        </button>

        <button
          class="sidebar-item"
          :class="{ active: activeSection === 'documents' }"
          type="button"
          @click="activeSection = 'documents'"
        >
          <span class="number">4</span>
          Documents
        </button>

        <button
          class="sidebar-item"
          :class="{ active: activeSection === 'status' }"
          type="button"
          @click="activeSection = 'status'"
        >
          <span class="number">5</span>
          Application Status
        </button>

      </aside>


      <!-- ================= MAIN CONTENT ================= -->

      <main class="main-content">

        <div class="page-title">

          <h1>My Application Profile</h1>

          <p>
            Keep your personal and academic information up to date.
          </p>

        </div>


        <!-- ================= PERSONAL ================= -->

        <section
          v-if="activeSection === 'personal'"
          class="card"
        >

          <div class="section-header">

            <div>
              <h2>Personal Details</h2>
              <p>Tell us about yourself.</p>
            </div>

          </div>


          <div class="form-grid">

            <div class="form-group">
              <label>First Name</label>

              <input
                type="text"
                v-model="profile.firstName"
                placeholder="Enter your first name"
              />
            </div>


            <div class="form-group">
              <label>Surname</label>

              <input
                type="text"
                v-model="profile.surname"
                placeholder="Enter your surname"
              />
            </div>


            <div class="form-group">
              <label>ID / Passport Number</label>

              <input
                type="text"
                v-model="profile.idNumber"
                placeholder="Enter your ID or passport number"
              />
            </div>


            <div class="form-group">
              <label>Date of Birth</label>

              <input
                type="date"
                v-model="profile.dateOfBirth"
              />
            </div>


            <div class="form-group">
              <label>Gender</label>

              <select v-model="profile.gender">

                <option value="">
                  Select gender
                </option>

                <option>Male</option>
                <option>Female</option>
                <option>Other</option>

              </select>

            </div>


            <div class="form-group">
              <label>Nationality</label>

              <select v-model="profile.nationality">

                <option value="">
                  Select nationality
                </option>

                <option>South African</option>
                <option>Other</option>

              </select>

            </div>


            <div class="form-group">
              <label>Email Address</label>

              <input
                type="email"
                v-model="profile.email"
                placeholder="example@email.com"
              />

            </div>


            <div class="form-group">
              <label>Phone Number</label>

              <input
                type="tel"
                v-model="profile.phone"
                placeholder="Enter your phone number"
              />

            </div>

          </div>


          <div class="form-group full-width">

            <label>Residential Address</label>

            <textarea
              v-model="profile.address"
              placeholder="Enter your residential address"
              rows="3"
            ></textarea>

          </div>


          <div class="form-grid">

            <div class="form-group">

              <label>Province</label>

              <select v-model="profile.province">

                <option value="">
                  Select province
                </option>

                <option>Western Cape</option>
                <option>Eastern Cape</option>
                <option>Gauteng</option>
                <option>KwaZulu-Natal</option>
                <option>Free State</option>
                <option>Limpopo</option>
                <option>Mpumalanga</option>
                <option>North West</option>
                <option>Northern Cape</option>

              </select>

            </div>


            <div class="form-group">

              <label>City / Town</label>

              <input
                type="text"
                v-model="profile.city"
                placeholder="Enter your city or town"
              />

            </div>

          </div>


          <div class="card-actions">

            <button
              class="save-btn"
              @click="saveProfile"
            >
              Save Details
            </button>

          </div>

        </section>


        <!-- ================= ACADEMIC ================= -->

        <section
          v-if="activeSection === 'academic'"
          class="card"
        >

          <div class="section-header">

            <div>
              <h2>Academic Details</h2>
              <p>Enter your school and academic information.</p>
            </div>

          </div>


          <div class="form-grid">

            <div class="form-group">

              <label>High School</label>

              <input
                type="text"
                v-model="profile.school"
                placeholder="Enter your high school"
              />

            </div>


            <div class="form-group">

              <label>Matric Year</label>

              <select v-model="profile.matricYear">

                <option value="">
                  Select year
                </option>

                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>

              </select>

            </div>


            <div class="form-group">

              <label>Qualification</label>

              <select v-model="profile.qualification">

                <option value="">
                  Select qualification
                </option>

                <option>
                  National Senior Certificate
                </option>

                <option>
                  National Certificate (Vocational)
                </option>

                <option>
                  Other
                </option>

              </select>

            </div>

          </div>


          <h3>Subjects & Results</h3>


          <div class="subjects-header">

            <span>Subject</span>
            <span>Mark / Level</span>
            <span></span>

          </div>


          <div
            v-for="(subject, index) in profile.subjects"
            :key="index"
            class="subject-row"
          >

            <div class="subject-autocomplete">

              <input
                type="text"
                v-model="subject.name"
                placeholder="Subject name"
                @focus="activateSubject(index)"
                @input="activateSubject(index)"
                @blur="hideSubjectSuggestions"
              />

              <div
                v-if="
                  activeSubjectIndex === index &&
                  filteredSubjectSuggestions(subject.name).length
                "
                class="subject-suggestions"
              >

                <button
                  v-for="subjectName in filteredSubjectSuggestions(subject.name)"
                  :key="subjectName"
                  type="button"
                  class="subject-suggestion"
                  @mousedown.prevent="
                    selectSubject(index, subjectName)
                  "
                >
                  {{ subjectName }}
                </button>

              </div>

            </div>


            <input
              type="number"
              v-model="subject.mark"
              placeholder="Mark %"
              min="0"
              max="100"
            />


            <button
              class="remove-btn"
              @click="removeSubject(index)"
            >
              Remove
            </button>

          </div>


          <button
            class="add-subject"
            @click="addSubject"
          >
            + Add Subject
          </button>

        </section>


        <!-- ================= PREFERENCES ================= -->

        <section
          v-if="activeSection === 'preferences'"
          class="card"
        >

          <div class="section-header">

            <div>

              <h2>Study Preferences</h2>

              <p>
                Tell us what you would like to study.
              </p>

            </div>

          </div>


          <div class="form-grid">

            <div class="form-group">

              <label>
                Preferred Field of Study
              </label>

              <select v-model="profile.field">

                <option value="">
                  Select field
                </option>

                <option>Information Technology</option>
                <option>Computer Science</option>
                <option>Accounting</option>
                <option>Business Management</option>
                <option>Engineering</option>
                <option>Nursing</option>
                <option>Teaching</option>
                <option>Law</option>

              </select>

            </div>


            <div class="form-group">

              <label>
                Preferred Province
              </label>

              <select v-model="profile.preferredProvince">

                <option value="">
                  Select province
                </option>

                <option>Western Cape</option>
                <option>Eastern Cape</option>
                <option>Gauteng</option>
                <option>KwaZulu-Natal</option>
                <option>Free State</option>
                <option>Limpopo</option>
                <option>Mpumalanga</option>
                <option>North West</option>
                <option>Northern Cape</option>

              </select>

            </div>

          </div>

        </section>


        <!-- ================= DOCUMENTS ================= -->

        <section
          v-if="activeSection === 'documents'"
          class="card"
        >

          <div class="section-header">

            <div>

              <h2>Documents</h2>

              <p>
                Upload the documents required for your applications.
              </p>

            </div>

          </div>


          <div class="document-list">

            <div class="document-item">

              <div>
                <strong>ID / Passport</strong>
                <p>PDF, JPG or PNG</p>
              </div>

              <label class="upload-btn">

                Upload

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  hidden
                />

              </label>

            </div>


            <div class="document-item">

              <div>
                <strong>Matric Results</strong>
                <p>PDF, JPG or PNG</p>
              </div>

              <label class="upload-btn">

                Upload

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  hidden
                />

              </label>

            </div>


            <div class="document-item">

              <div>
                <strong>Proof of Address</strong>
                <p>PDF, JPG or PNG</p>
              </div>

              <label class="upload-btn">

                Upload

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  hidden
                />

              </label>

            </div>

          </div>

        </section>


        <!-- ================= STATUS ================= -->

        <section
          v-if="activeSection === 'status'"
          class="card"
        >

          <div class="section-header">

            <div>

              <h2>Application Status</h2>

              <p>
                Track the progress of your applications.
              </p>

            </div>

          </div>


          <div class="status-box">

            <div class="status-circle">
              ✓
            </div>

            <div>

              <strong>
                Profile in Progress
              </strong>

              <p>
                Complete your profile before submitting an application.
              </p>

            </div>

          </div>

        </section>


        <!-- SAVE -->

        <div class="bottom-actions">

          <button
            class="save-btn"
            @click="saveProfile"
          >
            Save Profile
          </button>

        </div>

      </main>

    </div>

  </div>
</template>


<script>

export default {

  name: "Portfolio",

  data() {

    return {

      activeSection: "personal",

      profile: {

        firstName: "",
        surname: "",
        idNumber: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        email: "",
        phone: "",
        address: "",
        province: "",
        city: "",

        school: "",
        matricYear: "",
        qualification: "",

        field: "",
        preferredProvince: "",

        subjects: [
          {
            name: "",
            mark: ""
          }
        ]

      },

      subjectSuggestions: [
        "Accounting",
        "Afrikaans",
        "Business Studies",
        "Computer Applications Technology",
        "Consumer Studies",
        "Dramatic Arts",
        "Economics",
        "English",
        "Geography",
        "History",
        "Information Technology",
        "Life Orientation",
        "Life Sciences",
        "Mathematics",
        "Mathematical Literacy",
        "Physical Sciences",
        "Religion Studies",
        "isiZulu",
        "Visual Arts"
      ],

      activeSubjectIndex: null

    };

  },


  computed: {

    profileInitials() {

      const firstName =
        this.profile.firstName.trim();

      const surname =
        this.profile.surname.trim();

      if (!firstName && !surname) {
        return "--";
      }

      return (
        `${firstName.charAt(0)}${surname.charAt(0)}`
      ).toUpperCase();

    }

  },


  methods: {

    activateSubject(index) {

      this.activeSubjectIndex = index;

    },


    hideSubjectSuggestions() {

      setTimeout(() => {

        this.activeSubjectIndex = null;

      }, 100);

    },


    filteredSubjectSuggestions(subjectName) {

      const searchTerm =
        subjectName.trim().toLowerCase();

      if (!searchTerm) {
        return [];
      }

      return this.subjectSuggestions.filter(
        (suggestion) =>
          suggestion
            .toLowerCase()
            .startsWith(searchTerm)
      );

    },


    selectSubject(index, subjectName) {

      this.profile.subjects[index].name =
        subjectName;

      this.activeSubjectIndex = null;

    },


    addSubject() {

      this.profile.subjects.push({
        name: "",
        mark: ""
      });

    },


    removeSubject(index) {

      if (this.profile.subjects.length > 1) {

        this.profile.subjects.splice(index, 1);

      }

    },


    saveProfile() {

      localStorage.setItem(
        "applyDirectProfile",
        JSON.stringify(this.profile)
      );

      alert("Profile saved successfully!");

    }

  }

};

</script>

<style scoped>

/* =========================================
   APPLYDIRECT-SA
   YOUTHFUL SOUTH AFRICAN THEME
========================================= */

* {
  box-sizing: border-box;
}

.profile-page {
  --green: #087f4e;
  --green-dark: #075c3a;
  --gold: #f4c20d;
  --red: #d9433f;
  --ink: #17211b;
  --muted: #68756f;

  min-height: 100vh;
  background: #f7f8f5;
  color: var(--ink);

  font-family:
    "DM Sans",
    "Segoe UI",
    Arial,
    sans-serif;
}


/* =========================================
   HEADER
========================================= */

.top-header {
  position: sticky;
  top: 0;
  z-index: 20;

  height: 78px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 clamp(20px, 5vw, 70px);

  background: rgba(255, 255, 255, 0.96);

  border-top: 4px solid var(--green);
  border-bottom: 1px solid #e6ebe7;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);

  backdrop-filter: blur(10px);
}


/* =========================================
   LOGO
========================================= */

.logo {
  position: relative;

  color: var(--ink);

  font-size: clamp(22px, 2.5vw, 29px);
  font-weight: 800;
  letter-spacing: -1px;

  white-space: nowrap;
}

.logo::after {
  content: "";

  display: inline-block;

  width: 7px;
  height: 7px;

  margin-left: 6px;
  margin-bottom: 3px;

  border-radius: 50%;

  background: var(--gold);
}


/* =========================================
   NAVIGATION
========================================= */

nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

nav a {
  position: relative;

  padding: 10px 15px;

  border-radius: 999px;

  color: #53615b;

  text-decoration: none;

  font-size: 14px;
  font-weight: 600;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

nav a:hover {
  background: var(--light-green);
  color: var(--green-dark);

  transform: translateY(-1px);
}

nav a.active {
  background: var(--green);
  color: white;

  box-shadow: 0 5px 12px rgba(8, 127, 78, 0.18);
}


/* =========================================
   HEADER PROFILE
========================================= */

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;

  color: var(--muted);

  font-size: 14px;
  font-weight: 500;
}

.profile-icon {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: var(--gold);
  color: var(--ink);

  font-size: 12px;
  font-weight: 800;

  box-shadow: 3px 3px 0 var(--red);
}


/* =========================================
   MAIN LAYOUT
========================================= */

.page-layout {
  display: flex;
  min-height: calc(100vh - 78px);
}


/* =========================================
   SIDEBAR
========================================= */

.sidebar {
  width: 255px;
  flex-shrink: 0;

  padding: 35px 18px;

  background: #ffffff;

  border-right: 1px solid #e5ebe7;
}

.sidebar-title {
  margin-bottom: 18px;

  color: var(--green-dark);

  font-size: 12px;
  font-weight: 800;

  letter-spacing: 1.2px;
  text-transform: uppercase;
}


/* SIDEBAR ITEMS */

.sidebar-item {
  width: 100%;

  display: flex;
  align-items: center;
  gap: 11px;

  margin-bottom: 7px;
  padding: 11px;

  border: none;
  border-radius: 10px;

  background: transparent;

  color: #64716b;

  font-size: 14px;
  font-weight: 500;

  text-align: left;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.sidebar-item:hover {
  background: #f1f7f3;
  color: var(--green-dark);

  transform: translateX(3px);
}


/* ACTIVE SIDEBAR */

.sidebar-item.active {
  background: var(--green);

  color: white;

  font-weight: 700;

  box-shadow: 4px 4px 0 rgba(244, 194, 13, 0.75);

  transform: translateX(2px);
}


/* NUMBER */

.number {
  width: 29px;
  height: 29px;
  min-width: 29px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #d5ddd8;
  border-radius: 50%;

  background: white;

  color: #68756f;

  font-size: 12px;
  font-weight: 700;
}

.sidebar-item.active .number {
  background: var(--gold);

  border-color: var(--gold);

  color: var(--ink);
}


/* =========================================
   MAIN CONTENT
========================================= */

.main-content {
  flex: 1;

  width: 100%;
  max-width: 1180px;

  margin: 0 auto;

  padding: clamp(32px, 5vw, 55px) clamp(20px, 5vw, 60px);
}


/* =========================================
   PAGE TITLE
========================================= */

.page-title {
  margin-bottom: 30px;
}

.page-title h1 {
  margin: 0;

  color: var(--ink);

  font-size: clamp(30px, 4vw, 42px);
  font-weight: 800;

  letter-spacing: -1.2px;
  line-height: 1.1;
}

.page-title h1::before {
  content: "";

  display: block;

  width: 42px;
  height: 5px;

  margin-bottom: 14px;

  border-radius: 20px;

  background: var(--red);
}

.page-title p {
  margin-top: 9px;

  color: var(--muted);

  font-size: 15px;
}


/* =========================================
   CARDS
========================================= */

.card {
  position: relative;

  margin-bottom: 22px;
  padding: 28px;

  background: white;

  border: 1px solid #e3e9e5;
  border-radius: 15px;

  box-shadow:
    0 10px 30px rgba(30, 65, 45, 0.06);
}


/* SMALL SA ACCENT */

.card::before {
  content: "";

  display: block;

  width: 55px;
  height: 4px;

  margin-bottom: 22px;

  border-radius: 20px;

  background:
    linear-gradient(
      90deg,
      var(--green) 0%,
      var(--green) 60%,
      var(--gold) 60%,
      var(--gold) 80%,
      var(--red) 80%
    );
}


/* =========================================
   SECTION HEADER
========================================= */

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-bottom: 17px;
  margin-bottom: 24px;

  border-bottom: 1px solid #e8ece9;
}

.section-header h2 {
  margin: 0;

  color: var(--green-dark);

  font-size: 21px;
  font-weight: 800;
}

.section-header p {
  margin: 6px 0 0;

  color: var(--muted);

  font-size: 13px;
}


/* =========================================
   FORMS
========================================= */

.form-grid {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 20px;

  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 7px;

  color: #37443e;

  font-size: 13px;
  font-weight: 700;
}


/* INPUTS */

.form-group input,
.form-group select,
.form-group textarea,
.subject-row input {
  width: 100%;

  padding: 12px 13px;

  border: 1px solid #d5ded8;
  border-radius: 9px;

  background: #ffffff;

  color: #27332d;

  font-size: 14px;

  outline: none;

  transition:
    border 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}


/* FOCUS */

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus,
.subject-row input:focus {
  border-color: var(--green);

  box-shadow: 0 0 0 4px rgba(8, 127, 78, 0.09);

  transform: translateY(-1px);
}

.form-group input::placeholder,
.form-group textarea::placeholder,
.subject-row input::placeholder {
  color: #9aa49f;
}


/* FULL WIDTH */

.full-width {
  margin-bottom: 20px;
}


/* =========================================
   SAVE BUTTON
========================================= */

.card-actions {
  display: flex;
  justify-content: flex-end;

  margin-top: 22px;
}

.save-btn {
  padding: 12px 24px;

  border: none;
  border-radius: 999px;

  background: var(--green);

  color: white;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  box-shadow: 4px 4px 0 var(--gold);

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.save-btn:hover {
  background: var(--green-dark);

  transform: translate(2px, 2px);

  box-shadow: 2px 2px 0 var(--gold);
}


/* =========================================
   SUBJECTS
========================================= */

.card h3 {
  margin: 26px 0 13px;

  color: #303d36;

  font-size: 16px;
  font-weight: 800;
}

.subjects-header {
  display: grid;

  grid-template-columns: 1fr 180px 100px;

  gap: 12px;

  margin-bottom: 8px;

  color: #718078;

  font-size: 12px;
  font-weight: 700;
}

.subject-row {
  display: grid;

  grid-template-columns: 1fr 180px 100px;

  gap: 12px;

  margin-bottom: 10px;
}

.subject-autocomplete {
  position: relative;
}


/* SUGGESTIONS */

.subject-suggestions {
  position: absolute;

  top: calc(100% + 4px);
  left: 0;
  right: 0;

  max-height: 180px;

  overflow-y: auto;

  background: white;

  border: 1px solid #d5ded8;
  border-radius: 9px;

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

  z-index: 50;
}

.subject-suggestion {
  width: 100%;

  padding: 10px 12px;

  border: none;

  background: white;

  color: #38453f;

  text-align: left;

  cursor: pointer;

  font-size: 13px;
}

.subject-suggestion:hover {
  background: #eef8f2;

  color: var(--green-dark);
}


/* REMOVE */

.remove-btn {
  border: none;
  border-radius: 8px;

  background: #fff1f0;

  color: #d1433d;

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
}

.remove-btn:hover {
  background: #ffe2df;
}


/* ADD SUBJECT */

.add-subject {
  margin-top: 8px;

  padding: 10px 15px;

  border: 1px solid var(--green);
  border-radius: 999px;

  background: #f1f9f4;

  color: var(--green-dark);

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s ease;
}

.add-subject:hover {
  background: var(--gold);

  border-color: var(--gold);

  color: var(--ink);
}


/* =========================================
   DOCUMENTS
========================================= */

.document-list {
  display: flex;
  flex-direction: column;

  gap: 12px;
}

.document-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 17px;

  border: 1px solid #e1e8e3;
  border-radius: 10px;

  background: #fbfcfb;

  transition:
    border 0.2s ease,
    transform 0.2s ease;
}

.document-item:hover {
  border-color: rgba(8, 127, 78, 0.3);

  transform: translateY(-2px);
}

.document-item strong {
  color: #26332c;

  font-size: 14px;
}

.document-item p {
  margin: 5px 0 0;

  color: #7a8580;

  font-size: 12px;
}


/* UPLOAD */

.upload-btn {
  padding: 9px 18px;

  border-radius: 999px;

  background: var(--green);

  color: white;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  transition: 0.2s ease;
}

.upload-btn:hover {
  background: var(--green-dark);

  transform: translateY(-1px);
}


/* =========================================
   APPLICATION STATUS
========================================= */

.status-box {
  display: flex;
  align-items: center;

  gap: 15px;

  padding: 20px;

  border: 1px solid rgba(8, 127, 78, 0.16);
  border-radius: 12px;

  background: #f0f8f3;
}

.status-circle {
  width: 42px;
  height: 42px;
  min-width: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: var(--green);

  color: white;

  font-weight: 800;

  box-shadow: 3px 3px 0 var(--gold);
}

.status-box strong {
  color: var(--green-dark);

  font-size: 15px;
}

.status-box p {
  margin: 5px 0 0;

  color: var(--muted);

  font-size: 13px;
}


/* =========================================
   BOTTOM SAVE
========================================= */

.bottom-actions {
  display: flex;
  justify-content: flex-end;

  margin-top: 5px;
  padding-bottom: 20px;
}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 1100px) {

  .header-right {
    display: none;
  }

  .main-content {
    padding: 35px 30px;
  }
}


@media (max-width: 850px) {

  nav a {
    padding: 9px 9px;

    font-size: 12px;
  }

  .sidebar {
    width: 215px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .main-content {
    padding: 30px 22px;
  }
}


@media (max-width: 650px) {

  .top-header {
    height: auto;

    padding: 14px 18px;

    flex-direction: column;

    gap: 12px;
  }

  nav {
    width: 100%;

    flex-wrap: wrap;

    justify-content: center;

    gap: 3px;
  }

  nav a {
    padding: 8px 9px;

    font-size: 11px;
  }

  .sidebar {
    display: none;
  }

  .main-content {
    padding: 25px 16px;
  }

  .page-title h1 {
    font-size: 30px;
  }

  .card {
    padding: 21px;

    border-radius: 12px;
  }

  .subject-row,
  .subjects-header {
    grid-template-columns: 1fr;
  }

  .remove-btn {
    padding: 10px;
  }

  .document-item {
    align-items: flex-start;

    gap: 15px;
  }

  .upload-btn {
    flex-shrink: 0;
  }

  .bottom-actions,
  .card-actions {
    justify-content: stretch;
  }

  .save-btn {
    width: 100%;
  }
}


/* =========================================
   REDUCED MOTION
========================================= */

@media (prefers-reduced-motion: reduce) {

  nav a,
  .sidebar-item,
  .save-btn,
  .add-subject,
  .document-item,
  .form-group input,
  .form-group select,
  .form-group textarea,
  .subject-row input {
    transition: none;
  }
}

</style>