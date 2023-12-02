"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Q4
var num = 49;
if (num % 3 == 0) {
    console.log("number is even");
}
else {
    console.log("number is odd");
}
//Q1
function calculateArea(length, width) {
    return length * width;
}
var length = 5;
var width = 10;
var area = calculateArea(length, width);
console.log("The area of the rectangle is: ".concat(area));
//Q5
function Vote(age) {
    if (age >= 18) {
        return "You are eligible to vote!";
    }
    else {
        return "Sorry, you are not eligible to vote yet.";
    }
}
var personAge = 20;
var eligibilityMessage = Vote(personAge);
console.log(eligibilityMessage);
//Q3
function CheckNumber(number) {
    if (number > 0) {
        console.log("Number is positive");
    }
    else if (number < 0) {
        console.log("Number is Negative");
    }
    else {
        console.log("Number is Zero");
    }
}
var Number = 3;
var result = CheckNumber(Number);
console.log("The number ".concat(Number, " is ").concat(result, "."));
//Q2
function CubeVolume(Length) {
    return Math.pow(Length, 3);
}
var Length = 5;
var Volume = CubeVolume(Length);
console.log("The volume of the cube with length ".concat(Length, " is: ").concat(Volume));
//Q6
var mathresult = ((10 + 5) * 3 - 2) / (4 % 3) - 7;
console.log("The result of the expression is: ".concat(mathresult));
