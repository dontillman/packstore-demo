# packstore
Demo for Tesla

The stack here is straightforward React/JavaScript on the front end, and
Django/Python/SQLite on the back end.

Back End:

Django is possibly overkill for this, but I'm used to it, it has a lot
of features built in, like cross-site protection, and it's easy to add
more features as you go, such as registering users.

Django's style is to have a site package and one or more app packages.
So this has one of each.

There are really only three interesting files here.

urls.py specs the index url to deliver the html content, and a handful
of urls for APIs to list the orders, get an order, add an order, and
change the quantity of an ordered item.

views.py defines what the requests do.

models.py defines the database, but it's also the place where
everything is spec'd.  So all the calculations of things like, say,
total price, are performed here, and not in the front end or anything.
So if some discount needs to be added, it would be messy if that
calculation was somewhere else.

The database has a single table of OrderEntrys, basically one for each
line of an order form.

Database entries are added when the user sets a quantity.  So we don't
have a lot of 0-quantity entries.  This makes it easier to add
product models in the future.

(Database entries are not removed if the user sets the quantity to zero
in case there might be interesting additional information added in the
future.)

There's a "base" OrderEntry added, where the model is an empty string,
when the user creates a new order.  That's there to reserve the order
number before the user set the quantities.


Front End:

I used the styled-components package to handle the CSS.  I find it
works very well when you're building widgets.

Pretty straightforward, but the devil is in the details.

At the top is the order selector, and a button for creating a new
order.

Once the order has been created or selected, the rest displays
everything about the order; the order form with each of the models,
quantity, price, etc.  And the summary data, total price, total
energy, total area, density, etc.  And the floor plan.

I used flexbox CSS to implement the floor plan.  The floor plan pretty
much mimics the flexbox layout mechanism anyway.

(A more adventureous approach would be a user-editable floor plan,
because they might have an odd-shaped room, or require aisles for
access or some such.  Didn't have time, but the intent was that a
floor plan could be stored in the database.)
