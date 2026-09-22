<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <span class="hero-eyebrow">ApplyDirect SA</span>
          <h1>Your Gateway to Cape Town Universities</h1>
          <p>
            We handle your university applications so you can focus on your
            future. Choose a plan, pay securely, and let us do the rest.
          </p>
          <div class="hero-actions">
            <router-link to="/payment-plan" class="btn btn-primary btn-lg"
              >View Payment Plans</router-link
            >
            <router-link to="/login" class="btn btn-ghost btn-lg"
              >Log In</router-link
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="container">
        <div class="section-head">
          <h2>Why choose ApplyDirect SA?</h2>
          <p>
            Everything you need to apply to universities across South Africa.
          </p>
        </div>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M22 10L12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
              </svg>
            </div>
            <h3>Document Verification</h3>
            <p>
              Every document is checked and verified before submission to the
              university.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3>Application Submission</h3>
            <p>
              We submit your complete application to the universities you
              choose.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3>Real-Time Tracking</h3>
            <p>
              Follow your application status from submission to acceptance — in
              real time.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-head">
          <h2>How it works</h2>
          <p>Three simple steps and you're on your way.</p>
        </div>
        <div class="steps">
          <div class="step">
            <span class="step-num">1</span>
            <h3>Create an account</h3>
            <p>Sign up in under a minute with your details.</p>
          </div>
          <div class="step">
            <span class="step-num">2</span>
            <h3>Choose a plan</h3>
            <p>
              Pick the plan that matches how many universities you want to apply
              to.
            </p>
          </div>
          <div class="step">
            <span class="step-num">3</span>
            <h3>Pay &amp; apply</h3>
            <p>Pay securely online — we take it from there.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container cta-inner">
        <h2>Ready to start your university journey?</h2>
        <p>Join hundreds of students who applied through ApplyDirect SA.</p>
        <router-link to="/register" class="btn btn-light btn-lg"
          >Create Free Account</router-link
        >
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
.home-page {
  background: var(--bg-subtle);
}

/* Hero */
.hero {
  background:
    linear-gradient(
      118deg,
      rgba(4, 18, 67, 0.98) 0%,
      rgba(8, 43, 118, 0.96) 48%,
      rgba(24, 78, 167, 0.98) 100%
    ),
    radial-gradient(
      circle at 82% 20%,
      rgba(74, 132, 224, 0.35),
      transparent 34%
    );
  color: var(--text-white);
  padding: 96px 0;
}

.hero-inner {
  max-width: 720px;
}

.hero-eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--gold-light);
  border: 1px solid rgba(255, 184, 28, 0.4);
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 20px;
}

.hero h1 {
  color: #ffffff;
  font-size: 2.6rem;
  line-height: 1.15;
  margin-bottom: 18px;
}

.hero p {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 30px;
  max-width: 560px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.btn-ghost {
  background: transparent;
  color: var(--text-white);
  border: 1.5px solid rgba(255, 255, 255, 0.45);
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* Features */
.features {
  padding: 72px 0;
}

.section-head {
  text-align: center;
  margin-bottom: 40px;
}

.section-head h2 {
  font-size: 1.7rem;
  margin-bottom: 8px;
}

.section-head p {
  color: var(--text-light);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.feature-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 30px 26px;
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: var(--primary-50);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.feature-card h3 {
  font-size: 1.05rem;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 0.88rem;
  color: var(--text-light);
  line-height: 1.6;
}

/* How it works */
.how-it-works {
  padding: 72px 0;
  background: var(--bg);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.step {
  text-align: center;
  padding: 24px 16px;
}

.step-num {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--text-white);
  font-weight: 800;
  font-size: 1.15rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.step h3 {
  font-size: 1rem;
  margin-bottom: 8px;
}

.step p {
  font-size: 0.88rem;
  color: var(--text-light);
  line-height: 1.6;
  max-width: 260px;
  margin: 0 auto;
}

/* CTA */
.cta {
  background: linear-gradient(
    135deg,
    var(--primary) 0%,
    var(--primary-dark) 100%
  );
  color: var(--text-white);
  padding: 72px 0;
  text-align: center;
}

.cta-inner h2 {
  color: #ffffff;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.cta-inner p {
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 26px;
}

.btn-light {
  background: var(--gold-light);
  color: var(--primary-dark);
  border: none;
}

.btn-light:hover {
  background: #ffd15c;
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .hero {
    padding: 64px 0;
  }
  .hero h1 {
    font-size: 2rem;
  }
}
</style>
