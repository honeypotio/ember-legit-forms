# Ember-legit-forms

[![Build Status](https://travis-ci.org/jbandura/ember-legit-forms.svg?branch=master)](https://travis-ci.org/jbandura/ember-legit-forms)

Component for creating modern forms along with validations.

## Getting started

In order for the validations to work properly you have to define rules in your component or controller, for example:

```js
import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
  rules: {
    firstName: 'required|min(6)'
  }  
});
```

Then in the template use the `{{lf-form}}` component and pass the `rules` object like so:

```hbs
{{lf-form rules=rules as |validate|}}
{{/lf-form}}
```

The yielded `validate` function takes care of validating the input and returns an object containing following keys:

- `isValid`: determines whether given input is valid
- `message`: contains a validation message, eg. `can't be blank`

You are free to use this function however you want, for example validate the input when the `onBlur` action is called.

## TODO:

- implement validators:
  - date
  - date format
  - ~~notIn~~
  - ~~in (an array)~~
  - ~~size~~
  - ~~alpha~~
  - ~~url~~
  - ~~alphanumeric~~
  - ~~between~~
  - ~~max~~
  - ~~accepted~~
  - ~~same~~
  - ~~e-mail~~
- add warning when validator for given rule not present, rules hash is null or name property missing from input
- ~~use `ember-oneway-input` in lf-input~~
- ~~expose `on-update` action in every lf-input~~
- ~~in `lf-input-mixin` run the validation in afterRender queue~~
- ~~enable using objects as validator keys (in addition to strings)~~
- ~~ember-i18n integration~~
- ~~support for inline validators~~
- ~~allow access to all fields and their valid states in custom validators~~
- README: add section about password confirmations
- add tests for more than one lf-form instances (they shouldn't share rules attribute)

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
