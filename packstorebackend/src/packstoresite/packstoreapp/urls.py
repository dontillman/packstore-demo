from django.urls import path

from . import views

urlpatterns = [
    path('api/orders', views.orders),
    path('api/neworder', views.neworder),
    path('api/getorder', views.getorder),
    path('api/setquantity', views.setquantity),
    path('', views.index, name='index'),
]
