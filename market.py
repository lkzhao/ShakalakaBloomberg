
import socket
import sys


user = "Shakalaka"
password = "sky199"


HOST, PORT = "codebb.cloudapp.net", 17429
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((HOST, PORT))

sock.sendall(user + " " + password + "\n")

def closesock():
    sock.sendall("CLOSE_CONNECTION\n")
    sock.close()

import atexit
atexit.register(closesock)

def run(*commands):

    return_lines = []
    data = "\n".join(commands) + "\n"

    try:
        ret = ""
        sock.sendall(data)
        while True:
            c = sock.recv(1)
            if c == '\n' or c == '':
                break
            else:
                ret += c
        return [ret]
    except KeyboardInterrupt:
      closesock()
    except:
      print "Warning: network failed"

    return return_lines

# Max buy and min sell prices
def get_buy_and_sell_prices(order):
    cur_buy = 0
    cur_sell = 1000
    for bid_ask, name, price, nshare in order:
        if bid_ask == "BID":
            if price > cur_buy:
                cur_buy = price
        if bid_ask == "ASK":
            if price < cur_sell:
                cur_sell = price
    return (cur_buy, cur_sell)

class Market:

    securities = {}
    orders = {}
    my_cash = 0
    my_securities = {}
    my_orders = {}

    def run(self, *commands):
        run(*commands)

    # Query all the securities
    def get_securities(self):
        inp = run("SECURITIES")[0].split()[1:]
        for i in range(len(inp)/4):
            self.securities[inp[4*i]] = (float(inp[4*i+1]), float(inp[4*i+2]), float(inp[4*i+3]))
        return self.securities

    def get_cash(self):
        self.my_cash = float(run("MY_CASH")[0].split()[1])
        return self.my_cash

    def get_my_securities(self):
        self.my_securities = {}
        inp = run("MY_SECURITIES")[0].split()[1:]
        for i in range(len(inp)/3):
            self.my_securities[inp[3*i]] = (int(inp[3*i+1]), float(inp[3*i+2]))
        return self.my_securities

    def get_my_orders(self):
        self.my_orders = {}
        inp = run("MY_ORDERS")[0].split()[1:]
        for i in range(len(inp)/4):
            self.my_orders[inp[4*i+1]] = (inp[4*i], float(inp[4*i+2]), float(inp[4*i+3]))
        return self.my_orders

    def get_orders(self, stock):
        inp = run("ORDERS " + stock)[0].split()[1:]
        out = []
        for i in range(len(inp)/4):
            out.append( (inp[4*i], inp[4*i+1], float(inp[4*i+2]), int(inp[4*i+3])) )
        self.orders[stock] = out
        return out

    def get_all_orders(self):
        for k in self.securities.keys():
            self.get_orders(k)
        return self.orders

    def bid(self, stock, price, share=-1):
        # Buy the specified number of shares, or with all our money if -1
        self.get_cash()
        if share == -1:
            num_shares = int(self.my_cash / price)
        else:
            num_shares = share

        print "Biding %s: %d shares at %f" % (stock, num_shares, price)
        run("BID %s %f %d" % (stock, price, num_shares))

    def ask(self, stock, price, share=-1):
        # Buy the specified number of shares, or with all our money if -1
        self.get_my_securities()
        if share == -1:
            num_shares = int(self.my_securities[stock][0])
        else:
            num_shares = share

        print "Asking %s: %d shares at %f" % (stock, num_shares, price)
        run("ASK %s %f %d"% (stock, price, num_shares))

    def buy_stock(self, stock, share=-1, money=-1):
        """
        Buy the specified number of shares, or with all our money if -1

        while we haven't bought enough:
          get lowest seller
          bid that much
        """

        while share != 0:
            self.get_cash()
            self.get_orders(stock)
            this_ord = self.orders[stock]

            cur_buy, cur_sell = get_buy_and_sell_prices(this_ord)

            # assume we can buy at cur_sell
            buying_price = cur_sell + 0.1

            available_money = self.my_cash
            if money != -1 and money < available_money:
                available_money = money

            num_shares = int(available_money / buying_price)

            if num_shares < 2:
                break

            if num_shares > share and share != -1:
                num_shares = share

            print "Buying %s: %d shares at %f" % (stock, num_shares, buying_price)
            run("BID %s %f %d" % (stock, buying_price, num_shares))
            share -= num_shares
            money -= num_shares * buying_price

    def bid(self, stock, share, price):
        run("BID %s %f %d" % (stock, price, share))

    def ask(self, stock, share, price):
        run("ASK %s %f %d" % (stock, price, share))

    def sell_stock(self, stock, share=-1):
        """
        Dump the specified number of shares, or everything if -1 (don't do this lol)

        while we still have stock:
          get highest buyer
          ask that much
        """
        while True:
            self.get_my_securities()
            self.get_orders(stock)
            this_ord = self.orders[stock]

            cur_buy, cur_sell = get_buy_and_sell_prices(this_ord)

            # assume we can sell at cur_buy
            selling_price = cur_buy - 0.1
            num_shares = int(self.my_securities[stock][0])

            if num_shares > share and share != -1:
                num_shares = share

            if num_shares <= 0:
                break

            print "Selling %s: %d shares at %f" % (stock, num_shares, selling_price)
            run("ASK %s %f %d"% (stock, selling_price, num_shares))
            share -= num_shares


class Stock:
    name = ""
    last_bought = 0
    last_sold = 0
    # networth_history = []
    volatility = 0
    dividend = 0
    shares = 0

    def set_data(self):
        inp = run("ORDERS " + self.name)[0].split()[1:]
        shares = 0
        for i in range(len(inp)/4):
            shares += int(inp[4*i+3])
        self.shares = shares

    def __init__(self, name, dividend, volatility):
        self.name = name
        self.dividend = dividend
        self.volatility = volatility
        self.set_data()

    def get_dividend_ratio_per_share(self):
        return (self.dividend / self.shares)


