// getter and setter in javascript
// getters => access properties
// setters => change or mutate properties

// Object.defineProperty

const person = {
  name: 'Dao Luong',
  age: 21,
};

// add one more property called gender to person object

// not configurable, not writable, not enumerable

let genderValue = 'male';

Object.defineProperty(person, 'gender', {
  get() {
    return genderValue;
  },
  set(value) {
    genderValue = value;
  },
});

person.gender = 'female';

console.log(person.gender);
