/* ============================================
   BP Meter — Warranty Registration
   Main JavaScript
   ============================================ */

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
   * @param {string} fieldId - The field name (matches error element id pattern)
   * @param {string} [message] - Optional custom error message
   */
  function showError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const inputEl = document.getElementById(fieldId);

    if (errorEl) {
      if (message) errorEl.textContent = message;
      errorEl.classList.add('visible');
    }

    // Add error class to input/select/upload
    if (inputEl) {
      inputEl.classList.add('error');
    }

    // Special handling for upload area and checkbox
    if (fieldId === 'receipt') {
      uploadArea.classList.add('error');
    }
    if (fieldId === 'confirm') {
      document.querySelector('.form__checkbox-custom').classList.add('error');
    }
  }

  /**
   * Clear the error state for a specific field.
   * @param {string} fieldId - The field name
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
   * @returns {boolean} True if all fields are valid
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
      // Clear the error for this field as the user corrects it
      clearError(field.id);
      checkFormValidity();
    });
  });

  // ========================================
  // FORM SUBMISSION
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

    // Build form data
    const formData = new FormData();
    formData.append('modelNumber', modelNumber.value);
    formData.append('serialNumber', serialNumber.value.trim());
    formData.append('purchaseDate', purchaseDate.value);
    formData.append('email', email.value.trim());
    formData.append('phone', phone.value.trim());
    formData.append('receipt', receipt.files[0]);

    try {
      // ---- PLACEHOLDER API CALL ----
      // Replace this with your actual backend endpoint
      // Example: const response = await fetch('/api/warranty', { method: 'POST', body: formData });
      await mockApiSubmit(formData);

      // Show success message
      form.style.display = 'none';
      successMessage.style.display = 'block';
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
      // Show a generic error — replace with more specific handling as needed
      alert('Something went wrong. Please try again.');
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
  // MOCK API SUBMISSION
  // ========================================

  /**
   * Simulates an API call with a delay.
   * Replace this function with a real fetch() call to your backend.
   * @param {FormData} formData - The form data to submit
   * @returns {Promise} Resolves after a simulated delay
   */
  function mockApiSubmit(formData) {
    return new Promise((resolve) => {
      // Log submitted data for development/testing
      console.log('--- Warranty Registration Submitted ---');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: ${value.name} (${(value.size / 1024).toFixed(1)} KB)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      // Simulate network delay (1.5 seconds)
      setTimeout(resolve, 1500);
    });
  }

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
  // SMOOTH SCROLL for header offset
  // ========================================

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
