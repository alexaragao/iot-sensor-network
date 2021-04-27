from math import log, e

# NC XH103 10k

R1 = 22021
T1 = 5

R2 = 10000
T2 = 25

R3 = 4917
T3 = 45

# Code
T1_kelvin = T1 + 273.15
T2_kelvin = T2 + 273.15
T3_kelvin = T3 + 273.15

L1 = log(R1, e)
L2 = log(R2, e)
L3 = log(R3, e)

Y1 = 1/T1_kelvin
Y2 = 1/T2_kelvin
Y3 = 1/T3_kelvin

gama2 = (Y2 - Y1)/(L2 - L1)
gama3 = (Y3 - Y1)/(L3 - L1)

C = (gama3 - gama2)/(L3 - L2) * (L1+L2+L3) ** (-1)
B = gama2 - C*(L1**2 + L1*L2 + L2**2)
A = Y1 - (B + (L1**2) * C)*L1

print('A =', A)
print('B =', B)
print('C =', C)