/* ============================================
   BP Meter — Warranty Registration
   Main JavaScript — Connected to Supabase
   ============================================ */

// ---- Supabase Configuration ----
// Update these values if your project changes
const SUPABASE_URL = 'https://oekkhdldwfsbmhcrykvd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_DXkFVWdMai5khEtvJwRmqw_tOZ0mb2i';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {

  // ---- DOM Elements ----
  const form = document.getElementById('warrantyForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.querySelector('.btn__text');
  const btnLoader = document.getElementById('btnLoader');
  const successMessage = document.getElementById('successMessage');
  const registerAnother = document.getElementById('registerAnother');

  // Form fields
  const modelNumber = document.getElementById('modelNumber');
  const serialNumber = document.getElementById('serialNumber');
  const purchaseDate = document.getElementById('purchaseDate');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const receipt = document.getElementById('receipt');
  const confirm = document.getElementById('confirm');

  // Upload UI
  const uploadArea = document.getElementById('uploadArea');
  const uploadContent = document.getElementById('uploadContent');
  const uploadPreview = document.getElementById('uploadPreview');
  const fileName = document.getElementById('fileName');
  const removeFile = document.getElementById('removeFile');

  // Mobile nav
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');

  // Set max date for purchase date to today
  const today = new Date().toISOString().split('T')[0];
  purchaseDate.setAttribute('max', today);

  // ========================================
  // MOBILE NAVIGATION
  // ========================================
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
  });

  // Close mobile nav when a link is clicked
  document.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileNav.classList.remove('active');
    });
  });

  // ========================================
  // FILE UPLOAD HANDLING
  // ========================================

  // Drag and drop visual feedback
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', () => {
    uploadArea.classList.remove('dragover');
  });

  // Show file name when a file is selected
  receipt.addEventListener('change', () => {
    if (receipt.files && receipt.files.length > 0) {
      const file = receipt.files[0];

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showError('receipt', 'File size must be under 5MB.');
        receipt.value = '';
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        showError('receipt', 'Please upload a JPG, PNG, or PDF file.');
        receipt.value = '';
        return;
      }

      fileName.textContent = file.name;
      uploadContent.style.display = 'none';
      uploadPreview.style.display = 'flex';
      clearError('receipt');
    }
    checkFormValidity();
  });

  // Remove uploaded file
  removeFile.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    receipt.value = '';
    uploadContent.style.display = 'block';
    uploadPreview.style.display = 'none';
    fileName.textContent = '';
    checkFormValidity();
  });

  // ========================================
  // FORM VALIDATION
  // ========================================

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Phone validation — allow common Malaysian formats
  const phoneRegex = /^[\d\s\-\+()]{7,15}$/;

  /**
   * Show an inline error message for a specific field.
   */
  function showError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const inputEl = document.getElementById(fieldId);

    if (errorEl) {
      if (message) errorEl.textContent = message;
      errorEl.classList.add('visible');
    }

    if (inputEl) {
      inputEl.classList.add('error');
    }

    if (fieldId === 'receipt') {
      uploadArea.classList.add('error');
    }
    if (fieldId === 'confirm') {
      document.querySelector('.form__checkbox-custom').classList.add('error');
    }
  }

  /**
   * Clear the error state for a specific field.
   */
  function clearError(fieldId) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const inputEl = document.getElementById(fieldId);

    if (errorEl) errorEl.classList.remove('visible');
    if (inputEl) inputEl.classList.remove('error');

    if (fieldId === 'receipt') {
      uploadArea.classList.remove('error');
    }
    if (fieldId === 'confirm') {
      document.querySelector('.form__checkbox-custom').classList.remove('error');
    }
  }

  /**
   * Check if all required fields are filled and valid.
   * Enables/disables the submit button accordingly.
   */
  function checkFormValidity() {
    const isValid =
      modelNumber.value !== '' &&
      serialNumber.value.trim() !== '' &&
      purchaseDate.value !== '' &&
      emailRegex.test(email.value.trim()) &&
      phoneRegex.test(phone.value.trim()) &&
      receipt.files.length > 0 &&
      confirm.checked;

    submitBtn.disabled = !isValid;
  }

  /**
   * Validate all fields and show errors for invalid ones.
   */
  function validateAll() {
    let valid = true;

    if (modelNumber.value === '') {
      showError('modelNumber');
      valid = false;
    } else {
      clearError('modelNumber');
    }

    if (serialNumber.value.trim() === '') {
      showError('serialNumber');
      valid = false;
    } else {
      clearError('serialNumber');
    }

    if (purchaseDate.value === '') {
      showError('purchaseDate');
      valid = false;
    } else {
      clearError('purchaseDate');
    }

    if (!emailRegex.test(email.value.trim())) {
      showError('email');
      valid = false;
    } else {
      clearError('email');
    }

    if (!phoneRegex.test(phone.value.trim())) {
      showError('phone');
      valid = false;
    } else {
      clearError('phone');
    }

    if (receipt.files.length === 0) {
      showError('receipt');
      valid = false;
    } else {
      clearError('receipt');
    }

    if (!confirm.checked) {
      showError('confirm');
      valid = false;
    } else {
      clearError('confirm');
    }

    return valid;
  }

  // Listen for input changes to update button state and clear errors in real time
  const allFields = [modelNumber, serialNumber, purchaseDate, email, phone, confirm];
  allFields.forEach(field => {
    const eventType = (field.type === 'checkbox') ? 'change' : 'input';
    field.addEventListener(eventType, () => {
      clearError(field.id);
      checkFormValidity();
    });
  });

  // ========================================
  // FORM SUBMISSION — Supabase
  // ========================================

  let isSubmitting = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    // Validate all fields
    if (!validateAll()) return;

    // Set loading state
    isSubmitting = true;
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';

    try {
      // Step 1: Upload receipt to Supabase Storage
      const file = receipt.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}_${serialNumber.value.trim()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await db.storage
        .from('receipts')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error('Receipt upload failed: ' + uploadError.message);
      }

      // Step 2: Get the public URL for the uploaded receipt
      const { data: urlData } = db.storage
        .from('receipts')
        .getPublicUrl(filePath);

      const receiptUrl = urlData.publicUrl;

      // Step 3: Insert registration data into the database
      const { error: insertError } = await db
        .from('warranty_registrations')
        .insert({
          model_number: modelNumber.value,
          serial_number: serialNumber.value.trim(),
          purchase_date: purchaseDate.value,
          email: email.value.trim(),
          phone: phone.value.trim(),
          receipt_url: receiptUrl
        });

      if (insertError) {
        throw new Error('Registration failed: ' + insertError.message);
      }

      // Show success message
      form.style.display = 'none';
      successMessage.style.display = 'block';
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
      alert(error.message || 'Something went wrong. Please try again.');
      console.error('Submission error:', error);
    } finally {
      // Reset loading state
      isSubmitting = false;
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
    }
  });

  // ========================================
  // REGISTER ANOTHER PRODUCT
  // ========================================

  registerAnother.addEventListener('click', () => {
    // Reset form
    form.reset();
    receipt.value = '';
    uploadContent.style.display = 'block';
    uploadPreview.style.display = 'none';
    fileName.textContent = '';
    submitBtn.disabled = true;

    // Clear all errors
    ['modelNumber', 'serialNumber', 'purchaseDate', 'email', 'phone', 'receipt', 'confirm']
      .forEach(clearError);

    // Show form, hide success
    successMessage.style.display = 'none';
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ========================================
  // CHECK WARRANTY — Search by phone or email
  // ========================================

  const checkForm = document.getElementById('checkWarrantyForm');
  const searchPhone = document.getElementById('searchPhone');
  const searchEmail = document.getElementById('searchEmail');
  const searchPhoneField = document.getElementById('searchPhoneField');
  const searchEmailField = document.getElementById('searchEmailField');
  const searchBtn = document.getElementById('searchBtn');
  const searchBtnText = document.getElementById('searchBtnText');
  const searchBtnLoader = document.getElementById('searchBtnLoader');
  const warrantyResults = document.getElementById('warrantyResults');
  const warrantyEmpty = document.getElementById('warrantyEmpty');
  const tabsContainer = document.querySelector('.check-warranty__tabs');
  const tabs = document.querySelectorAll('.check-warranty__tab');

  let activeSearchTab = 'phone';

  function setActiveTab(target) {
    if (!target || !target.dataset || !target.dataset.tab) return;
    tabs.forEach(t => t.classList.remove('active'));
    target.classList.add('active');
    activeSearchTab = target.dataset.tab;

    if (activeSearchTab === 'phone') {
      searchPhoneField.style.display = 'block';
      searchEmailField.style.display = 'none';
      searchEmail.value = '';
      clearError('searchEmail');
    } else {
      searchPhoneField.style.display = 'none';
      searchEmailField.style.display = 'block';
      searchPhone.value = '';
      clearError('searchPhone');
    }

    warrantyResults.style.display = 'none';
    warrantyEmpty.style.display = 'none';
  }

  // Event delegation — reliable even if DOM shifts
  if (tabsContainer) {
    tabsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.check-warranty__tab');
      if (btn && tabsContainer.contains(btn)) setActiveTab(btn);
    });
  }

  // Clear errors on input
  searchPhone.addEventListener('input', () => clearError('searchPhone'));
  searchEmail.addEventListener('input', () => clearError('searchEmail'));

  let isSearching = false;

  checkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSearching) return;

    // Validate
    if (activeSearchTab === 'phone') {
      if (searchPhone.value.trim() === '') {
        showError('searchPhone');
        return;
      }
    } else {
      if (!emailRegex.test(searchEmail.value.trim())) {
        showError('searchEmail');
        return;
      }
    }

    // Loading state
    isSearching = true;
    searchBtnText.style.display = 'none';
    searchBtnLoader.style.display = 'inline-flex';
    warrantyResults.style.display = 'none';
    warrantyEmpty.style.display = 'none';

    try {
      let query = db.from('warranty_registrations').select('*');
      let filterFn = null;

      if (activeSearchTab === 'phone') {
        const digits = searchPhone.value.replace(/\D/g, '');
        // Loose DB match on last 4 digits, then exact normalized match in JS
        const tail = digits.slice(-4);
        query = query.ilike('phone', `%${tail}%`);
        filterFn = (rec) => String(rec.phone ?? '').replace(/\D/g, '') === digits;
      } else {
        const emailVal = searchEmail.value.trim().toLowerCase();
        query = query.ilike('email', emailVal);
        filterFn = (rec) => String(rec.email ?? '').trim().toLowerCase() === emailVal;
      }

      const { data, error } = await query;

      if (error) throw new Error('Search failed: ' + error.message);

      const matches = (data || []).filter(filterFn);

      if (matches.length === 0) {
        warrantyEmpty.style.display = 'block';
      } else {
        renderWarrantyResults(matches);
        warrantyResults.style.display = 'block';
      }
    } catch (err) {
      alert(err.message || 'Something went wrong. Please try again.');
      console.error('Search error:', err);
    } finally {
      isSearching = false;
      searchBtnText.style.display = 'inline-flex';
      searchBtnLoader.style.display = 'none';
    }
  });

  /**
   * Render warranty search results.
   */
  function renderWarrantyResults(records) {
    const warrantyYears = 2;
    let html = '';

    if (records.length > 1) {
      html += `<p class="check-warranty__count">${records.length} warranties found</p>`;
    }

    records.forEach(rec => {
      const purchaseDate = new Date(rec.purchase_date);
      const expiryDate = new Date(purchaseDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + warrantyYears);
      const now = new Date();
      const isActive = now <= expiryDate;

      const statusClass = isActive ? 'active' : 'expired';
      const statusLabel = isActive ? 'Active' : 'Expired';
      const statusDot = isActive ? '#10B981' : '#EF4444';

      const formatDate = (d) => d.toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' });

      html += `
        <div class="check-warranty__result-item">
          <div class="check-warranty__result-header">
            <span class="check-warranty__result-model">${escapeHtml(rec.model_number)}</span>
            <span class="check-warranty__status check-warranty__status--${statusClass}">
              <svg width="8" height="8"><circle cx="4" cy="4" r="4" fill="${statusDot}"/></svg>
              ${statusLabel}
            </span>
          </div>
          <div class="check-warranty__result-grid">
            <div class="check-warranty__result-field">
              <span class="check-warranty__result-label">Phone</span>
              <span class="check-warranty__result-value">${escapeHtml(maskPhone(rec.phone))}</span>
            </div>
            <div class="check-warranty__result-field">
              <span class="check-warranty__result-label">Email</span>
              <span class="check-warranty__result-value">${escapeHtml(maskEmail(rec.email))}</span>
            </div>
            <div class="check-warranty__result-field">
              <span class="check-warranty__result-label">Purchase Date</span>
              <span class="check-warranty__result-value">${formatDate(purchaseDate)}</span>
            </div>
            <div class="check-warranty__result-field">
              <span class="check-warranty__result-label">Warranty Expiry</span>
              <span class="check-warranty__result-value">${formatDate(expiryDate)}</span>
            </div>
          </div>
        </div>`;
    });

    warrantyResults.innerHTML = html;
  }

  /**
   * Escape HTML to prevent XSS.
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function maskPhone(phone) {
    if (!phone) return '';
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length <= 4) return '••••';
    return '••••••' + digits.slice(-4);
  }

  function maskEmail(email) {
    if (!email) return '';
    const [local, domain] = String(email).split('@');
    if (!domain) return '••••';
    const visible = local.slice(0, 2);
    return visible + '•••@' + domain;
  }

  // ========================================
  // SMOOTH SCROLL for header offset
  // ========================================

  // ========================================
  // SCROLL ANIMATIONS — fade up on enter
  // ========================================

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('header').offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
