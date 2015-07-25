
import socket
import sys
import datetime


user = "Shakalaka"
password = "sky199"

def run(*commands):
    HOST, PORT = "codebb.cloudapp.net", 17429

    return_lines = []
    data=user + " " + password + "\n" + "\n".join(commands) + "\nCLOSE_CONNECTION\n"

    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        sock.connect((HOST, PORT))
        sock.sendall(data)
        sfile = sock.makefile()
        rline = sfile.readline()
        while rline:
            print(rline.strip())
            return_lines.append(rline.strip())
            rline = sfile.readline()
    finally:
        sock.close()

    return return_lines

    def subscribe(user, password):
        HOST, PORT = "codebb.cloudapp.net", 17429

        data=user + " " + password + "\nSUBSCRIBE\n"

        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

            sock.connect((HOST, PORT))
            sock.sendall(data)
            sfile = sock.makefile()
            rline = sfile.readline()
            while rline:
                print(rline.strip())
                rline = sfile.readline()
        finally:
            sock.close()

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
        return self.orders

    def buy_stock(self, stock, share=-1):
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
            num_shares = int(self.my_cash / buying_price)

            if num_shares < 2:
                break

            if num_shares > share and share != -1:
                num_shares = share

            print "Buying %s: %d shares at %f" % (stock, num_shares, buying_price)
            run("BID %s %f %d" % (stock, buying_price, num_shares))
            share -= num_shares

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

            if num_shares == 0:
                break

            print "Selling %s: %d shares at %f" % (stock, num_shares, selling_price)
            run("ASK %s %f %d"% (stock, selling_price, num_shares))
            share -= num_shares

