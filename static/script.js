//Button variables
var numButtons = document.getElementsByClassName("num"),
    operButtons = document.getElementsByClassName("oper"),
    clearButton = document.getElementById("clr")
    equalsButton = document.getElementById("equals"),
//Variables used to pass information to the caculation function
    operation = null,
    firstNum = null,
    firstClick = true,
//Screen variables
    number = document.getElementById("number"),
    numberText = number.textContent,
    operator = document.getElementById("operator"),
    exponential = document.getElementById("exponent"),
    negative = document.getElementById("negative"),
//Boolean values for whether extra components of the display are viewable
	displayExponential = false,
	negativeDisplayed = false,
//Arrays containing the keyboard keys to listen for events from
	numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."],
	operations = ["+", "-", "*", "/"],
	equasKeys = ["=", "Enter"],
	clearKeys = ["c", "C", "Delete", "Backspace"];

clearScreen();

document.addEventListener("keydown", function(e){
	if(numbers.includes(e.key)){
		numberPress(e.key);
	}
	else if(operations.includes(e.key)){
		operatorPress(e.key);
	}
	else if(equasKeys.includes(e.key)){
		calculation();
	}
	else if(clearKeys.includes(e.key)){
		clearScreen();
	}
})

for(var i = 0; i < numButtons.length; i++){
	numButtons[i].addEventListener("click", numButtonClicked);
}

for(var i = 0; i < operButtons.length; i++){
	operButtons[i].addEventListener("click", operButtonClicked);
}

function numButtonClicked(){
	event.target.blur();
	var buttonId = event.target.id,
		buttonText = document.getElementById(buttonId).textContent;
	numberPress(buttonText);
}

function operButtonClicked(){
	event.target.blur();
	var buttonId = event.target.id,
		buttonText = document.getElementById(buttonId).textContent;
	operatorPress(buttonText);
}

function clearScreen(){
	clearButton.blur();
	numberText = "0";
	number.innerText = numberText;
	cleanScreenElements();
	firstNum = null;
	operation = null;
	firstClick = true;
}

clearButton.addEventListener("click", clearScreen);

function calculation(){
	var answer = ""
	if(negativeDisplayed){
		var secondNum = -numberText;
	}
	else{
		var secondNum = numberText;
	}
	switch(operation){
		case "+":
			answer = Number(firstNum) + Number(numberText);
			break;
		case "-":
			answer = Number(firstNum) - Number(numberText);
			break;
		case "x":
			answer = Number(firstNum) * Number(numberText);
			break;
		case "÷":
			answer = Number(firstNum) / Number(numberText);
			break;
		default:
			answer = numberText;
			break;
	}
	if(operation != null){
		operator.innerText = "="
	}
	operation = null;
	firstNum = null;
	firstClick = true;
	normaliseDisplayNumber(answer);
	if(displayExponential){
		exponential.innerHTML = "e<sup>" + power + "</sup>"
	}
	equalsButton.blur();
}

equalsButton.addEventListener("click", calculation);

function numberPress(value){
	operator.innerText = "";
	if(number.textContent == "0" && value == "0"){
		return;
	}
	if(number.textContent.includes(".")){
		if(number.textContent.length >= 9 && !firstClick){
			return;
		}
	}
	else{
		if(number.textContent.length >= 8 && !firstClick){
			return;
		}
	}
	if(firstClick){
		if(negativeDisplayed && firstNum != null){
			number.innerText = value;
		}
		else if(!negativeDisplayed || firstNum != null){
			cleanScreenElements();
		}
		firstClick = false;
		if(value == "."){
			number.innerText = "0.";
		}
		else{
			number.innerText = value;
		}
	}
	else if(value === "." && numberText.includes(".")){
		return;
	}
	else{
		number.innerText += value;
	}
	numberText = document.getElementById("number").textContent;
}

function operatorPress(value){
	if(value == "-" && firstClick){
		if(firstNum){
			clearScreenElements();
			number.innerText = 0;
		}
		else{
			clearScreen();
		}
		displayNegative();
		return;
	}
	switch(value){
		case "*":
			operation = "x";
			break;
		case "/":
			operation = "÷";
			break;
		default:
			operation = value;
			break;
	}
	operator.innerText = operation;
	if(negativeDisplayed){
		firstNum = -(numberText);
	}
	else{
		firstNum = numberText;
	}
	firstClick = true;
	negativeDisplayed = false;
}

//Function to set teh displayed nuber on the screen to a maximum of 8 characters, and display numbers as 1e⁹ etc. if larger than 99,999,999.
function normaliseDisplayNumber(num){
	$.ajax({
		url: "/process_answer",
		type: "POST",
		headers: {
			Accept: "application/json"
		},
		data: JSON.stringify({
			number: num.toString()
		}),
		contentType: "application/json",
		success: function(data){
			number.innerText = data.number;
			if(data.displayExponential){
				exponential.innerHTML = "e<sup>" + data.power + "</sup>";
			}
			if(data.isNegative){
				displayNegative();
			}
			else{
				removeNegative();
			}
			negativeDisplayed = false;
		}
	});
}

function displayNegative(){
	negative.style.display = "inline";
	negativeDisplayed = true;
}

function removeNegative(){
	negative.style.display = "none";
	negativeDisplayed = false;
}

function cleanScreenElements(){
	operator.innerText = "";
	exponential.innerText = "";
	negative.style.display = "none";
	negativeDisplayed = false;
}