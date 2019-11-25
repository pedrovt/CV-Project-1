from math import pi, cos, sin
n = int(input())
r = 0.8

verticesArray = []
indicesArray = []

for i in range(n):
	arg = 2*i*pi/n
	verticesArray.append(cos(arg))
	verticesArray.append(0)
	verticesArray.append(sin(arg))
	verticesArray.append(cos(arg))
	verticesArray.append('h')
	verticesArray.append(sin(arg))

for j in range(n):
	i = 2*j
	# == Top Triangle ==
	indicesArray.append((i+1)%(2*n))
	indicesArray.append((i+3)%(2*n))
	indicesArray.append(2*n+1)
	# == Bottom Triangle ==
	indicesArray.append(i%(2*n))
	indicesArray.append((i+2)%(2*n))
	indicesArray.append(2*n)
	# == Upper Left Triangle ==
	indicesArray.append(i%(2*n))
	indicesArray.append((i+1)%(2*n))
	indicesArray.append((i+3)%(2*n))
	# == Lower Right Triangle ==
	indicesArray.append(i%(2*n))
	indicesArray.append((i+2)%(2*n))
	indicesArray.append((i+3)%(2*n))

verticesArray.append(0)
verticesArray.append(0)
verticesArray.append(0)
verticesArray.append(0)
verticesArray.append('h')
verticesArray.append(0)

print('this.vertices = [')
for i in range(int(len(verticesArray)/3)):
	index = i*3
	print('r*'+str(verticesArray[index])+', '+str(verticesArray[index+1])+', '+'r*'+str(verticesArray[index+2])+',')
print(']')

print('\n\nthis.vertexIndices = [')
for i in range(int(len(indicesArray)/3)):
	index = i*3
	print(str(indicesArray[index])+', '+str(indicesArray[index+1])+', '+str(indicesArray[index+2])+',')
print(']')