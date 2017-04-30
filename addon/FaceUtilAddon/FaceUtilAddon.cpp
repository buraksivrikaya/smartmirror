#include <node.h>
#include <uv.h>

#include <string>
#include <iostream>
#include <sys/syscall.h>
#include <stdlib.h>
#include <unistd.h>

#include "FaceUtil.cpp"

using namespace std;

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;
using v8::Exception;
using v8::Persistent;
using v8::Function;
using v8::Null;

FaceUtil faceUtil;

uv_async_t handle;
Persistent<Function> *callback;
int confidenceThreshold;
bool stopFlag = true;

void startListening(void *arg) {
	VideoCapture cam(0);
	Mat frame;
	while(cam.isOpened() && !stopFlag) {
		cam >> frame;

		int predict = -1;
        double confidence;
        string labelInfo;

        faceUtil.predictFromImage(frame, predict, confidence, labelInfo);
        if(predict != -1 && confidence < confidenceThreshold) {
            handle.data = static_cast<void*>(&labelInfo);
            uv_async_send(&handle);
        }
        usleep(50000);
	}
}

void doCallBack(uv_async_t* handle) {
	auto isolate = v8::Isolate::GetCurrent();
	v8::HandleScope scope(isolate);
	v8::Local<v8::Function> f = v8::Local<Function>::New(isolate, *callback);
    const unsigned argc = 1;
    string labelInfo = *static_cast<string*>(handle->data);
	Local<Value> argv[argc] = { v8::String::NewFromUtf8(isolate, labelInfo.c_str()) };
	f->Call(v8::Null(isolate), argc, argv);
}

void startListening(const FunctionCallbackInfo<Value>& args) {
	uv_thread_t id;
	uv_thread_create(&id, startListening, NULL);
	stopFlag = false;
}

void onDetected(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();
	if(args.Length() < 2 || !args[0]->IsNumber() || !args[1]->IsFunction()) {
		isolate->ThrowException(v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "Wrong arguments")));
	}
	// Save threshold
	confidenceThreshold = args[0]->NumberValue();
	// Save callback function
    callback = new Persistent<Function>();
    callback->Reset(isolate, Local<Function>::Cast(args[1]));
}

void stopListening(const FunctionCallbackInfo<Value>& args) {
	stopFlag = true;
	uv_stop(uv_default_loop());
}

void close(const FunctionCallbackInfo<Value>& args) {
	uv_close((uv_handle_t*) &handle, NULL);
}

void loadFaceDetector(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();
	if(args.Length() < 1 || !args[0]->IsString()) {
		isolate->ThrowException(v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "Wrong arguments")));
	}

	v8::String::Utf8Value arg0(args[0]->ToString());
	std::string uri = std::string(*arg0);
	faceUtil.loadFaceDetector(uri);
}

void trainFaceModel(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();
	if(args.Length() < 1 || !args[0]->IsString()) {
		isolate->ThrowException(v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "Wrong arguments")));
	}

	v8::String::Utf8Value arg0(args[0]->ToString());
	std::string uri = std::string(*arg0);
	faceUtil.trainFaceModel(uri);
}

void saveFaceModel(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();
	if(args.Length() < 1 || !args[0]->IsString()) {
		isolate->ThrowException(v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "Wrong arguments")));
	}

	v8::String::Utf8Value arg0(args[0]->ToString());
	std::string uri = std::string(*arg0);
	faceUtil.saveFaceModel(uri);
}

void loadFaceModel(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();
	if(args.Length() < 1 || !args[0]->IsString()) {
		isolate->ThrowException(v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "Wrong arguments")));
	}

	v8::String::Utf8Value arg0(args[0]->ToString());
	std::string uri = std::string(*arg0);
	faceUtil.loadFaceModel(uri);
}

void init(Local<Object> exports) {
	NODE_SET_METHOD(exports, "stopListening", stopListening);
	NODE_SET_METHOD(exports, "onDetected", onDetected);
	NODE_SET_METHOD(exports, "startListening", startListening);

	NODE_SET_METHOD(exports, "loadFaceDetector", loadFaceDetector);
	NODE_SET_METHOD(exports, "trainFaceModel", trainFaceModel);
	NODE_SET_METHOD(exports, "saveFaceModel", saveFaceModel);
	NODE_SET_METHOD(exports, "loadFaceModel", loadFaceModel);
	NODE_SET_METHOD(exports, "close", close);
	// init
	uv_async_init(uv_default_loop(), &handle, doCallBack);
}
 
NODE_MODULE(FaceUtilAddon, init);