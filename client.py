from market import Market
from pprint import pprint
from datetime import datetime
import time


m = Market()

def main():
    # history = []
    #
    #
    # count = 0
    # last_time = 0
    while True:
        print "My Securities:"

        pprint(m.get_my_securities())

        print "\nCash:",
        print m.get_cash()
        print ""

        print "All Securities:"
        pprint(m.get_securities())

        var = raw_input("Enter your action: ")
        var = var.split(" ")
        if var:
            if var[0] == "b":
                if var[2]:
                    m.buy_stock(var[1], int(var[2]))
                else:
                    m.buy_stock(var[1])
            elif var[0] == "s":
                if var[2]:
                    m.sell_stock(var[1], int(var[2]))
                else:
                    m.sell_stock(var[1])

        # current_time = datetime.now().second
        # if last_time != current_time:
        #     history.append(m.get_securities())
        #     last_time = current_time
        #     count+=1
        #     print history
        # if count == 5:
        #     break
        # time.sleep(100)

main()