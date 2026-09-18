<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <span class="footer-brand">ApplyDirect <span>SA</span></span>
      <a :href="ADMIN_URL" target="_blank" rel="noopener" class="footer-admin-link">Admin Login</a>
      <p>&copy; {{ year }} ApplyDirect SA (Pty) Ltd. All rights reserved. Cape Town, South Africa.</p>
    </div>
  </footer>
</template>

<script>
// Use the same host the page was opened on so the Admin panel link also works
// when the site is opened from another device (phone/tablet) on the network.
function adminBaseUrl() {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  return `http://${host}:3005`
}

export default {
  name: 'Footer',
  data() {
    return { ADMIN_URL: adminBaseUrl() }
  },
  computed: {
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.site-footer {
  background: var(--primary-dark);
  color: rgba(255, 255, 255, 0.7);
  padding: 28px 0;
  border-top: 3px solid var(--flag-stripe);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-brand {
  font-weight: 800;
  color: var(--text-white);
}

.footer-brand span {
  color: var(--gold-light);
}

.footer-admin-link {
  color: var(--gold-light);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
  border: 1px solid rgba(255, 184, 28, 0.35);
  padding: 7px 14px;
  border-radius: var(--radius);
}

.footer-admin-link:hover {
  background: var(--gold-light);
  color: var(--primary-dark);
  text-decoration: none;
}

.site-footer p {
  font-size: 0.85rem;
  flex-basis: 100%;
  text-align: center;
  margin-top: 4px;
}

@media (max-width: 640px) {
  .footer-inner {
    justify-content: center;
    text-align: center;
  }
}
</style>