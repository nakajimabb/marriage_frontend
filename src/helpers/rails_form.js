import i18next from 'i18n'

export function collectErrors(response) {
  let errors = {};
  if (response.status === 500) {
    const data_errors = response.data.errors;
    const fields = Object.keys(data_errors);
    fields.forEach(field => {
      data_errors[field].forEach(message => {
        errors[field] = i18next.attr('user', field) + message;
      })
    });
  } else {
    errors.base = response.status + ' ' + response.statusText;
  }
  return errors
}
