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

//Q4

function DiscountCalculator(price) {
    if (price > 100) {
        return price * 0.1;
    } else {
        return price * 0.05;
    }
}
let productPrice = 194;
let discountAmount = DiscountCalculator(productPrice);
console.log(`The product price is $${productPrice}`);
console.log(`The discount amount is $${discountAmount}`);
console.log(`The discounted price is $${(productPrice - discountAmount)}`);

// Q5
function AgeCategory(age) {
    if (age <= 12) {
        return "Child";
    } else if (age <= 19) {
        return "Teenager";
    } else {
        return "Adult";
    }
}
let userAge = ("Please enter your age:");
let ageCategory = AgeCategory(userAge);
console.log(`You are a ${ageCategory}.`);

//Q6

function suggestClothing(temperature) {
    if (temperature < 0) {
      console.log("It's freezing!  Wear a heavy winter coat, gloves, scarf, and hat!");
    } else if (temperature < 10) {
      console.log("It's chilly!  Wear a warm jacket, sweater, and long pants.");
    } else if (temperature < 20) {
      console.log("It's cool! Wear a light jacket or long-sleeved shirt.");
    } else if (temperature < 30) {
      console.log("It's pleasant! Wear a t-shirt and shorts or a light dress.");
    } else {
      console.log("It's hot!  Wear cool, breathable clothing like a tank top and shorts.");
    }
  }
  let currentTemperature = ("Enter the current temperature:" );
  let clothingSuggestion = suggestClothing(currentTemperature);
  console.log(`Clothing suggestion for ${currentTemperature}°C: ${clothingSuggestion}`);

  //Q7

  function checkDivisibility(number) {
    let divisibleBy3 = number % 3 === 0;
    let divisibleBy5 = number % 5 === 0;
    let divisibleByBoth = divisibleBy3 && divisibleBy5;
    let message;
    if (divisibleByBoth) {
      message = `${number} is divisible by both 3 and 5.`;
    } else if (divisibleBy3) {
      message = `${number} is divisible by 3.`;
    } else if (divisibleBy5) {
      message = `${number} is divisible by 5.`;
    } else {
      message = `${number} is not divisible by 3 or 5.`;
    }
    console.log(message);
  }

  //Q8

  function isLeapYear(year) {
    if (year % 4 === 0) {
      if (year % 100 === 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  // Q9

  function DayOfWeek(dayNumber) {
    let dayName;
  
    if (dayNumber >= 1 && dayNumber <= 7) {
      if (dayNumber === 1) {
        dayName = "Sunday";
      } else if (dayNumber === 2) {
        dayName = "Monday";
      } else if (dayNumber === 3) {
        dayName = "Tuesday";
      } else if (dayNumber === 4) {
        dayName = "Wednesday";
      } else if (dayNumber === 5) {
        dayName = "Thursday";
      } else if (dayNumber === 6) {
        dayName = "Friday";
      } else {
        dayName = "Saturday";
      }
  
      console.log("The day " + dayNumber + " is " + dayName + ".");
    } else {
      console.log("Please enter a number between 1 and 7.");
    }
  }

  // Q10

  // Still not solved. 
  export {};