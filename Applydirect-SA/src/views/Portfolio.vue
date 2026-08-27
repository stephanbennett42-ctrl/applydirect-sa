<template>
  <div class="profile-page">

    <!-- Top Header -->
    <header class="top-header">
      <div class="logo">ApplyDirect-SA</div>

      <div class="header-right">
        <span>My Profile</span>
        <div class="profile-icon">OG</div>
      </div>
    </header>

    <!-- Page Layout -->
    <div class="page-layout">

      <!-- Sidebar -->
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

      <!-- Main Content -->
      <main class="main-content">

        <div class="page-title">
          <h1>My Application Profile</h1>

          <p>
            Keep your personal and academic information up to date.
          </p>
        </div>


        <!-- Personal Details -->
        <section v-if="activeSection === 'personal'" class="card">

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
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div class="form-group">
              <label>Nationality</label>

              <select v-model="profile.nationality">
                <option value="">Select nationality</option>
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
                <option value="">Select province</option>
                <option>KwaZulu-Natal</option>
                <option>Gauteng</option>
                <option>Western Cape</option>
                <option>Eastern Cape</option>
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

        </section>


        <!-- Academic Details -->
        <section v-if="activeSection === 'academic'" class="card">

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
                <option value="">Select year</option>
                <option>2026</option>
                <option>2027</option>
                <option>2028</option>
                <option>2029</option>
              </select>
            </div>

            <div class="form-group">
              <label>Qualification</label>

              <select v-model="profile.qualification">
                <option value="">Select qualification</option>
                <option>National Senior Certificate</option>
                <option>National Certificate (Vocational)</option>
                <option>Other</option>
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
                v-if="activeSubjectIndex === index && filteredSubjectSuggestions(subject.name).length"
                class="subject-suggestions"
                role="listbox"
              >
                <button
                  v-for="subjectName in filteredSubjectSuggestions(subject.name)"
                  :key="subjectName"
                  type="button"
                  class="subject-suggestion"
                  @mousedown.prevent="selectSubject(index, subjectName)"
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


        <!-- Study Preferences -->
        <section v-if="activeSection === 'preferences'" class="card">

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
              <label>Preferred Field of Study</label>

              <select v-model="profile.field">
                <option value="">Select field</option>
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
              <label>Preferred Province</label>

              <select v-model="profile.preferredProvince">
                <option value="">Select province</option>
                <option>KwaZulu-Natal</option>
                <option>Gauteng</option>
                <option>Western Cape</option>
                <option>Eastern Cape</option>
                <option>Free State</option>
                <option>Limpopo</option>
                <option>Mpumalanga</option>
                <option>North West</option>
                <option>Northern Cape</option>
              </select>
            </div>

          </div>

        </section>

        <section v-if="activeSection === 'documents'" class="card">
          <div class="section-header">
            <div>
              <h2>Documents</h2>
              <p>Upload the documents required for your application.</p>
            </div>
          </div>

          <div class="empty-section">
            <h3>Documents</h3>
            <p>Document uploads will be available here once your profile is complete.</p>
          </div>
        </section>

        <section v-if="activeSection === 'status'" class="card">
          <div class="section-header">
            <div>
              <h2>Application Status</h2>
              <p>Track the progress of your application.</p>
            </div>
          </div>

          <div class="status-message">
            <strong>Profile in progress</strong>
            <p>Complete your profile and save it to continue with your application.</p>
          </div>
        </section>


        <!-- Save Button -->
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

      activeSection: "personal",

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

      const searchTerm = subjectName.trim().toLowerCase();

      if (!searchTerm) {
        return [];
      }

      return this.subjectSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().startsWith(searchTerm)
      );

    },


    selectSubject(index, subjectName) {

      this.profile.subjects[index].name = subjectName;
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

* {
  box-sizing: border-box;
}

.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
  font-family: Arial, Helvetica, sans-serif;
  color: #1f2937;
}


/* ================= HEADER ================= */

.top-header {
  height: 72px;
  background: white;
  border-bottom: 1px solid #e5e7eb;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 45px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #123b63;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;

  font-size: 14px;
  color: #555;
}

.profile-icon {
  width: 38px;
  height: 38px;

  border-radius: 50%;

  background: #123b63;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 13px;
  font-weight: bold;
}


/* ================= LAYOUT ================= */

.page-layout {
  display: flex;
  min-height: calc(100vh - 72px);
}


/* ================= SIDEBAR ================= */

.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e5e7eb;

  padding: 35px 20px;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;

  text-transform: uppercase;

  margin-bottom: 20px;
}

.sidebar-item {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 13px 12px;

  margin-bottom: 6px;

  border-radius: 6px;

  font-size: 14px;
  color: #64748b;

  cursor: pointer;
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
}

.sidebar-item.active {
  background: #eaf2f8;
  color: #123b63;
  font-weight: 600;
}

.number {
  width: 27px;
  height: 27px;

  border: 1px solid #cbd5e1;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
}

.active .number {
  background: #123b63;
  border-color: #123b63;
  color: white;
}


/* ================= MAIN ================= */

.main-content {
  flex: 1;

  max-width: 1050px;

  padding: 45px 55px;

  margin: 0 auto;
}

.page-title {
  margin-bottom: 30px;
}

.page-title h1 {
  margin: 0 0 8px;

  font-size: 30px;

  color: #123b63;
}

.page-title p {
  margin: 0;

  color: #64748b;

  font-size: 15px;
}


/* ================= CARD ================= */

.card {
  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 8px;

  padding: 30px;

  margin-bottom: 25px;
}

.section-header {
  margin-bottom: 25px;

  border-bottom: 1px solid #edf0f2;

  padding-bottom: 18px;
}

.section-header h2 {
  margin: 0 0 6px;

  font-size: 20px;

  color: #123b63;
}

.section-header p {
  margin: 0;

  font-size: 14px;

  color: #6b7280;
}

.empty-section,
.status-message {
  padding: 20px;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  background: #f8fafc;
  color: #64748b;
}

.empty-section h3,
.status-message strong {
  display: block;
  margin: 0 0 6px;
  color: #123b63;
}

.empty-section p,
.status-message p {
  margin: 0;
  font-size: 14px;
}


/* ================= FORMS ================= */

.form-grid {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 22px;

  margin-bottom: 22px;
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

  padding: 12px 13px;

  border: 1px solid #d1d5db;

  border-radius: 5px;

  font-size: 14px;

  background: white;

  outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus,
.subject-row input:focus {
  border-color: #123b63;

  box-shadow: 0 0 0 2px rgba(18, 59, 99, 0.08);
}

.full-width {
  margin-bottom: 22px;
}


/* ================= SUBJECTS ================= */

.card h3 {
  font-size: 16px;

  color: #374151;

  margin: 30px 0 12px;
}

.subjects-header {
  display: grid;

  grid-template-columns: 1fr 180px 100px;

  gap: 12px;

  font-size: 12px;

  color: #6b7280;

  font-weight: 600;

  margin-bottom: 8px;
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

.subject-suggestions {
  position: absolute;
  z-index: 2;
  top: calc(100% + 4px);
  right: 0;
  left: 0;
  max-height: 190px;
  overflow-y: auto;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  background: white;
  box-shadow: 0 5px 12px rgba(15, 23, 42, 0.12);
}

.subject-suggestion {
  display: block;
  width: 100%;
  padding: 10px 13px;
  border: 0;
  background: white;
  color: #374151;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}

.subject-suggestion:hover,
.subject-suggestion:focus {
  background: #eaf2f8;
  color: #123b63;
  outline: none;
}

.remove-btn {
  border: none;

  background: #fef2f2;

  color: #dc2626;

  border-radius: 5px;

  cursor: pointer;
}

.remove-btn:hover {
  background: #fee2e2;
}

.add-subject {
  margin-top: 8px;

  padding: 10px 15px;

  border: 1px solid #123b63;

  background: white;

  color: #123b63;

  border-radius: 5px;

  cursor: pointer;

  font-size: 13px;
}

.add-subject:hover {
  background: #f0f6fa;
}


/* ================= BUTTON ================= */

.bottom-actions {
  display: flex;

  justify-content: flex-end;

  margin-bottom: 50px;
}

.save-btn {
  padding: 13px 28px;

  border: none;

  border-radius: 5px;

  background: #123b63;

  color: white;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;
}

.save-btn:hover {
  background: #0d2d4b;
}


/* ================= RESPONSIVE ================= */

@media (max-width: 850px) {

  .sidebar {
    width: 210px;
  }

  .main-content {
    padding: 30px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 650px) {

  .top-header {
    padding: 0 20px;
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

}

</style>