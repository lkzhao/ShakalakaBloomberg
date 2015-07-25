from market import Market, get_buy_and_sell_prices, Stock
from pprint import pprint
from datetime import datetime
import time
from copy import deepcopy


m = Market()
NUMBER_OF_STOCKS = 4
HOLDING_TIME = 60
REGENERATION_TIME = 120
DIVIDENDS_THRESHOLD = 0.00002


selling = []
def sell_stock(stock):
    global selling
    m.get_my_securities()
    m.get_orders(stock)
    this_ord = m.orders[stock]

    if stock not in selling:
        selling.append(stock)

    _, cur_sell = get_buy_and_sell_prices(this_ord)
    want_price = cur_sell - 0.02

    num_shares = int(m.my_securities[stock][0])
    print "ASK %s: %d shares at %f" % (stock, num_shares, want_price)
    m.run("ASK %s %f %d"% (stock, want_price, num_shares))

def auto_run():
    global selling
    # history = []

    m.get_cash()
    initial_cash = deepcopy(m.my_cash)
    count = 0

    m.get_securities()
    stocks = {}
    for sec, val in m.securities.iteritems():
        stock = Stock(sec, val[1], val[2])
        stocks[sec] = stock

    while True:

        # try:
        m.get_my_securities()
        m.get_cash()

        print "Our cash: ",
        print m.my_cash

        print "Our securities: "
        num_owned = 0
        for sec, val in m.my_securities.iteritems():
            if val[0] > 0:
                print sec,
                print val[0],
                print val[1]
                num_owned += 1
        for sec in selling:
            if m.my_securities[sec][0]==0:
                print "Sold "+sec
                selling.remove(sec)

        # if not holding enough stocks, buy some
        if num_owned < NUMBER_OF_STOCKS and m.my_cash > 200:

            securities = m.get_securities()

            # for sec, val in m.securities.iteritems():
            #     stocks[sec].networth_history.append(val[0])
            # length = len(history)
            # best_sec, min_gap, max_earning = "", 100, 0

            securities = []
            for sec, val in m.securities.iteritems():
                m.get_orders(sec)
                this_ord = m.orders[sec]
                bp, sp = get_buy_and_sell_prices(this_ord)
                n = m.my_cash / sp
                dividend = n * val[0] * stocks[sec].get_dividend_ratio_per_share()
                securities.append((dividend, sec))

            securities = sorted(securities)
            securities.reverse()

            for val, sec in securities:
                if stocks[sec].last_bought == 0 or stocks[sec].last_sold + REGENERATION_TIME < count:
                    m.buy_stock(sec, money=initial_cash/(NUMBER_OF_STOCKS-1))


        for sec, val in m.my_securities.iteritems():
            if val[0] > 0 and (count - stocks[sec].last_bought) > HOLDING_TIME and val[1] < DIVIDENDS_THRESHOLD:
                sell_stock(sec)

        # except:
        #     print "network error"
        count += 1
        time.sleep(1)


auto_run()

def main():

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
                if len(var) == 3:
                    m.buy_stock(var[1], int(var[2]))
                else:
                    m.buy_stock(var[1])
            elif var[0] == "s":
                if len(var) == 3:
                    m.sell_stock(var[1], int(var[2]))
                else:
                    m.sell_stock(var[1])
            elif var[0] == "bid":
                if len(var) == 4:
                    m.bid(var[1], int(var[2]), float(var[3]))
                else:
                    m.bid(var[1], int(var[2]))
            elif var[0] == "ask":
                if len(var) == 4:
                    m.ask(var[1], int(var[2]), float(var[3]))
                else:
                    m.ask(var[1], int(var[2]))

        # current_time = datetime.now().second
        # if last_time != current_time:
        #     history.append(m.get_securities())
        #     last_time = current_time
        #     count+=1
        #     print history
        # if count == 5:
        #     break
        # time.sleep(100)

# main()