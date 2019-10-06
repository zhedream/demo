interface Person {
    firstName: string;
    lastName: string;
}

function Greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

var user = { firstName: "Jane", lastName: "User" };

document.body.innerHTML = Greeter(user);