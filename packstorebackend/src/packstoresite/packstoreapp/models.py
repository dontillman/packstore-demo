# Copyright 2023, J. Donald Tillman, all rights reserved

import operator
import math
from django.db import models

# All the product data is centralized here.

MODELS = [{'name': 'MegapackXL',  'size': [40, 10], 'energy': 4.0e6, 'cost': 120_000, 'release': 2022},
          {'name': 'Megapack2',   'size': [30, 10], 'energy': 3.0e6, 'cost': 80_000,  'release': 2021},
          {'name': 'Megapack',    'size': [30, 10], 'energy': 2.0e6, 'cost': 50_000,  'release': 2005},
          {'name': 'PowerPack',   'size': [10, 10], 'energy': 1.0e6, 'cost': 10_000,  'release': 2000},
          {'name': 'Transformer', 'size': [10, 10], 'energy':     0, 'cost': 10_000}]


# Orders are numbered, incrementing from 0 (or whatever you'd like)
# Each order contains a number of entries, one per product ordered.
# Each order entry includes a quantity.
# There's also a base order entry, with a product of '', that functions
# to stake out an order number before the user has set any quantities.
#
# The database only needs to have a table of OrderEntrys.

class OrderEntry(models.Model):
    order = models.IntegerField()
    model = models.CharField(max_length=64)
    quantity = models.IntegerField()
    
    def model_data(self):
        return next(data
                    for data in MODELS
                    if self.model == data['name'])

    def extended_price(self):
        return self.quantity * self.model_data()['cost']
    
# return a list of the order numbers
def orders():
    return [entry.order
            for entry in OrderEntry.objects.filter(model='')]

# creates a new order with a base entry (model is '')
def new_order():
    i = (OrderEntry.objects.aggregate(models.Max('order'))['order__max'] or 0) + 1
    order = OrderEntry(order=i, model='', quantity=0)
    order.save()
    return order

def get_order(order_number):
    # db entries for a given order id, not including the base entry
    entries = [entry
               for entry in OrderEntry.objects.filter(order=order_number)
               if entry.model]
    price = sum(map(lambda e: e.extended_price(), entries))
    energy = sum(map(lambda e: e.quantity * e.model_data()['energy'], entries))
    area = sum(map(lambda e: e.quantity * operator.mul(*e.model_data()['size']), entries))

    packcount = sum(entry.quantity
                    for entry in entries
                    if entry.model != 'Transformer')
    
    return {'transformers': math.ceil(packcount/2),
            'price': price,
            'energy': energy,
            'area': area,
            'density': (energy / area) if area else 0,
            'entries': get_order_entries(order_number)}

# content of the order form, json 
# get the models, and fill in quantities from the db
#
# Returns:
#   cost
#   energy
#   extended (extended price)
#   name (model name)
#   order (order number)
def get_order_entries(order_number):
    entries = list(map(dict, MODELS))
    for entry in entries:
        db_entry = OrderEntry.objects.filter(order=order_number, model=entry['name']).first()
        entry['order'] = order_number
        if db_entry:
            entry['quantity'] = db_entry.quantity
            entry['extended'] = db_entry.extended_price()
        else:
            entry['quantity'] = 0
            entry['extended'] = 0
        # not going to include the transformer energy spec
        if 'Transformer' == entry['name']:
            entry['energy'] = '';
    return entries
    
# change the quantity of this model in this order
def set_quantity(order, model, quantity):
    entry = OrderEntry.objects.filter(order=order, model=model).first()
    if not entry:
        entry = OrderEntry(order=order, model=model, quantity=quantity)
    entry.quantity = quantity
    entry.save()


