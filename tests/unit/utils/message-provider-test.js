import { set } from '@ember/object';
import messageProvider from 'ember-legit-forms/utils/message-provider';
import { module, test } from 'qunit';

module('Unit | Utility | message provider');

const defaultMessages = {
  testKey: 'test message',
  testKeyWithReplacements: 'test message {{replacement1}} and {{replacement2}}'
};

let subject = messageProvider.create({ defaultMessages });

test('it gets validation message', function(assert) {
  assert.equal(subject.getMessage('testKey'), 'test message');
});

test('it checks first intl before getting local keys (globals)', function(assert) {
  set(subject, 'container', {
    lookup() {
      return {
        t() {
          return 'test message from intl service';
        }
      };
    }
  });

  assert.equal(subject.getMessage('testKey'), 'test message from intl service');
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
