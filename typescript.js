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
// Assignment Week 6
//Q1
function ctf(celsius) {
    return (celsius * 9 / 5) + 32;
}
function ftc(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}
var celsiusTemperature = 34;
var fahrenheitTemperature = 145;
console.log("".concat(celsiusTemperature, "\u00B0C is equal to ").concat(ctf(celsiusTemperature), "\u00B0F"));
console.log("".concat(fahrenheitTemperature, "\u00B0F is equal to ").concat(ftc(fahrenheitTemperature), "\u00B0C"));
//Q2
function Percentagecalculator(value, total) {
    return (value / total) * 100;
}
var obtainedMarks = 39;
var totalMarks = 100;
var percentage = Percentagecalculator(obtainedMarks, totalMarks);
console.log("You scored ".concat(obtainedMarks, " out of ").concat(totalMarks, " which is ").concat(percentage, "%"));
//Q3
function daysconverting(days) {
    var weeks = days / 7 | 0;
    var remainingDays = days % 7;
    return "".concat(weeks, " weeks and ").concat(remainingDays, " days");
}
var numberOfDays = 7;
var Result = daysconverting(numberOfDays);
console.log("".concat(numberOfDays, " days = ").concat(result));
//Q4
function DiscountCalculator(price) {
    if (price > 100) {
        return price * 0.1;
    }
    else {
        return price * 0.05;
    }
}
var productPrice = 194;
var discountAmount = DiscountCalculator(productPrice);
console.log("The product price is $".concat(productPrice));
console.log("The discount amount is $".concat(discountAmount));
console.log("The discounted price is $".concat((productPrice - discountAmount)));
// Q5
function AgeCategory(age) {
    if (age <= 12) {
        return "Child";
    }
    else if (age <= 19) {
        return "Teenager";
    }
    else {
        return "Adult";
    }
}
var userAge = prompt("Please enter your age:");
var ageCategory = AgeCategory(userAge);
console.log("You are a ".concat(ageCategory, "."));
