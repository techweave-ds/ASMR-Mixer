from math_utils import addition, subtract, sqrt_2

result1 = addition(10, 5)
result2 = subtract(5, 10)
result3 = sqrt_2(10)

print("Add:", result1)
print("Subtract:", result2)
print("Square:", result3)


from string_utils import *

s = "hello world"
print("Capitalized:", capitalize(s))
print("Reversed:", reverse(s))
print("Word Count:", word_count(s))

from shop_package import discount, flat_discount, calculate_total, apply_tax

prices = [500, 800, 700]

discounted = discount(500, 10)
flat = flat_discount(prices)
        

total = calculate_total(prices)
final_total = apply_tax(total)

print("Discounted Price:", discounted)
print("Flat Discount Price:", flat)
print("Total:", total)
print("After Tax:", final_total)