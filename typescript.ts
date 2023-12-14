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


// Assignment Week 6

//Q1

function ctf(celsius) {
    return (celsius * 9/5) + 32;
}
function ftc(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}
let celsiusTemperature = 34;
let fahrenheitTemperature = 145;
console.log(`${celsiusTemperature}°C is equal to ${ctf(celsiusTemperature)}°F`);
console.log(`${fahrenheitTemperature}°F is equal to ${ftc(fahrenheitTemperature)}°C`);

//Q2

function Percentagecalculator(value, total) {
    return (value / total) * 100;
}
let obtainedMarks = 39;
let totalMarks = 100;
let percentage = Percentagecalculator(obtainedMarks, totalMarks);
console.log(`You scored ${obtainedMarks} out of ${totalMarks} which is ${percentage}%`);

//Q3

function daysconverting(days) {
    const weeks = days / 7 | 0;
    const remainingDays = days % 7;
    return `${weeks} weeks and ${remainingDays} days`;
}
let numberOfDays = 7;
let Result = daysconverting(numberOfDays);
console.log(`${numberOfDays} days = ${result}`);