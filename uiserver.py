from flask import Flask,jsonify
from market import Market
app = Flask(__name__)

app.debug = True
m = Market()

@app.route("/data")
def data():
    return jsonify(**{
        "mycash":m.get_cash(),
        "myorders":m.get_my_orders(),
        "mysecurities":m.get_my_securities(),
        "securities":m.get_securities()
        })
    # return jsonify(**{
    #           "mycash": 1500.0, 
    #           "myorders": {}, 
    #           "mysecurities": {
    #             "ATVI": [
    #               0, 
    #               0.0
    #             ], 
    #             "BUD": [
    #               0, 
    #               0.0
    #             ], 
    #             "CAKE": [
    #               0, 
    #               0.0
    #             ], 
    #             "FIZZ": [
    #               0, 
    #               0.0
    #             ], 
    #             "HOG": [
    #               0, 
    #               0.0
    #             ], 
    #             "MMM": [
    #               0, 
    #               0.0
    #             ], 
    #             "MSFT": [
    #               0, 
    #               0.0
    #             ], 
    #             "RY": [
    #               0, 
    #               0.0
    #             ], 
    #             "TSX": [
    #               0, 
    #               0.0
    #             ], 
    #             "YUM": [
    #               0, 
    #               0.0
    #             ]
    #           }, 
    #           "securities": {
    #             "ATVI": [
    #               903816.2336880891, 
    #               0.002, 
    #               0.008
    #             ], 
    #             "BUD": [
    #               1136044.3352113967, 
    #               0.0006, 
    #               0.004
    #             ], 
    #             "CAKE": [
    #               993955.1910560359, 
    #               0.0007, 
    #               0.005
    #             ], 
    #             "FIZZ": [
    #               925644.1416837717, 
    #               0.0005, 
    #               0.004
    #             ], 
    #             "HOG": [
    #               1034435.3706676959, 
    #               0.0009, 
    #               0.004
    #             ], 
    #             "MMM": [
    #               1000646.0675303069, 
    #               0.0008, 
    #               0.001
    #             ], 
    #             "MSFT": [
    #               1000996.4527757057, 
    #               0.001, 
    #               0.005
    #             ], 
    #             "RY": [
    #               1696920.2206268266, 
    #               0.0007, 
    #               0.005
    #             ], 
    #             "TSX": [
    #               1913611.2412841648, 
    #               0.0006, 
    #               0.007
    #             ], 
    #             "YUM": [
    #               937222.0943927392, 
    #               0.0004, 
    #               0.005
    #             ]
    #           }
    #         })

@app.route("/orders/<tickie>")
def orders(tickie):
    return jsonify(**{
        "orders":m.get_orders(tickie)
        })

if __name__ == "__main__":
    app.run()