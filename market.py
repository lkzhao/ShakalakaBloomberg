
import socket
import sys


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
