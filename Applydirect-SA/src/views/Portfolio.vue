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

/* ================================================= */
/* APPLYDIRECT-SA COLOUR PALETTE */
/* ================================================= */

/*
Blue   = #0637A6
Green  = #008A4C
Gold   = #F4C20D
Orange = #F47B20
*/


* {
  box-sizing: border-box;
}


/* ================= PAGE ================= */

.profile-page {
  min-height: 100vh;
  background: #0463c1;
  font-family:
    Arial,
    Helvetica,
    sans-serif;

  color: #222;

}


/* ================= HEADER ================= */

.top-header {
  height: 76px;
  background: #ffffff;
  border-top: 4px solid #008A4C;
  border-bottom: 1px solid #d9dce3;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 0 7%;

}


/* LOGO */

.logo {

  font-size: 30px;

  font-weight: 700;

  color: #0637A6;

  white-space: nowrap;

}


/* ================= NAVIGATION ================= */

nav {

  display: flex;

  align-items: center;

  gap: 4px;

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

nav a:hover {

  color: #0637A6;

}

nav a.active {
  background: linear-gradient(135deg, #0f8f4d 0%, #0b7d42 100%);
  color: #ffffff;
  font-weight: 600;
}


/* ================= PROFILE ICON ================= */

.header-right {

  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 14px;

  color: #555;

}

.profile-icon {

  width: 38px;

  height: 38px;

  border-radius: 50%;

  background: linear-gradient(135deg, #F4C20D 0%, #F47B20 100%);

  color: #0637A6;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 12px;

  font-weight: 700;

}

/* ================= LAYOUT ================= */

.page-layout {

  display: flex;

  min-height:
    calc(100vh - 76px);

}

/* ================= SIDEBAR ================= */

.sidebar {
  width: 250px;
  background: #edf4ff;
  border-right: 1px solid rgba(6, 55, 166, 0.14);
  padding: 30px 18px;
}


/* SIDEBAR TITLE */

.sidebar-title {

  font-size: 13px;

  font-weight: 700;

  color: #6b7280;

  text-transform: uppercase;

  margin-bottom: 18px;

}


/* SIDEBAR BUTTON */

.sidebar-item {

  width: 100%;

  display: flex;

  align-items: center;

  gap: 11px;

  padding: 12px;

  margin-bottom: 6px;

  border: none;

  border-radius: 5px;

  background: transparent;

  color: #555;

  font-size: 14px;

  text-align: left;

  cursor: pointer;

}


/* HOVER */

.sidebar-item:hover {

  background: #f0f4fa;

  color: #0637A6;

}


/* ACTIVE */

.sidebar-item.active {
  background: rgba(10, 162, 82, 0.09);
  color: #0637A6;
  font-weight: 600;
  border-left: 4px solid #0b7d42;
  box-shadow: inset 0 0 0 1px rgba(11, 125, 66, 0.08);
}


/* NUMBER */

.number {

  width: 28px;

  height: 28px;

  min-width: 28px;

  border-radius: 50%;

  border: 1px solid #cbd5e1;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 12px;

}


/* ACTIVE NUMBER */

.sidebar-item.active .number {

  background: #008A4C;

  border-color: #008A4C;

  color: white;

}


/* ================= MAIN ================= */

.main-content {

  flex: 1;
  max-width: 1100px;
  padding: 35px 45px;
  margin: 0 auto;
  background : linear-gradient(67deg, #0982fb 0%, #366b9f 100%)
}


/* ================= PAGE TITLE ================= */

.page-title {

  margin-bottom: 25px;

}

.page-title h1 {

  margin: 0;

  font-size: 30px;

  color: #0637A6;

}

.page-title p {

  margin-top: 7px;

  color: #6b7280;

  font-size: 14px;

}


/* ================= CARD ================= */

.card {

  background: #ffffff;

  border: 1px solid #e0e3e8;

  border-left: 4px solid #F47B20;

  border-radius: 6px;

  padding: 28px;

  margin-bottom: 22px;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04);

}


/* ================= CARD HEADER ================= */

.section-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  border-bottom: 1px solid #e6e8ec;

  padding-bottom: 16px;

  margin-bottom: 23px;

}

.section-header h2 {

  margin: 0;

  color: #81a2ef;

  font-size: 20px;

}

.section-header p {

  margin: 6px 0 0;

  color: #6b7280;

  font-size: 13px;

}


/* ================= FORMS ================= */

.form-grid {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 20px;

  margin-bottom: 20px;

}

.form-group {

  display: flex;

  flex-direction: column;

}

.form-group label {

  margin-bottom: 7px;

  font-size: 13px;

  font-weight: 600;

  color: #374151;

}


.form-group input,
.form-group select,
.form-group textarea,
.subject-row input {

  width: 100%;

  padding: 11px 12px;

  border: 1px solid #cfd4da;

  border-radius: 5px;

  background: #ffffff;

  font-size: 14px;

  outline: none;

}


.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus,
.subject-row input:focus {

  border-color: #0637A6;

  box-shadow:
    0 0 0 2px
    rgba(6, 55, 166, 0.08);

}


.full-width {

  margin-bottom: 20px;

}


/* ================= SAVE BUTTON ================= */

.card-actions {

  display: flex;

  justify-content: flex-end;

  margin-top: 20px;

}


.save-btn {
  background: linear-gradient(135deg, #0f8f4d 0%, #0b7d42 100%);
  color: white;
  border: none;
  border-radius: 5px;

  padding: 12px 25px;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

}

.save-btn:hover {

  background: #052d88;

}


/* ================= SUBJECTS ================= */

.card h3 {

  font-size: 16px;

  color: #374151;

  margin: 25px 0 12px;

}


.subjects-header {

  display: grid;

  grid-template-columns:
    1fr 180px 100px;

  gap: 12px;

  margin-bottom: 8px;

  font-size: 12px;

  font-weight: 600;

  color: #6b7280;

}


.subject-row {

  display: grid;

  grid-template-columns:
    1fr 180px 100px;

  gap: 12px;

  margin-bottom: 10px;

}


.subject-autocomplete {

  position: relative;

}


.subject-suggestions {

  position: absolute;

  top: calc(100% + 3px);

  left: 0;

  right: 0;

  max-height: 180px;

  overflow-y: auto;

  background: white;

  border: 1px solid #d1d5db;

  border-radius: 5px;

  box-shadow:
    0 5px 15px
    rgba(0, 0, 0, 0.1);

  z-index: 10;

}


.subject-suggestion {

  width: 100%;

  padding: 10px 12px;

  border: none;

  background: white;

  text-align: left;

  cursor: pointer;

  font-size: 13px;

}


.subject-suggestion:hover {

  background: #eaf0fa;

  color: #0637A6;

}


/* REMOVE */

.remove-btn {

  border: none;

  background: #fff1f1;

  color: #d62828;

  border-radius: 5px;

  cursor: pointer;

  font-size: 13px;

}


.remove-btn:hover {

  background: #ffe0e0;

}


/* ADD SUBJECT */

.add-subject {
  margin-top: 8px;
  padding: 10px 15px;
  border: 1px solid #0b7d42;
  background: #f3fbf6;
  color: #0b7d42;
  border-radius: 5px;

  font-size: 13px;

  cursor: pointer;

  font-weight: 600;

}


.add-subject:hover {

  background: #fff9ea;

}


/* ================= DOCUMENTS ================= */

.document-list {

  display: flex;

  flex-direction: column;

  gap: 12px;

}


.document-item {

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 16px;

  border: 1px solid #e0e3e8;

  border-radius: 6px;

}


.document-item strong {

  font-size: 14px;

  color: #222;

}


.document-item p {

  margin: 5px 0 0;

  font-size: 12px;

  color: #777;

}


/* GREEN UPLOAD */

.upload-btn {

  background: #008A4C;

  color: white;

  padding: 9px 18px;

  border-radius: 5px;

  cursor: pointer;

  font-size: 13px;

  font-weight: 600;

}


.upload-btn:hover {

  background: #00723e;

}


/* ================= STATUS ================= */

.status-box {

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 20px;

  border-radius: 6px;

  background: #f0f7f3;

  border: 1px solid #cce5d8;

}


.status-circle {

  width: 40px;

  height: 40px;

  border-radius: 50%;

  background: #008A4C;

  color: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-weight: bold;

}


.status-box strong {

  color: #0637A6;

}


.status-box p {

  margin: 5px 0 0;

  color: #6b7280;

  font-size: 13px;

}


/* ================= RESPONSIVE ================= */

@media (max-width: 1100px) {

  .header-right {

    display: none;

  }

  .main-content {

    padding: 30px;

  }

}


@media (max-width: 850px) {

  nav a {

    padding: 10px 8px;

    font-size: 13px;

  }

  .sidebar {

    width: 210px;

  }

  .form-grid {

    grid-template-columns: 1fr;

  }

}


@media (max-width: 650px) {

  .top-header {

    height: auto;

    padding: 15px 20px;

    flex-direction: column;

    gap: 12px;

  }

  nav {

    flex-wrap: wrap;

    justify-content: center;

  }

  .sidebar {

    display: none;

  }

  .main-content {

    padding: 25px 18px;

  }

  .subject-row,
  .subjects-header {

    grid-template-columns: 1fr;

  }

  .section-header {

    align-items: flex-start;

  }

}

/* ================= YOUTHFUL SA REFRESH ================= */

.profile-page {
  --ink: #17211b;
  --green: #087f4e;
  --green-dark: #075c3a;
  --gold: #f3c623;
  --red: #df433d;
  position: relative;
  overflow: hidden;
  background: #d8e4ed;
  color: var(--ink);
  font-family: 'DM Sans', 'Trebuchet MS', sans-serif;
}

.profile-page::before {
  position: fixed;
  top: 76px;
  right: 0;
  width: 8px;
  height: 180px;
  background: var(--red);
  content: '';
  opacity: 0.9;
}

.top-header {
  position: relative;
  z-index: 2;
  height: 82px;
  padding: 0 clamp(20px, 5vw, 72px);
  border-top: 5px solid var(--green);
  border-bottom: 1px solid rgba(23, 33, 27, 0.09);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 8px 30px rgba(33, 65, 45, 0.05);
  backdrop-filter: blur(12px);
}

.logo {
  color: var(--ink);
  font-family: 'Space Grotesk', 'Trebuchet MS', sans-serif;
  font-size: clamp(22px, 2.4vw, 30px);
  letter-spacing: -0.5px;
}

.logo::after {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin: 0 0 4px 5px;
  border-radius: 50%;
  background: var(--gold);
  content: '';
}

nav a {
  border-radius: 999px;
  color: #52605a;
  font-weight: 600;
  transition: color 180ms ease, background 180ms ease, transform 180ms ease;
}

nav a:hover {
  background: #eef7f1;
  color: var(--green-dark);
  transform: translateY(-2px);
}

nav a.active {
  background: var(--green);
  box-shadow: 0 6px 14px rgba(8, 127, 78, 0.2);
}

.profile-icon {
  background: var(--gold);
  box-shadow: 4px 4px 0 var(--red);
  color: var(--ink);
}

.page-layout { position: relative; z-index: 1; }

.sidebar {
  width: 264px;
  padding: 38px 20px;
  border-right: 1px solid rgba(8, 127, 78, 0.12);
  background: #d8e4ed;
}

.sidebar-title { color: var(--green-dark); letter-spacing: 1.2px; }

.sidebar-item {
  border-radius: 10px;
  color: #627069;
  font-weight: 500;
  transition: transform 180ms ease, background 180ms ease, color 180ms ease;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.78);
  color: var(--green-dark);
  transform: translateX(3px);
}

.sidebar-item.active {
  border-left: 0;
  background: var(--green);
  box-shadow: 5px 5px 0 rgba(243, 198, 35, 0.7);
  color: #fff;
}

.sidebar-item.active .number {
  border-color: var(--gold);
  background: var(--gold);
  color: var(--ink);
}

.main-content {
  max-width: 1180px;
  padding: clamp(32px, 5vw, 58px) clamp(20px, 5vw, 64px);
}

.page-title { animation: rise-in 500ms ease both; }

.page-title h1 {
  color: var(--ink);
  font-family: 'Space Grotesk', 'Trebuchet MS', sans-serif;
  font-size: clamp(30px, 4vw, 44px);
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.08;
}

.page-title h1::before {
  display: block;
  width: 44px;
  height: 5px;
  margin-bottom: 15px;
  border-radius: 99px;
  background: var(--red);
  content: '';
}

.page-title p { color: #617069; font-size: 15px; }

.card {
  border: 1px solid rgba(8, 127, 78, 0.13);
  border-left: 0;
  border-radius: 14px;
  box-shadow: 0 18px 45px rgba(27, 67, 43, 0.08);
  animation: rise-in 600ms 80ms ease both;
}

.card::before {
  display: block;
  width: 54px;
  height: 4px;
  margin-bottom: 22px;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--green) 0 58%, var(--gold) 58% 78%, var(--red) 78%);
  content: '';
}

.section-header { border-bottom-color: rgba(23, 33, 27, 0.1); }

.section-header h2,
.status-box strong {
  color: var(--green-dark);
  font-family: 'Space Grotesk', 'Trebuchet MS', sans-serif;
}

.form-group label { color: #405049; }

.form-group input,
.form-group select,
.form-group textarea,
.subject-row input {
  border-color: #d7e1d9;
  border-radius: 9px;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus,
.subject-row input:focus {
  border-color: var(--green);
  box-shadow: 0 0 0 4px rgba(8, 127, 78, 0.1);
  transform: translateY(-1px);
}

.save-btn {
  border-radius: 999px;
  background: var(--green);
  box-shadow: 4px 4px 0 var(--gold);
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.save-btn:hover {
  background: var(--green-dark);
  box-shadow: 2px 2px 0 var(--gold);
  transform: translate(2px, 2px);
}

.status-box { background: #eef8f0; border-color: rgba(8, 127, 78, 0.2); }

.status-circle { background: var(--green); box-shadow: 4px 4px 0 var(--gold); }

@keyframes rise-in {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .page-title, .card { animation: none; }
  nav a, .sidebar-item, .save-btn, .form-group input, .form-group select,
  .form-group textarea, .subject-row input { transition: none; }
}

@media (max-width: 650px) {
  .top-header,
  .main-content {
    width: 100%;
    min-width: 0;
  }

  nav {
    width: 100%;
    min-width: 0;
    gap: 2px;
  }

  nav a {
    padding: 9px 8px;
    font-size: 12px;
    white-space: normal;
  }
}

</style>