// Q4
let num = 49;
if (num % 3 == 0){
    console.log("number is even")
} else {
    console.log("number is odd")
}




//Q1
function calculateArea(length, width) {
    return length * width;
}
const length = 5;
const width = 10;
const area = calculateArea(length, width);
console.log(`The area of the rectangle is: ${area}`);

//Q5

function Vote(age) {
    if (age >= 18) {
        return "You are eligible to vote!";
    } else {
        return "Sorry, you are not eligible to vote yet.";
    }
}
let personAge = 20; 
let eligibilityMessage = Vote(personAge);
console.log(eligibilityMessage);

//Q3

function CheckNumber(number){
    if (number > 0){
        console.log("Number is positive");
    }
    else if (number < 0){
        console.log("Number is Negative");
    }
    else {
        console.log("Number is Zero");
    }
}
let Number = 3;
let result = CheckNumber(Number);
console.log(`The number ${Number} is ${result}.`);

//Q2

function CubeVolume(Length){
    return Length ** 3;
}
let Length = 5;
let Volume = CubeVolume(Length);
console.log(`The volume of the cube with length ${Length} is: ${Volume}`);

//Q6

let mathresult = ((10 + 5) * 3 - 2) / (4 % 3)  - 7;
console.log(`The result of the expression is: ${mathresult}`)
export {};