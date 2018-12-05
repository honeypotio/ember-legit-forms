import EmberObject, { get } from '@ember/object';

export default EmberObject.extend({
  validate(value, validator) {
    let [fieldName] = get(validator, 'arguments');
    let fieldValue = get(validator, `field:${fieldName}`);
    let formValue = value !== undefined ? value : null;
    let validatorValue = fieldValue !== undefined ? fieldValue : null;

    if(formValue !== validatorValue) {
      return {
        message: 'mustBeSame',
        replacements: { fieldName }
      };
    }
  }
});
