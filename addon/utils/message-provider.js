import EmberObject, { get } from '@ember/object';
import Ember from 'ember';

export default EmberObject.extend({
  container: null,
  /**
   * A dictionary of default messages - can be overriden by i18n
   * @param defaultMessages
   * @type {Object}
   */
  defaultMessages: {
    'mustBeAccepted': 'must be accepted',
    'mustBeAlphanumeric': 'must consist only of alphabetic characters',
    'mustBeBetween': 'must be between {{minLength}} and {{maxLength}}',
    'tooLong': 'too long',
    'tooShort': 'too short',
    'mustBeNumeric': 'must be a number',
    'mustHaveFeverDecimals': 'must have less than {{allowedDecimals}} numbers after decimal point',
    'mustMatchRegex': 'must have a proper format',
    'mustBeValidURL': 'must be a valid URL',
    "required": "can't be blank",
    "mustBeInArray": 'value not allowed',
    "mustNotBeInArray": 'value not allowed',
    "mustBeValidEmail": 'must be a valid email address',
    "mustBeAlpha": 'must consist only of alphabetic characters',
    "mustBeOfSize": 'must be exactly {{size}} characters long',
    "mustBeDifferent": 'must be different than {{fieldName}}',
    "mustBeSame": 'must match {{fieldName}}'
  },

  /**
   * Gets a validation message based on string returned uses _fetchMessage under the hood.
   *
   * @param {string|Object} if message is a string it is looked up in
   *  defaultMessages/i18n. If it's an object it should contain keys message
   *  and replacements. All occurences of replacements in message will be then
   *  replaced according to the replacements hash.
   * @returns {string}
   */
  getMessage(validation) {
    if (typeof validation === 'string' || validation instanceof String) {
      return this._fetchMessage(validation, {});
    }

    return this._fetchMessage(validation.message, validation.replacements);
  },

  /**
   * This is a convenience function that fetches the message based on a key.
   *
   * It checks ember-i18n first and if it doesn't exist it returns a default message.
   * If ember-i18n is installed but does not define the key, it'll use the default one.
   * @param {string} msg: a key
   * @param {Object} replacements: replacements for interpolation
   * @returns {string}
   * @private
   */
  _fetchMessage(msg, replacements = {}) {
    if(Ember.i18n) {
      return Ember.i18n.t(`validation.${msg}`, replacements);
    }
    const container = get(this, 'container');
    // Check for ember-intl
    let intlService = container ? container.lookup('service:intl') : null;
    if (intlService) {
      const translatedMessage = intlService.t(`validation.${msg}`, replacements);
      if (!/Missing translation/.test(translatedMessage)) return translatedMessage;
    }
    // Check for ember-i18n
    let i18nService = container ? container.lookup('service:i18n') : null;
    if (i18nService) {
      const translatedMessage = i18nService.t(`validation.${msg}`, replacements);
      if (!/Missing translation/.test(translatedMessage)) return translatedMessage;
    }
    return this._interpolateMessage(msg, replacements);
  },

  /**
   * Interpolates message using given replacements
   * @param {string} msg
   * @param {Object} replacements
   * @returns {String}
   * @private
   */
  _interpolateMessage(msg, replacements) {
    let message = get(this, `defaultMessages.${msg}`);
    if (!message) {
      return msg;
    }
    Object.keys(replacements).forEach((key) => {
      message = message.replace(`{{${key}}}`, replacements[key]);
    });

    return message;
  }
});
