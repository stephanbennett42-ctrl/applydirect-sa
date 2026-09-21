<template>

  <div class="profile-page">

    <!-- ================= HEADER ================= -->

    <div class="page-layout">

      <aside class="sidebar">

        <div class="sidebar-title">

          My Application

        </div>

        <button

          class="sidebar-item"

          :class="{ active: activeSection === 'personal' }"

          type="button"

          @click="goToSection('personal')"

        >

          <span class="number">1</span>

          Personal Details

        </button>

        <button

          class="sidebar-item"

          :class="{ active: activeSection === 'academic' }"

          type="button"

          @click="goToSection('academic')"

        >

          <span class="number">2</span>

          Academic Details

        </button>

        <button

          class="sidebar-item"

          :class="{ active: activeSection === 'preferences' }"

          type="button"

          @click="goToSection('preferences')"

        >

          <span class="number">3</span>

          Study Preferences

        </button>

        <button

          class="sidebar-item"

          :class="{ active: activeSection === 'documents' }"

          type="button"

          @click="goToSection('documents')"

        >

          <span class="number">4</span>

          Documents

        </button>

        <button

          class="sidebar-item"

          :class="{ active: activeSection === 'status' }"

          type="button"

          @click="goToSection('status')"

        >

          <span class="number">5</span>

          Application Status

        </button>

      </aside>

      <div class="content-shell">

        <!-- HERO SECTION -->

        <section class="portfolio-hero">

          <div class="hero-overlay">

            <div class="hero-content">

              <p class="hero-small-title">🇿🇦 YOUR APPLICATION JOURNEY</p>

              <h1>Build your future, one step at a time.</h1>

              <p class="hero-description">

                Keep your personal and academic information in one place,

                discover study options, and make your university application journey easier.

              </p>

              <button class="hero-btn" @click="scrollToProfile">

                View My Profile

              </button>

            </div>

          </div>

        </section>

        <!-- ================= MAIN CONTENT ================= -->

        <main class="main-content">

        <div class="page-title">

          <h1>My Application Profile</h1>

          <p>

            Your profile is your starting point. Keep your details, results and study preferences up to date so you're ready for your next application step.

          </p>

          <p class="required-note">

            <span class="required-mark">*</span> indicates required fields

          </p>

          <p v-if="formMessage" class="form-message">

            {{ formMessage }}

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

              <p>

                Tell us about yourself.

              </p>

            </div>

          </div>



          <div class="form-grid">

            <div class="form-group">

              <label>First Name <span class="required-mark">*</span></label>

              <input

                type="text"

                v-model="profile.firstName"

                @blur="validateField('firstName')"

                @input="validateField('firstName')"

                placeholder="Enter your first name"

              />

            </div>



            <div class="form-group">

              <label>Surname <span class="required-mark">*</span></label>

              <input

                type="text"

                v-model="profile.surname"

                @blur="validateField('surname')"

                @input="validateField('surname')"

                placeholder="Enter your surname"

              />

            </div>



            <div class="form-group">

              <label>ID / Passport Number <span class="required-mark">*</span></label>

              <input

                type="text"

                v-model="profile.idNumber"

                @input="sanitizeIdNumber(); validateField('idNumber')"

                @blur="validateField('idNumber')"

                placeholder="Enter your ID or passport number"

                inputmode="numeric"

                maxlength="13"

                pattern="[0-9]*"

                required

              />

            </div>



            <div class="form-group">

              <label>Date of Birth <span class="required-mark">*</span></label>

              <input

                type="date"

                v-model="profile.dateOfBirth"

                @blur="validateField('dateOfBirth')"

                @input="validateField('dateOfBirth')"

              />

            </div>



            <div class="form-group">

              <label>Gender <span class="required-mark">*</span></label>

              <select

                v-model="profile.gender"

                @change="validateField('gender')"

              >

                <option value="">

                  Select gender

                </option>

                <option>Male</option>

                <option>Female</option>

                <option>Other</option>

              </select>

            </div>



            <div class="form-group">

              <label>Nationality <span class="required-mark">*</span></label>

              <select

                v-model="profile.nationality"

                @change="validateField('nationality')"

              >

                <option value="">

                  Select nationality

                </option>

                <option>South African</option>

                <option>Other</option>

              </select>

            </div>



            <div class="form-group">

              <label>Email Address <span class="required-mark">*</span></label>

              <input

                type="email"

                v-model="profile.email"

                @blur="validateField('email')"

                @input="validateField('email')"

                placeholder="example@email.com"

              />

            </div>



            <div class="form-group">

              <label>Phone Number <span class="required-mark">*</span></label>

              <input

                type="tel"

                v-model="profile.phone"

                @input="sanitizePhoneNumber(); validateField('phone')"

                @blur="validateField('phone')"

                placeholder="Enter your phone number"

                inputmode="numeric"

                maxlength="10"

                pattern="[0-9]*"

                required

              />

            </div>

          </div>



          <div class="form-group full-width">

            <label>Residential Address <span class="required-mark">*</span></label>

            <textarea

              v-model="profile.address"

              @blur="validateField('address')"

              @input="validateField('address')"

              placeholder="Enter your residential address"

              rows="3"

            ></textarea>

          </div>



          <div class="form-grid">

            <div class="form-group">

              <label>Province <span class="required-mark">*</span></label>

              <select

                v-model="profile.province"

                @change="validateField('province')"

              >

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

              <label>City / Town <span class="required-mark">*</span></label>

              <input

                type="text"

                v-model="profile.city"

                @blur="validateField('city')"

                @input="validateField('city')"

                placeholder="Enter your city or town"

              />

            </div>

          </div>



          <div class="card-actions">

            <button

              type="button"

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

              <p>

                Enter your school and academic information.

              </p>

            </div>

          </div>



          <div class="form-grid">

            <div class="form-group">

              <label>High School <span class="required-mark">*</span></label>

              <input

                type="text"

                v-model="profile.school"

                @blur="validateField('school')"

                @input="validateField('school')"

                placeholder="Enter your high school"

              />

            </div>



            <div class="form-group">

              <label>Matric Year <span class="required-mark">*</span></label>

              <select

                v-model="profile.matricYear"

                @change="validateField('matricYear')"

              >

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

              <label>Qualification <span class="required-mark">*</span></label>

              <select

                v-model="profile.qualification"

                @change="validateField('qualification')"

              >

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

              type="button"

              class="remove-btn"

              @click="removeSubject(index)"

            >

              Remove

            </button>

          </div>



          <button

            type="button"

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

                Preferred Field of Study <span class="required-mark">*</span>

              </label>

              <select

                v-model="profile.field"

                @change="validateField('field')"

              >

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

                Preferred Province <span class="required-mark">*</span>

              </label>

              <select

                v-model="profile.preferredProvince"

                @change="validateField('preferredProvince')"

              >

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



          <!-- ================= COURSE SUGGESTIONS ================= -->

          <div class="course-suggestion-section">

            <h3>Course Suggestions</h3>

            <p class="course-description">

              Enter your preferred field and your subject marks,

              then we can suggest courses that may suit you.

            </p>



            <button

              type="button"

              class="suggest-button"

              @click="suggestCourses"

            >

              Find Suggested Courses

            </button>



            <div

              v-if="courseSuggestions.length > 0"

              class="course-results"

            >

              <h4>

                Courses You May Be Interested In

              </h4>



              <p class="course-note">

                These are general suggestions based on the

                information you provided. University admission

                requirements may differ.

              </p>



              <div

                v-for="(course, index) in courseSuggestions"

                :key="index"

                class="course-card"

              >

                <div class="course-card-content">

                  <h5>

                    {{ course }}

                  </h5>

                  <p>

                    This course matches your preferred

                    field of study and academic interests.

                  </p>

                </div>



                <button

                  type="button"

                  class="explore-course-button"

                >

                  Explore Course

                </button>

              </div>

            </div>



            <div

              v-else-if="courseSearchAttempted"

              class="no-course-results"

            >

              <p>

                Please select a preferred field of study

                to get course suggestions.

              </p>

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

        All documents must be in PDF format.

      </p>

    </div>

  </div>



  <div class="document-notice">

    <span class="notice-icon">i</span>

    <p>

      Please upload clear PDF documents only.

      JPG, PNG, DOC and DOCX files are not accepted.

      The maximum file size is 5 MB.

    </p>

  </div>



  <div class="document-list">

    <!-- ID / PASSPORT -->

    <div class="document-item">

      <div class="document-information">

        <strong>ID / Passport</strong>

        <p>PDF only · Maximum size: 5 MB</p>

        <p

          v-if="documentMessages.id"

          :class="[

            'document-message',

            documentMessages.id.type

          ]"

        >

          {{ documentMessages.id.message }}

        </p>

      </div>

      <label class="upload-btn">

        <span>Upload PDF</span>

        <input

          type="file"

          accept=".pdf,application/pdf"

          hidden

          @change="validateDocument($event, 'id')"

        />

      </label>

    </div>



    <!-- MATRIC RESULTS -->

    <div class="document-item">

      <div class="document-information">

        <strong>Matric Results</strong>

        <p>PDF only · Maximum size: 5 MB</p>

        <p

          v-if="documentMessages.matric"

          :class="[

            'document-message',

            documentMessages.matric.type

          ]"

        >

          {{ documentMessages.matric.message }}

        </p>

      </div>

      <label class="upload-btn">

        <span>Upload PDF</span>

        <input

          type="file"

          accept=".pdf,application/pdf"

          hidden

          @change="validateDocument($event, 'matric')"

        />

      </label>

    </div>



    <!-- PROOF OF ADDRESS -->

    <div class="document-item">

      <div class="document-information">

        <strong>Proof of Address</strong>

        <p>PDF only · Maximum size: 5 MB</p>

        <p

          v-if="documentMessages.address"

          :class="[

            'document-message',

            documentMessages.address.type

          ]"

        >

          {{ documentMessages.address.message }}

        </p>

      </div>

      <label class="upload-btn">

        <span>Upload PDF</span>

        <input

          type="file"

          accept=".pdf,application/pdf"

          hidden

          @change="validateDocument($event, 'address')"

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



        <!-- ================= SAVE ================= -->

        <div class="bottom-actions">

          <button

            type="button"

            class="save-btn"

            @click="saveProfile"

          >

            Save Profile

          </button>

        </div>

        </main>

      </div>

    </div>

  </div>

</template>



<script>

export default {

  name: "Portfolio",



  data() {

    return {

      profileId: null,

      activeSection: "personal",

      formMessage: "",

      formErrors: {

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

        preferredProvince: ""

      },



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



      activeSubjectIndex: null,

     documents: {

      id: null,

      matric: null,

      address: null

     },

     documentMessages: {

      id: null,

      matric: null,

      address: null

    },



      // Stores the suggested courses

      courseSuggestions: [],



      // Lets us know if the user clicked

      // the suggestion button

      courseSearchAttempted: false

    };

  },



  // =========================

  // PAGE LOADED

  // =========================

  mounted() {

    this.getProfile();

  },



  // =========================

  // COMPUTED

  // =========================

  computed: {

    // Show the user's first name when available, otherwise use a neutral label.
    profileDisplayName() {

      return this.profile.firstName.trim() || "My Profile";

    },

    // Owam uses OG by default; other users receive their first and surname initials.
    profileInitials() {

      const firstName =

        this.profile.firstName.trim();



      const surname =

        this.profile.surname.trim();



      if (firstName.toLowerCase() === "owam") {

        return `O${surname.charAt(0) || "G"}`.toUpperCase();

      }

      if (!firstName && !surname) {

        return "--";

      }



      return (

        `${firstName.charAt(0)}${surname.charAt(0)}`

      ).toUpperCase();

    }

  },



  // =========================

  // VALIDATION

  // =========================

  methods: {

    scrollToProfile() {

      const profileSection = document.querySelector(".main-content");

      if (profileSection) {

        profileSection.scrollIntoView({

          behavior: "smooth"

        });

      }

    },

    setFormMessage(message) {

      this.formMessage = message;

    },

    sanitizeIdNumber() {

      this.profile.idNumber = String(this.profile.idNumber || "").replace(/\D/g, "").slice(0, 13);

    },

    sanitizePhoneNumber() {

      let digits = String(this.profile.phone || "").replace(/\D/g, "");

      if (digits && !digits.startsWith("0")) {

        digits = "0" + digits.replace(/^0+/, "");

      }

      this.profile.phone = digits.slice(0, 10);

    },

    setFieldError(field, message) {

      this.formErrors[field] = message;

    },

    validateField(field) {

      const value = this.profile[field];

      if (field === "firstName" || field === "surname" || field === "address" || field === "city" || field === "school") {

        if (!String(value || "").trim()) {

          this.setFieldError(field, "This field is required.");

          return false;

        }

        this.setFieldError(field, "");

        return true;

      }

      if (field === "idNumber") {

        if (!String(value || "").trim()) {

          this.setFieldError(field, "ID number is required.");

          return false;

        }

        if (!/^\d{13}$/.test(String(value).trim())) {

          this.setFieldError(field, "ID number must be exactly 13 digits.");

          return false;

        }

        this.setFieldError(field, "");

        return true;

      }

      if (field === "phone") {

        if (!String(value || "").trim()) {

          this.setFieldError(field, "Phone number is required.");

          return false;

        }

        if (!/^0\d{9}$/.test(String(value).trim())) {

          this.setFieldError(field, "Cell number must have 10 digits and start with 0.");

          return false;

        }

        this.setFieldError(field, "");

        return true;

      }

      if (field === "email") {

        if (!String(value || "").trim()) {

          this.setFieldError(field, "Email is required.");

          return false;

        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())) {

          this.setFieldError(field, "Enter a valid email address.");

          return false;

        }

        this.setFieldError(field, "");

        return true;

      }

      if (field === "dateOfBirth" || field === "gender" || field === "nationality" || field === "province" || field === "matricYear" || field === "qualification" || field === "field" || field === "preferredProvince") {

        if (!value || !String(value).trim()) {

          this.setFieldError(field, "Please select an option.");

          return false;

        }

        this.setFieldError(field, "");

        return true;

      }

      this.setFieldError(field, "");

      return true;

    },

    validateIdNumber() {

      return /^\d{13}$/.test(this.profile.idNumber.trim());

    },

    validatePhoneNumber() {

      return /^0\d{9}$/.test(this.profile.phone.trim());

    },

    validateEmail() {

      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.profile.email.trim());

    },

    validatePersonalDetails() {

      const requiredFields = [

        { key: "firstName", label: "First name" },

        { key: "surname", label: "Surname" },

        { key: "idNumber", label: "ID number" },

        { key: "dateOfBirth", label: "Date of birth" },

        { key: "gender", label: "Gender" },

        { key: "nationality", label: "Nationality" },

        { key: "email", label: "Email" },

        { key: "phone", label: "Phone number" },

        { key: "address", label: "Address" },

        { key: "province", label: "Province" },

        { key: "city", label: "City" }

      ];

      let valid = true;

      requiredFields.forEach(field => {

        if (!this.validateField(field.key)) {

          valid = false;

        }

      });

      if (valid) {

        this.setFormMessage("");

      }

      return valid;

    },

    validateAcademicDetails() {

      let valid = true;

      if (!this.validateField("school")) valid = false;

      if (!this.validateField("matricYear")) valid = false;

      if (!this.validateField("qualification")) valid = false;

      if (!this.profile.subjects.length || this.profile.subjects.some(subject => !subject.name.trim() || !String(subject.mark).trim())) {

        this.setFormMessage("Please complete all subject names and marks before continuing.");

        valid = false;

      }

      if (valid) {

        this.setFormMessage("");

      }

      return valid;

    },

    validatePreferences() {

      let valid = true;

      if (!this.validateField("field")) valid = false;

      if (!this.validateField("preferredProvince")) valid = false;

      if (valid) {

        this.setFormMessage("");

      }

      return valid;

    },

    canAccessSection(section) {

      return true;

    },

    goToSection(section) {

      this.activeSection = section;

    },

    validateBeforeSave() {

      if (this.activeSection === "personal") {

        return this.validatePersonalDetails();

      }

      if (this.activeSection === "academic") {

        return this.validateAcademicDetails();

      }

      if (this.activeSection === "preferences") {

        return this.validatePreferences();

      }

      return true;

    },



    // =========================

    // SUBJECT METHODS

    // =========================

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



    validateDocument(event, documentType) {

    const file = event.target.files[0];

    if (!file) {

     return;

    }

  // Maximum file size: 5 MB

    const maxFileSize = 5 * 1024 * 1024;

  // Check whether the file is a PDF

    const isPDF =

     file.type === "application/pdf" ||

     file.name.toLowerCase().endsWith(".pdf");

  // Reject files that are not PDF

  if (!isPDF) {

    this.documents[documentType] = null;

    this.documentMessages[documentType] = {

      type: "error-message",

      message: "Invalid file. Please upload a PDF document only."

    };

    // Clear the selected file

    event.target.value = "";

    return;

  }

  // Check file size

  if (file.size > maxFileSize) {

    this.documents[documentType] = null;

    this.documentMessages[documentType] = {

      type: "error-message",

      message: "File is too large. Please upload a PDF smaller than 5 MB."

    };

    event.target.value = "";

    return;

  }

  // Save the valid file

  this.documents[documentType] = file;

  this.documentMessages[documentType] = {

    type: "success-message",

    message: `${file.name} uploaded successfully.`

  };

},



    // =========================

    // COURSE SUGGESTIONS

    // =========================

    suggestCourses() {

      const field =

        this.profile.field.trim().toLowerCase();



      this.courseSearchAttempted = true;



      const subjects =

        this.profile.subjects;



      const suggestions = [];



      // Check Mathematics

      const mathematics =

        subjects.find(subject =>

          subject.name.toLowerCase() === "mathematics"

        );



      const mathematicsMark =

        mathematics

          ? Number(mathematics.mark)

          : 0;



      // Check English

      const english =

        subjects.find(subject =>

          subject.name.toLowerCase() === "english"

        );



      const englishMark =

        english

          ? Number(english.mark)

          : 0;



      // =========================

      // INFORMATION TECHNOLOGY

      // =========================

      if (

        field.includes("information technology") ||

        field.includes("computer science")

      ) {

        if (

          mathematicsMark >= 50 &&

          englishMark >= 40

        ) {

          suggestions.push(

            "Bachelor of Information Technology",

            "Bachelor of Computer Science",

            "Diploma in Information Technology",

            "Diploma in Software Development"

          );

        } else {

          suggestions.push(

            "Diploma in Information Technology",

            "Diploma in Software Development",

            "Higher Certificate in Information Technology"

          );

        }

      }



      // =========================

      // ACCOUNTING

      // =========================

      else if (

        field.includes("accounting")

      ) {

        if (mathematicsMark >= 50) {

          suggestions.push(

            "Bachelor of Accounting",

            "Bachelor of Commerce in Accounting",

            "Diploma in Accounting",

            "Higher Certificate in Accounting"

          );

        } else {

          suggestions.push(

            "Diploma in Accounting",

            "Higher Certificate in Accounting"

          );

        }

      }



      // =========================

      // BUSINESS

      // =========================

      else if (

        field.includes("business")

      ) {

        suggestions.push(

          "Bachelor of Business Administration",

          "Bachelor of Commerce",

          "Diploma in Business Management",

          "Diploma in Financial Management"

        );

      }



      // =========================

      // ENGINEERING

      // =========================

      else if (

        field.includes("engineering")

      ) {

        if (mathematicsMark >= 60) {

          suggestions.push(

            "Bachelor of Engineering",

            "Diploma in Civil Engineering",

            "Diploma in Electrical Engineering",

            "Diploma in Mechanical Engineering"

          );

        } else {

          suggestions.push(

            "Engineering Foundation Programme",

            "Engineering Higher Certificate"

          );

        }

      }



      // =========================

      // NURSING

      // =========================

      else if (

        field.includes("nursing")

      ) {

        suggestions.push(

          "Bachelor of Nursing",

          "Diploma in Nursing",

          "Higher Certificate in Nursing"

        );

      }



      // =========================

      // TEACHING

      // =========================

      else if (

        field.includes("teaching")

      ) {

        suggestions.push(

          "Bachelor of Education",

          "Diploma in Grade R Teaching",

          "Higher Certificate in Education"

        );

      }



      // =========================

      // LAW

      // =========================

      else if (

        field.includes("law")

      ) {

        suggestions.push(

          "Bachelor of Laws",

          "Diploma in Law",

          "Higher Certificate in Criminal Justice"

        );

      }



      // =========================

      // OTHER

      // =========================

      else if (field !== "") {

        suggestions.push(

          `Explore ${this.profile.field}-related courses`

        );

      }



      this.courseSuggestions =

        suggestions;

    },



    // =========================

    // GET PROFILE

    // =========================

    async getProfile() {

      try {

        const response = await fetch(

          "http://localhost:3000/api/portfolio/1"

        );



        const data =

          await response.json();



        if (!response.ok) {

          console.error(data.message);

          return;

        }

        this.profileId = data.profile.profile_id;



        // =========================

        // PERSONAL DETAILS

        // =========================

        this.profile.firstName =

          data.profile.first_name || "";



        this.profile.surname =

          data.profile.last_name || "";



        this.profile.email =

          data.profile.email || "";



        this.profile.phone =

          data.profile.phone || "";



        this.profile.dateOfBirth =

          data.profile.date_of_birth

            ? data.profile.date_of_birth.substring(0, 10)

            : "";



        this.profile.address =

          data.profile.address || "";



        this.profile.province =

          data.profile.province || "";



        // =========================

        // ACADEMIC DETAILS

        // =========================

        this.profile.school =

          data.profile.school_name || "";



        this.profile.matricYear =

          data.profile.matric_year

            ? String(data.profile.matric_year)

            : "";



        // =========================

        // SUBJECTS

        // =========================

        if (

          data.subjects &&

          data.subjects.length > 0

        ) {

          this.profile.subjects =

            data.subjects.map(subject => ({

              name:

                subject.subject_name || "",

              mark:

                subject.mark || ""

            }));

        } else {

          this.profile.subjects = [

            {

              name: "",

              mark: ""

            }

          ];

        }

      } catch (error) {

        console.error(

          "Error loading profile:",

          error

        );

      }

    },



    // =========================

    // SAVE / UPDATE PROFILE

    // =========================

    async saveProfile() {

      if (!this.validateBeforeSave()) {

        return;

      }

      try {

        const profileData = {

          student_id: 1,

          first_name: this.profile.firstName,

          last_name: this.profile.surname,

          email: this.profile.email,

          phone: this.profile.phone,

          date_of_birth: this.profile.dateOfBirth || null,

          address: this.profile.address,

          province: this.profile.province,

          school_name: this.profile.school,

          matric_year: this.profile.matricYear || null,

          bio: "",

          profile_picture: "",

          subjects: this.profile.subjects

            .filter(subject => subject.name)

            .map(subject => ({

              subject_name: subject.name,

              mark: subject.mark || null,

              grade: ""

            }))

        };

        let response;

        // CREATE NEW PROFILE

        if (!this.profileId) {

          response = await fetch("http://localhost:3000/api/portfolio", {

            method: "POST",

            headers: {

              "Content-Type": "application/json"

            },

            body: JSON.stringify(profileData)

          });

        }

        // UPDATE EXISTING PROFILE

        else {

          response = await fetch(

            `http://localhost:3000/api/portfolio/${this.profileId}`,

            {

              method: "PUT",

              headers: {

                "Content-Type": "application/json"

              },

              body: JSON.stringify(profileData)

            }

          );

        }

        const data = await response.json();

        if (!response.ok) {

          throw new Error(data.message || "Could not save profile");

        }

        if (data.profile_id) {

          this.profileId = data.profile_id;

        }

        alert(data.message);

      } catch (error) {

        console.error("Save error:", error);

        alert("Could not connect to the server.");

      }

    }

  }

};

</script>



<style scoped>
/* =========================================
   APPLYDIRECT-SA PROFILE
   Youthful South African visual system
========================================= */

* { box-sizing: border-box; }

.profile-page {
  --navy: #001b5e;
  --navy-dark: #001242;
  --green: #007a3d;
  --green-dark: #005c2d;
  --gold: #ffb81c;
  --red: #de3831;
  --blue: #002395;
  --ink: #12233f;
  --muted: #6b7785;
  --surface: #ffffff;
  --soft: #f5f7fb;
  min-height: 100vh;
  background: #f4f6f9;
  color: var(--ink);
  font-family: "DM Sans", "Segoe UI", Arial, sans-serif;
}

/* ================= HEADER ================= */
.top-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--navy-dark);
  box-shadow: 0 6px 24px rgba(0, 18, 66, 0.22);
}

.top-header > .navbar {
  min-height: 74px;
}

.top-header .container-fluid {
  min-height: 74px;
}

.navbar-brand {
  letter-spacing: -0.5px;
}

.bg-navy { background-color: var(--navy-dark) !important; }
.text-gold { color: var(--gold) !important; }

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

/* Active navigation follows the group's SA colour system.
  Exact matching prevents the Universities link from staying active on Profile. */
.sa-nav-tab.tab-green.router-link-exact-active,
.sa-nav-tab.tab-green.active { background: var(--green) !important; box-shadow: 0 5px 16px rgba(0, 122, 61, 0.4); }
.sa-nav-tab.tab-gold.router-link-exact-active,
.sa-nav-tab.tab-gold.active { background: var(--gold) !important; color: #101010 !important; box-shadow: 0 5px 16px rgba(255, 184, 28, 0.4); }
.sa-nav-tab.tab-red.router-link-exact-active,
.sa-nav-tab.tab-red.active { background: var(--red) !important; box-shadow: 0 5px 16px rgba(222, 56, 49, 0.4); }
.sa-nav-tab.tab-blue.router-link-exact-active,
.sa-nav-tab.tab-blue.active { background: var(--blue) !important; box-shadow: 0 5px 16px rgba(0, 35, 149, 0.4); }
.sa-nav-tab.tab-black.router-link-exact-active,
.sa-nav-tab.tab-black.active { background: #191919 !important; box-shadow: 0 5px 16px rgba(0, 0, 0, 0.4); }

/* ================= PAGE LAYOUT ================= */
.page-layout {
  display: flex;
  min-height: calc(100vh - 74px);
}

.content-shell {
  flex: 1;
  min-width: 0;
}

/* ================= SIDEBAR ================= */
.sidebar {
  width: 255px;
  flex-shrink: 0;
  min-height: calc(100vh - 74px);
  padding: 28px 18px;
  background: var(--navy-dark);
  color: #fff;
  border-right: 1px solid rgba(255,255,255,0.08);
}

.sidebar-title {
  margin: 4px 10px 18px;
  color: var(--gold);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.sidebar-item {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  padding: 12px 11px;
  border: 1px solid transparent;
  border-radius: 13px;
  background: transparent;
  color: rgba(255,255,255,0.72);
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: 0.2s ease;
}

.sidebar-item:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
  transform: translateX(3px);
}

.sidebar-item.active {
  background: var(--green);
  color: #fff;
  border-color: rgba(255,255,255,0.12);
  font-weight: 800;
  box-shadow: 4px 4px 0 var(--gold);
  transform: translateX(2px);
}

.number {
  width: 31px;
  height: 31px;
  min-width: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.22);
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.sidebar-item.active .number {
  background: var(--gold);
  border-color: var(--gold);
  color: #102039;
}

/* ================= HERO ================= */
.portfolio-hero {
  position: relative;
  min-height: 360px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background:
    linear-gradient(120deg, rgba(0, 18, 66, 0.96), rgba(0, 27, 94, 0.78)),
    url("https://i.ibb.co/7dd2SKdH/OIP-2.jpg") center / cover no-repeat;
}

.portfolio-hero::after {
  content: "";
  position: absolute;
  width: 220px;
  height: 220px;
  right: 7%;
  top: 50%;
  transform: translateY(-50%);
  border: 35px solid rgba(255,184,28,0.14);
  border-radius: 50%;
}

.hero-overlay {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 58px 7%;
}

.hero-content {
  max-width: 980px;
  margin: 0 auto;
  color: #fff;
}

.hero-small-title {
  display: inline-flex;
  width: fit-content;
  margin: 0 0 14px;
  padding: 7px 13px;
  border-radius: 999px;
  background: var(--gold);
  color: #14223b;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1px;
}

.hero-content h1 {
  max-width: 760px;
  margin: 0 0 14px;
  font-size: clamp(36px, 5vw, 58px);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -1.8px;
}

.hero-description {
  max-width: 650px;
  margin: 0 0 25px;
  color: rgba(255,255,255,0.84);
  font-size: 16px;
  line-height: 1.7;
}

.hero-btn {
  padding: 12px 22px;
  border: 0;
  border-radius: 999px;
  background: var(--green);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 4px 4px 0 var(--gold);
  transition: 0.2s ease;
}

.hero-btn:hover {
  background: #00954a;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--gold);
}

/* ================= MAIN CONTENT ================= */
.main-content {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(34px, 5vw, 58px) clamp(20px, 5vw, 55px);
}

.page-title {
  margin-bottom: 28px;
}

.page-title h1 {
  margin: 0;
  color: var(--navy-dark);
  font-size: clamp(30px, 4vw, 43px);
  font-weight: 900;
  letter-spacing: -1.2px;
  line-height: 1.08;
}

.page-title h1::before {
  content: "";
  display: block;
  width: 48px;
  height: 5px;
  margin-bottom: 13px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--green) 0 50%, var(--gold) 50% 75%, var(--red) 75%);
}

.page-title p {
  max-width: 700px;
  margin: 9px 0 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.6;
}

.required-note {
  margin-top: 8px !important;
  font-size: 12px !important;
  font-weight: 700;
}

.form-message {
  margin-top: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  background: #fff3f1;
  color: var(--red);
  font-size: 13px;
  font-weight: 700;
}

.required-mark { color: var(--red); font-weight: 900; }

/* ================= CARDS ================= */
.card {
  position: relative;
  margin-bottom: 22px;
  padding: clamp(22px, 3vw, 31px);
  background: var(--surface);
  border: 1px solid #e2e7ee;
  border-radius: 20px;
  box-shadow: 0 14px 35px rgba(0, 18, 66, 0.07);
  overflow: visible;
}

.card::before {
  content: "";
  display: block;
  width: 74px;
  height: 5px;
  margin-bottom: 22px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--green) 0 52%, var(--gold) 52% 76%, var(--red) 76%);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding-bottom: 17px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e8edf2;
}

.section-header h2 {
  margin: 0;
  color: var(--navy-dark);
  font-size: 23px;
  font-weight: 900;
}

.section-header p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
}

/* ================= FORMS ================= */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 18px;
}

.form-group { display: flex; flex-direction: column; }

.form-group label {
  margin-bottom: 7px;
  color: #263750;
  font-size: 13px;
  font-weight: 800;
}

.form-group input,
.form-group select,
.form-group textarea,
.subject-row input {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #d7dee8;
  border-radius: 11px;
  background: #fbfcfe;
  color: #1c2c43;
  font-size: 14px;
  outline: none;
  transition: border 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus,
.subject-row input:focus {
  border-color: var(--green);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(0,122,61,0.10);
  transform: translateY(-1px);
}

.form-group input::placeholder,
.form-group textarea::placeholder,
.subject-row input::placeholder { color: #9aa5b3; }

.full-width { margin-bottom: 18px; }

/* ================= BUTTONS ================= */
.card-actions,
.bottom-actions { display: flex; justify-content: flex-end; }
.card-actions { margin-top: 22px; }
.bottom-actions { margin-top: 5px; padding-bottom: 20px; }

.save-btn,
.suggest-button {
  padding: 12px 23px;
  border: 0;
  border-radius: 999px;
  background: var(--green);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 4px 4px 0 var(--gold);
  transition: 0.2s ease;
}

.save-btn:hover,
.suggest-button:hover {
  background: var(--green-dark);
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--gold);
}

/* ================= SUBJECTS ================= */
.card h3 {
  margin: 27px 0 13px;
  color: var(--navy-dark);
  font-size: 17px;
  font-weight: 900;
}

.subjects-header,
.subject-row {
  display: grid;
  grid-template-columns: 1fr 180px 100px;
  gap: 12px;
}

.subjects-header {
  margin-bottom: 8px;
  color: #718096;
  font-size: 12px;
  font-weight: 800;
}

.subject-row { margin-bottom: 10px; }
.subject-autocomplete { position: relative; }

.subject-suggestions {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  z-index: 50;
  max-height: 180px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #d7dee8;
  border-radius: 11px;
  box-shadow: 0 14px 30px rgba(0,18,66,0.14);
}

.subject-suggestion {
  width: 100%;
  padding: 10px 12px;
  border: 0;
  background: #fff;
  color: #263750;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
}

.subject-suggestion:hover { background: #edf8f2; color: var(--green-dark); }

.remove-btn {
  border: 1px solid #f1cbc8;
  border-radius: 10px;
  background: #fff4f3;
  color: var(--red);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.remove-btn:hover { background: #ffe5e2; }

.add-subject {
  margin-top: 8px;
  padding: 10px 15px;
  border: 1px solid var(--green);
  border-radius: 999px;
  background: #eff9f3;
  color: var(--green-dark);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.add-subject:hover {
  background: var(--gold);
  border-color: var(--gold);
  color: #15213a;
}

/* ================= COURSE SUGGESTIONS ================= */
.course-suggestion-section {
  margin-top: 34px;
  padding-top: 25px;
  border-top: 1px solid #e8edf2;
}

.course-suggestion-section h3 { margin-top: 0; color: var(--green-dark); }

.course-description,
.course-note {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
}

.course-description { margin-bottom: 18px; }
.course-results { margin-top: 28px; }
.course-results h4 { margin-bottom: 8px; color: var(--navy-dark); font-size: 18px; font-weight: 900; }
.course-note { margin-bottom: 18px; }

.course-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 12px;
  padding: 18px;
  border: 1px solid #e0e6ee;
  border-left: 4px solid var(--gold);
  border-radius: 14px;
  background: #fbfcfe;
  transition: 0.2s ease;
}

.course-card:hover {
  border-left-color: var(--green);
  transform: translateY(-2px);
  box-shadow: 0 9px 22px rgba(0,18,66,0.08);
}

.course-card-content { flex: 1; }
.course-card h5 { margin: 0 0 6px; color: var(--navy-dark); font-size: 15px; font-weight: 900; }
.course-card p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.5; }

.explore-course-button {
  flex-shrink: 0;
  padding: 9px 16px;
  border: 1px solid var(--blue);
  border-radius: 999px;
  background: #fff;
  color: var(--blue);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.explore-course-button:hover { background: var(--blue); color: #fff; }

.no-course-results {
  margin-top: 20px;
  padding: 15px;
  border-left: 4px solid var(--gold);
  border-radius: 10px;
  background: #fff9e7;
  color: #6e5a1d;
  font-size: 13px;
}

/* ================= DOCUMENTS ================= */
.document-notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 22px;
  padding: 15px 18px;
  border-left: 4px solid var(--gold);
  border-radius: 11px;
  background: #fff9e7;
}

.notice-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  min-width: 23px;
  border-radius: 50%;
  background: var(--gold);
  color: #17233a;
  font-size: 13px;
  font-weight: 900;
}

.document-notice p { margin: 0; color: #5f563c; font-size: 13px; line-height: 1.6; }
.document-list { display: flex; flex-direction: column; gap: 13px; }

.document-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 22px;
  border: 1px solid #e0e6ee;
  border-radius: 14px;
  background: #fbfcfe;
  transition: 0.2s ease;
}

.document-item:hover {
  border-color: rgba(0,122,61,0.4);
  box-shadow: 0 8px 20px rgba(0,18,66,0.07);
  transform: translateY(-2px);
}

.document-information { min-width: 0; }
.document-information strong { display: block; margin-bottom: 6px; color: var(--navy-dark); font-size: 16px; font-weight: 900; }
.document-information > p:not(.document-message) { margin: 0; color: var(--muted); font-size: 13px; }

.upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--green);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.upload-btn:hover { background: var(--green-dark); transform: translateY(-2px); }

.document-message { margin-top: 8px !important; font-size: 13px !important; font-weight: 800; line-height: 1.4; }
.error-message { color: var(--red) !important; }
.success-message { color: var(--green) !important; }

/* ================= STATUS ================= */
.status-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  border: 1px solid rgba(0,122,61,0.18);
  border-radius: 15px;
  background: linear-gradient(135deg, #eef9f3, #f9fcfa);
}

.status-circle {
  width: 48px;
  height: 48px;
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--green);
  color: #fff;
  font-weight: 900;
  box-shadow: 4px 4px 0 var(--gold);
}

.status-box strong { color: var(--green-dark); font-size: 16px; font-weight: 900; }
.status-box p { margin: 5px 0 0; color: var(--muted); font-size: 13px; line-height: 1.5; }

/* ================= RESPONSIVE ================= */
@media (max-width: 1100px) {
  .main-content { padding: 34px 30px; }
}

@media (max-width: 850px) {
  .sidebar { width: 215px; }
  .form-grid { grid-template-columns: 1fr; }
  .main-content { padding: 30px 22px; }
  .course-card { align-items: flex-start; flex-direction: column; }
  .explore-course-button { width: 100%; }
}

@media (max-width: 650px) {
  /* Keep the account indicator readable when the navigation stacks vertically. */
  .top-header .navbar-collapse { margin-left: 0; }
  .top-header .navbar-nav { margin-left: 0; }
  .profile-account {
    justify-content: center;
    margin: 8px 0 0;
    padding: 12px 0 0;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-left: 0;
  }
  .sidebar { display: none; }
  .main-content { padding: 25px 16px; }
  .portfolio-hero { min-height: 330px; }
  .hero-overlay { padding: 45px 24px; }
  .hero-content h1 { font-size: 35px; letter-spacing: -1px; }
  .hero-description { font-size: 14px; }
  .card { padding: 21px; border-radius: 16px; }
  .subject-row, .subjects-header { grid-template-columns: 1fr; }
  .remove-btn { padding: 10px; }
  .document-item { align-items: flex-start; flex-direction: column; gap: 15px; }
  .upload-btn { width: 100%; }
  .bottom-actions, .card-actions { justify-content: stretch; }
  .save-btn, .suggest-button { width: 100%; }
  .status-box { align-items: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  .sa-nav-tab, .sidebar-item, .save-btn, .suggest-button, .add-subject,
  .document-item, .form-group input, .form-group select, .form-group textarea,
  .subject-row input, .hero-btn, .course-card { transition: none; }
}
</style>
