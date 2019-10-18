function Dog(name) {
    this.name = name;
  }
  
  var dog1 = new Dog('Gabby');
      
  Dog.prototype.toString = function dogToString() {
    return '222' + this.name;
  }
  
  console.log(dog1);
  // expected output: "Gabby"
  