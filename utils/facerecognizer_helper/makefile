CC= g++
OBJS= FaceRecHelper.o
CFLAGS+= `pkg-config --cflags opencv`
LFLAGS+= `pkg-config --libs opencv`

FaceRecHelper: $(OBJS)
	$(CC) $(LFLAGS) $(OBJS) -o FaceRecHelper