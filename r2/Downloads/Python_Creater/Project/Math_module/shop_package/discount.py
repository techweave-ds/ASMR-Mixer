def discount(price, percentage):
    return price - (price * percentage / 100)
    ##if percentage == 0 or len(str(percentage)) == 0:
    ##    return price-50
def flat_discount(price):
    return price - 50