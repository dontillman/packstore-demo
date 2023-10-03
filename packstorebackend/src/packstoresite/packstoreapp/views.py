# Copyright 2023, J. Donald Tillman, all rights reserved
#
# Responses to page and api requests.

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from packstoreapp import models
from json import loads

# Render the index page
def index(request):
    context = {}
    return render(request, 'packstoreapp/index.html', context)

# API for a list of orders
def orders(request):
    return JsonResponse({'orders': models.orders()})

# API for an order JSON
def getorder(request):
    ordernumber = loads(request.body)['order']
    return JsonResponse(models.get_order(ordernumber))

# API to create a new order
def neworder(request):
    order = models.new_order()
    return JsonResponse({'order': order.order})

# API to set the quantity
# args are order, model, quantity
# returns the order JSON (just like getorder())
def setquantity(request):
    args = loads(request.body)
    models.set_quantity(args['order'], args['model'], args['quantity'])
    return JsonResponse(models.get_order(args['order']))
