from flask import Flask, render_template, signals, request, jsonify
from methods import Number
import os


calculator = Flask(__name__, static_folder="." + os.path.sep + "static")


@calculator.route("/")
def load_calculator():
    return render_template("index.html")


"""background process happening without any refreshing"""
@calculator.route("/process_answer", methods=["POST"])
def return_display_json():
    request.accept_mimetypes["application/json"]
    data = request.get_json()
    num = float(data["number"])
    num = str(num)
    if num == "inf" or num == "nan":
        return jsonify(
            number = "Err",
            displayExponential = False,
            power = None,
            isNegative = False
        )
    value = Number(num)
    print(value.data)
    return jsonify(
        number = value.data["number"],
        displayExponential = value.data["exponential"],
        power = value.data["power"],
        isNegative = value.data["negative"]
    )