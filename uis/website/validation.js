(() => {
  const form = document.querySelector('#application-form');
  if (!form) return;

  const fields = {
    companyName: document.querySelector('#company-name'),
    contactPerson: document.querySelector('#contact-person'),
    email: document.querySelector('#email'),
    phone: document.querySelector('#phone'),
    website: document.querySelector('#website'),
    country: document.querySelector('#country'),
    productType: document.querySelector('#product-type'),
    volume: document.querySelector('#volume'),
    comments: document.querySelector('#comments'),
    privacy: document.querySelector('#privacy'),
  };
  const error = (id) => document.querySelector(`#${id}-error`);
  const formErrors = document.querySelector('#form-errors');
  const warning = document.querySelector('#volume-warning');
  const counter = document.querySelector('#comments-counter');

  const messages = {
    companyName: 'Company name must have at least 2 characters',
    contactPerson: 'Enter first and last name of contact',
    email: 'Enter a valid corporate email (example: name@company.com)',
    phone: 'Phone must include country code (example: +1 213 555 0147)',
    website: 'If you include website, it must be a valid URL',
    country: 'Select main operating country',
    productType: 'Select the type of product you handle',
    volume: 'Select estimated monthly volume',
    services: 'Select at least one service of interest',
    current3pl: 'Indicate if you currently work with another logistics provider',
    privacy: 'You must accept the privacy policy to continue',
  };

  function setError(key, message) {
    const input = fields[key];
    const output = error(key);
    if (input) input.classList.toggle('invalid', Boolean(message));
    if (output) output.textContent = message || '';
    return Boolean(message);
  }

  function validate() {
    let invalid = false;
    const companyName = fields.companyName.value.trim();
    const contactPerson = fields.contactPerson.value.trim();
    const email = fields.email.value.trim();
    const phone = fields.phone.value.trim();
    const website = fields.website.value.trim();
    const services = [...form.querySelectorAll('input[name="services"]:checked')];
    const current3pl = form.querySelector('input[name="current3pl"]:checked');

    invalid = setError('companyName', companyName.length < 2 ? messages.companyName : '') || invalid;
    invalid = setError('contactPerson', contactPerson.split(/\s+/).filter(Boolean).length < 2 ? messages.contactPerson : '') || invalid;
    invalid = setError('email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? messages.email : '') || invalid;
    invalid = setError('phone', !/^\+\d[\d\s().-]{6,}$/.test(phone) ? messages.phone : '') || invalid;
    invalid = setError('website', website && !/^https?:\/\/[^\s]+$/.test(website) ? messages.website : '') || invalid;
    invalid = setError('country', !fields.country.value ? messages.country : '') || invalid;
    invalid = setError('productType', !fields.productType.value ? messages.productType : '') || invalid;
    invalid = setError('volume', !fields.volume.value ? messages.volume : '') || invalid;
    invalid = setError('services', services.length === 0 ? messages.services : '') || invalid;
    invalid = setError('current3pl', !current3pl ? messages.current3pl : '') || invalid;
    invalid = setError('privacy', !fields.privacy.checked ? messages.privacy : '') || invalid;

    const commentLength = fields.comments.value.length;
    const commentsError = error('comments');
    commentsError.textContent = commentLength > 500 ? `Comments cannot exceed 500 characters (${500 - commentLength} remaining)` : '';
    invalid = commentLength > 500 || invalid;
    return invalid;
  }

  function updateVolumeWarning() {
    warning.classList.toggle('hidden', fields.volume.value !== '0-100');
  }

  fields.volume.addEventListener('change', updateVolumeWarning);
  fields.comments.addEventListener('input', () => {
    const remaining = 500 - fields.comments.value.length;
    counter.textContent = `${remaining} characters remaining`;
    counter.classList.toggle('text-red-700', remaining < 0);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formErrors.classList.add('hidden');
    const invalid = validate();
    if (invalid) {
      formErrors.textContent = 'Please review the highlighted fields before submitting.';
      formErrors.classList.remove('hidden');
      formErrors.focus();
      const firstInvalid = form.querySelector('.invalid, input[name="services"]:not(:checked), input[name="current3pl"]:not(:checked)');
      firstInvalid?.focus();
      return;
    }
    document.querySelector('#form-fields').classList.add('hidden');
    document.querySelector('#success-message').classList.remove('hidden');
    document.querySelector('#success-message').focus();
  });
})();
