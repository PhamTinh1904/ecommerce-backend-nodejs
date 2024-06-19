const students = {
  grades: [],
  add: function(temp){
    this.datastore.push(temp);
  },
  average: function() {
    let total = 0;
    for (let i = 0; i < this.datastore.length; i++) {
      total += this.datastore[i];
    }

    return total / this.datastore.length;
  },
};

weekTemps.add(52);
weekTemps.add(55);
weekTemps.add(61);
weekTemps.add(65);
weekTemps.add(55);
weekTemps.add(50);
weekTemps.add(52);
weekTemps.add(49)
console.log(weekTemps.average());
