import { set } from '@ember/object';
import messageProvider from 'ember-legit-forms/utils/message-provider';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Utility | message provider');

const defaultMessages = {
  testKey: 'test message',
  testKeyWithReplacements: 'test message {{replacement1}} and {{replacement2}}'
};

let subject = messageProvider.create({ defaultMessages });

test('it gets validation message', function(assert) {
  assert.equal(subject.getMessage('testKey'), 'test message');
});

test('it checks first i18n before getting local keys (globals)', function(assert) {
  Ember.i18n = {
    t() {
      return 'test message from i18n globals';
    }
  };

  assert.equal(subject.getMessage('testKey'), 'test message from i18n globals');
});

test('it checks first intl before i18n', function(assert) {
  Ember.i18n = null;
  set(subject, 'container', {
    lookup(param) {
      return {
        t() {
          return `test message from ${param}`;
        }
      };
    }
  });

  assert.equal(subject.getMessage('testKey'), 'test message from service:intl');
});

test('it checks i18n before getting local keys (globals)', function(assert) {
  Ember.i18n = null;
  set(subject, 'container', {
    lookup(param) {
      if (param === 'service:intl') { return; }
      return {
        t() {
          return `test message from ${param}`;
        }
      };
    }
  });

  assert.equal(subject.getMessage('testKey'), 'test message from service:i18n');
});

test('it can interpolate messages with and w/o replacements', function(assert) {
  let message = subject._interpolateMessage('testKeyWithReplacements', {
    replacement1: 'foo',
    replacement2: 'bar'
  });

  assert.equal(message, 'test message foo and bar');
});

test('when intl installed but key not defined it uses default translation', function(assert) {
  set(subject, 'container', {
    lookup() {
      return {
        t(key) {
          return `Missing translation: [${key}]`;
        }
      };
    }
  });
  const message = subject._fetchMessage('testKey', {});
  assert.equal(message, defaultMessages.testKey)
});

test('when i18n installed but key not defined it uses default translation', function(assert) {
  set(subject, 'container', {
    lookup(param) {
      if (param === 'service:intl') { return; }
      return {
        t(key) {
          return `Missing translation: [${key}]`;
        }
      };
    }
  });
  const message = subject._fetchMessage('testKey', {});
  assert.equal(message, defaultMessages.testKey)
});
