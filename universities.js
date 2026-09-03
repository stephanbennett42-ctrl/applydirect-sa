/**
 * University and Service Data
 * Contains all static data for universities, testimonials, and payment plans.
 * In a full-stack implementation, this data would be fetched from a database API.
 */

// Partner universities with their details, programs, and application requirements
export const universities = [
  {
    id: 1,
    name: 'University of Cape Town (UCT)',
    shortName: 'UCT',
    logo: '🏛️',
    location: 'Rondebosch, Cape Town',
    founded: 1829,
    type: 'Public Research University',
    ranking: '#1 in Africa',
    website: 'https://www.uct.ac.za',
    color: '#003366',
    description: 'South Africa\'s oldest university and one of the leading research institutions in Africa, known for academic excellence and stunning campus on the slopes of Devil\'s Peak.',
    faculties: [
      'Commerce',
      'Engineering & Built Environment',
      'Health Sciences',
      'Humanities',
      'Law',
      'Science'
    ],
    programs: [
      { name: 'Bachelor of Commerce (BCom)', duration: '3 years', aps: 40 },
      { name: 'Bachelor of Commerce in Accounting (BCom Accounting)', duration: '3 years', aps: 42 },
      { name: 'Bachelor of Science (BSc)', duration: '3 years', aps: 38 },
      { name: 'Bachelor of Science in Engineering (BSc Eng)', duration: '4 years', aps: 44 },
      { name: 'Bachelor of Arts (BA)', duration: '3 years', aps: 34 },
      { name: 'Bachelor of Laws (LLB)', duration: '4 years', aps: 38 },
      { name: 'Bachelor of Medicine & Surgery (MBChB)', duration: '6 years', aps: 46 },
      { name: 'Bachelor of Health Sciences', duration: '3 years', aps: 40 },
      { name: 'Bachelor of Architectural Studies', duration: '3 years', aps: 38 },
      { name: 'Bachelor of Social Science', duration: '3 years', aps: 34 }
    ],
    applicationOpen: 'April 2026',
    applicationClose: 'July 31, 2026',
    requirements: [
      'National Senior Certificate (NSC) with Bachelor\'s degree endorsement',
      'Minimum APS score varies by program (34–46)',
      'English (Home Language or First Additional Language) — Level 4+',
      'Mathematics — Level 5+ (required for Commerce, Science, Engineering)',
      'Mathematical Literacy NOT accepted for most programs',
      'Physical Sciences required for Engineering and Health Sciences',
      'Some programs require National Benchmark Tests (NBTs)',
      'Selection interviews for Medicine and limited-access programs'
    ],
    contact: {
      phone: '+27 21 650 9111',
      email: 'admissions@uct.ac.za',
      website: 'https://www.uct.ac.za/main/student-administration/admissions'
    }
  },
  {
    id: 2,
    name: 'Stellenbosch University (SU)',
    shortName: 'Stellenbosch',
    logo: '🍷',
    location: 'Stellenbosch, Western Cape',
    founded: 1866,
    type: 'Public Research University',
    ranking: '#2 in South Africa',
    website: 'https://www.sun.ac.za',
    color: '#7B2D26',
    description: 'A leading research-intensive university situated in the picturesque town of Stellenbosch, known for its beautiful campus, wine lands setting, and academic tradition.',
    faculties: [
      'Arts & Social Sciences',
      'Economic & Management Sciences',
      'Education',
      'Engineering',
      'Law',
      'Medicine & Health Sciences',
      'Military Science',
      'Science',
      'Theology'
    ],
    programs: [
      { name: 'Bachelor of Commerce (BCom)', duration: '3 years', aps: 38 },
      { name: 'Bachelor of Commerce in Accounting', duration: '3 years', aps: 40 },
      { name: 'Bachelor of Science (BSc)', duration: '3 years', aps: 36 },
      { name: 'Bachelor of Engineering (BEng)', duration: '4 years', aps: 42 },
      { name: 'Bachelor of Education (BEd)', duration: '4 years', aps: 32 },
      { name: 'Bachelor of Arts (BA)', duration: '3 years', aps: 32 },
      { name: 'Bachelor of Medicine & Surgery (MBChB)', duration: '6 years', aps: 44 },
      { name: 'Bachelor of Laws (LLB)', duration: '4 years', aps: 38 },
      { name: 'Bachelor of Science in Dietetics', duration: '4 years', aps: 36 },
      { name: 'Bachelor of Theology (BTheol)', duration: '3 years', aps: 28 }
    ],
    applicationOpen: 'March 2026',
    applicationClose: 'June 30, 2026',
    requirements: [
      'National Senior Certificate (NSC) with Bachelor\'s degree endorsement',
      'Afrikaans or English — depending on program medium of instruction',
      'Minimum APS score varies by faculty (28–44)',
      'Mathematics — Level 4+ (required for Science, Engineering, Commerce)',
      'Physical Sciences required for Engineering and most Science programs',
      'Additional selection criteria for Medicine and limited-access programs',
      'Some programs require NBT results',
      'Selection tests for certain programs (e.g., Music, Drama)'
    ],
    contact: {
      phone: '+27 21 808 9111',
      email: 'info@sun.ac.za',
      website: 'https://www.sun.ac.za/english/prospective-students'
    }
  },
  {
    id: 3,
    name: 'University of the Western Cape (UWC)',
    shortName: 'UWC',
    logo: '🌍',
    location: 'Bellville, Cape Town',
    founded: 1960,
    type: 'Public University',
    ranking: 'Top 10 in SA',
    website: 'https://www.uwc.ac.za',
    color: '#006B3F',
    description: 'A university committed to equity and social justice, located in the northern suburbs of Cape Town, offering affordable quality education with a strong community focus.',
    faculties: [
      'Community & Health Sciences',
      'Dentistry',
      'Economic & Management Sciences',
      'Education',
      'Law',
      'Natural Sciences',
      'Arts'
    ],
    programs: [
      { name: 'Bachelor of Commerce (BCom)', duration: '3 years', aps: 32 },
      { name: 'Bachelor of Science (BSc)', duration: '3 years', aps: 30 },
      { name: 'Bachelor of Education (BEd)', duration: '4 years', aps: 28 },
      { name: 'Bachelor of Arts (BA)', duration: '3 years', aps: 28 },
      { name: 'Bachelor of Laws (LLB)', duration: '4 years', aps: 34 },
      { name: 'Bachelor of Pharmacy (BPharm)', duration: '4 years', aps: 36 },
      { name: 'Bachelor of Medicine & Surgery (MBChB)', duration: '6 years', aps: 40 },
      { name: 'Bachelor of Dentistry (BDS)', duration: '5 years', aps: 38 },
      { name: 'Bachelor of Nursing Science', duration: '4 years', aps: 32 },
      { name: 'Bachelor of Public Health', duration: '3 years', aps: 30 }
    ],
    applicationOpen: 'April 2026',
    applicationClose: 'September 30, 2026',
    requirements: [
      'National Senior Certificate (NSC) with Bachelor\'s degree endorsement',
      'English — Level 4 (language of instruction)',
      'Minimum APS of 28+ depending on program',
      'Mathematics — Level 4+ for Commerce, Science, and Health Sciences',
      'Physical Sciences required for Pharmacy, Dentistry, Medicine',
      'Some programs require interviews or aptitude tests',
      'Selection process for Health Sciences programs',
      'NBT results may be required for certain programs'
    ],
    contact: {
      phone: '+27 21 959 2911',
      email: 'admissions@uwc.ac.za',
      website: 'https://www.uwc.ac.za/prospective-students'
    }
  },
  {
    id: 4,
    name: 'Cape Peninsula University of Technology (CPUT)',
    shortName: 'CPUT',
    logo: '🔧',
    location: 'Bellville & Cape Town Campus',
    founded: 2005,
    type: 'University of Technology',
    ranking: 'Largest in the Western Cape',
    website: 'https://www.cput.ac.za',
    color: '#E31837',
    description: 'The largest university in the Western Cape, focused on vocational and occupational training with strong industry partnerships and practical, career-oriented programs.',
    faculties: [
      'Applied Sciences',
      'Business & Management Sciences',
      'Education & Social Sciences',
      'Engineering & the Built Environment',
      'Health & Wellness Sciences',
      'Informatics & Design'
    ],
    programs: [
      { name: 'National Diploma: Information Technology', duration: '3 years', aps: 28 },
      { name: 'National Diploma: Engineering (Civil)', duration: '3 years', aps: 30 },
      { name: 'National Diploma: Engineering (Electrical)', duration: '3 years', aps: 30 },
      { name: 'Bachelor of Business Administration (BBA)', duration: '3 years', aps: 28 },
      { name: 'National Diploma: Tourism Management', duration: '3 years', aps: 26 },
      { name: 'Bachelor of Education (BEd)', duration: '4 years', aps: 28 },
      { name: 'National Diploma: Graphic Design', duration: '3 years', aps: 26 },
      { name: 'Advanced Diploma: IT', duration: '1 year', aps: 30 },
      { name: 'National Diploma: Safety Management', duration: '3 years', aps: 26 },
      { name: 'Bachelor of Health Sciences (Biomedical Technology)', duration: '3 years', aps: 30 }
    ],
    applicationOpen: 'April 2026',
    applicationClose: 'September 30, 2026',
    requirements: [
      'National Senior Certificate (NSC) with Diploma or Bachelor\'s degree endorsement',
      'Minimum APS varies by program (26–30)',
      'English — Level 3+ (language of instruction)',
      'Mathematics or Mathematical Literacy — depending on program',
      'Some programs require a portfolio submission or practical assessment',
      'Work-integrated learning (WIL) components in most programs',
      'Selection process for limited-enrollment programs',
      'NC(V) qualifications also accepted for some programs'
    ],
    contact: {
      phone: '+27 21 959 6911',
      email: 'info@cput.ac.za',
      website: 'https://www.cput.ac.za/prospective-students'
    }
  }
]

// Student testimonials used on the Home page to build trust and social proof
export const testimonials = [
  {
    name: 'Thando M.',
    university: 'UCT - B.Com',
    text: 'UniApply made my university application process so stress-free. I didn\'t have to worry about missing deadlines or filling out the wrong forms. They handled everything!',
    rating: 5
  },
  {
    name: 'Zanele K.',
    university: 'Stellenbosch - B.Sc',
    text: 'I was overwhelmed by all the options and requirements. UniApply guided me through everything and I got accepted into my first choice program!',
    rating: 5
  },
  {
    name: 'Joshua P.',
    university: 'CPUT - IT Diploma',
    text: 'Best decision I made was going through UniApply. They knew exactly when applications opened and got mine in on time. Now I\'m studying what I love.',
    rating: 5
  }
]

// Available payment plans with pricing and feature lists
export const paymentPlans = [
  {
    id: 1,
    name: 'Standard',
    price: 'R 200',
    period: 'one-time',
    description: 'Application to one university',
    features: [
      'Application to 1 university',
      'Document verification',
      'Application submission',
      'Status tracking',
      'Email support'
    ],
    highlighted: true
  },
  {
    id: 2,
    name: 'Gold',
    price: 'R 320',
    period: 'one-time',
    description: 'Application to up to 3 universities',
    features: [
      'Application to up to 3 universities',
      'Document verification',
      'Application submission',
      'Status tracking',
      'Priority email & phone support',
      'Program matching assistance'
    ],
    highlighted: false
  },
  {
    id: 3,
    name: 'Premium',
    price: 'R 450',
    period: 'one-time',
    description: 'Application to up to 5 universities + career guidance',
    features: [
      'Application to up to 5 universities',
      'Document verification & optimization',
      'Application submission',
      'Real-time status tracking',
      'Dedicated advisor',
      'Career guidance session',
      'Job placement assistance after graduation'
    ],
    highlighted: false
  }
]