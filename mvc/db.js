const pets = [];
pets.push({ name: 'Tobi', id: 0 });
pets.push({ name: 'Loki', id: 1 });
pets.push({ name: 'Jane', id: 2 });
pets.push({ name: 'Raul', id: 3 });

const users = [];
users.push({ name: 'Ichsan', pets: [pets[0], pets[1], pets[2]], id: 0 });
users.push({ name: 'Ryan', pets: [pets[3]], id: 1 });
users.push({ name: 'Julian', pets: [], id: 2 });

module.exports = {pets, users};
