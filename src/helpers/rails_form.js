import i18next from 'src/i18n'

export const createFormData = (data, model_name) => {
  let form_data = new FormData();
  for(let key in data) {
    if(data[key] != null) {
      form_data.append(`${model_name}[${key}]`, data[key]);
    }
  }
  return form_data;
};

export const collectErrors = (response, model_name) => {
  let errors = {};
  if (response.status === 500) {
    const data_errors = response.data.errors;
    const fields = Object.keys(data_errors);
    fields.forEach(field => {
      data_errors[field].forEach(message => {
        errors[field] = i18next.attr(model_name, field) + message;
      })
    });
  } else {
    errors.base = response.status + ' ' + response.statusText;
  }
  return errors
};

export const createFormCollectionData = (array, model_name) => {
  let form_data = new FormData();
  const name1 = 'form_' + model_name + '_collection';
  const name2 = model_name + '_attributes';
  for(let i in array) {
    for (let key in array[i]) {
      form_data.append(`${name1}[${name2}][${i}][${key}`, array[i][key]);
    }
  }
  return form_data;
};

