from market import Market
from pprint import pprint


m = Market()

print "My Securities:"

pprint(m.get_my_securities())

print "\nCash:",
print m.get_cash()
print ""

print "All Securities:"
pprint(m.get_securities())