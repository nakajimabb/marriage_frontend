import i18next from 'i18n'

export function createFormData(data, model_name) {
  let form_data = new FormData();
  for(let key in data) {
    if(data[key] != null) {
      form_data.append(`${model_name}[${key}]`, data[key]);
    }
  }
  return form_data;
}

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
