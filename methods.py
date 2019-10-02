"""A class that when given a number will generate various information about that number in a dictionary. 
   The number value shoud be provided as a STRING"""

class Number:
	def __init__(self, number):
		self.exponential, self.power = needs_exponential(number)
		if float(number) < 0:
			self.negative = True
		else:
			self.negative = False
		"""Need to round the number if the number of decimal places is to many, but not if the number is lower than 0.0000001 (the lowest that can be displayed)
		   The case that the number is greater than 99999999 and also includes a decimal, this code is not run as above exponetial is set to True"""
		if "." in number and not self.exponential:
			length = len(number) - 1	#Length should not include the decimal point itself
			non_decimal_places = len(number.split(".", 1)[0])
			self.number = round(float(number), (8 - non_decimal_places))	#Max number of digits is 8 so we include all the non-deciaml places and all the rest that will fit
		elif self.exponential:
			if abs(float(number)) > 99999999 and not self.negative:	#Convert number to float as it comes as a string and abs() requires either int or float type
				self.number = number.split(".", 1)[0]				#Remove decimal places
				self.number = int(self.number) / (10 ** ((self.power) - 1))		#Convert number to x.xxxxxxx
			elif abs(float(number)) > 99999999 and self.negative:
				self.number = number.split(".", 1)[0]
				self.number = int(self.number) / (10 ** ((self.power - 2)))		#Maths init
			elif abs(float(number)) < 0.0000001:
				self.number = float(number) * (10 ** -(self.power))	#Reverse the negative value of the power as we want to make the value larger. Will be displayed like: x.xxxxxxx e-y
			self.number = round(self.number, 7)
		else:
			self.number = float(number)

		"""An extra bit of code to build a number string to display if the answer is displayed in scientific notation by python autmoatically.
		Here we want to display it without an exponential"""
		if "e" in str(self.number):
			self.number = str(self.number)
			a_value = self.number.split("e", 1)[0]
			a_power = self.number.split("-", 1)[1]
			a_power = int(a_power)
			self.number = "0."
			for i in range(1, a_power):		#Adds one less than the power of 0s
				self.number += "0"
			a_value = a_value.replace(".", "")
			a_value = round(int(a_value), 8 - a_power)
			self.number += str(a_value)
			self.number = float(self.number)

		self.data = {
			"exponential" : self.exponential,
			"power": self.power,
			"negative": self.negative,
			"number": abs(self.number)		#The display has a separate div to show the - sign in so we only need to know the value of the number and that it is negative
		}

"""Function to determine whether a number requires an exponential display or not. Maximum number of digits to display on the screen is 8, 
   NOT including a decimal
   RETURN VALUES - True or Flase depending on whether the screen should display an exponential
   				   Number of digits in the number, and therefore the power of the exponential to be displayed"""

def needs_exponential(number):
	"""If the number is greater than the maximum number that can be displayed, it should be turned into an exponential"""
	if abs(float(number)) > 99999999:
		number = number.split(".", 1)[0]	#Remove the decimal plaecs as these won't be displayed
		power = len(number)
		return True, power
	elif abs(float(number)) < 0.0000001:	#If the number is less than the minimum number that can be displated, it should show an exponential with a negative power
		number = number.split("-", 2)[-1]
		try:
			power = int(number)
		except(ValueError):
			return False, None 		#Handles the case 0 / x
		return True, -(power)
	else:
		return False, None
