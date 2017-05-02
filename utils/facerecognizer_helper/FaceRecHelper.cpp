#include "opencv2/core.hpp"
#include "opencv2/face.hpp"
#include "opencv2/highgui.hpp"
#include "opencv2/imgproc/imgproc.hpp"
#include "opencv2/objdetect/objdetect.hpp"

#include <iostream>
#include <fstream>

std::vector<cv::Rect> detectFaces(cv::Mat);
void highligt(cv::Mat, cv::Rect);

cv::CascadeClassifier cclassifier;

int main(int argc, const char *argv[]) {
	if(argc != 2) {
		std::cout << "invalid usage, need: <lbl_int>" << std::endl;
		return -1;
	}

	if(!cclassifier.load("lbpcascade_frontalface.xml")) {
		std::cout << "failed to load face classifier data" << std::endl;
		return -1;
	}

	cv::VideoCapture cap(0);
	if(!cap.isOpened()) {
		std::cout << "failed to open camera" << std::endl;
		return -1;
	}

	int imgCnt = 0;
	std::ofstream csv("imgs.csv");
	for(;;) {
		cv::Mat frame;
		cap >> frame;

		std::vector<cv::Rect> faceRects;

		if(!frame.empty()) {
			faceRects = detectFaces(frame);
			if(faceRects.size() > 0) {
				// highlight the detected face, only first one
				cv::Rect cropRect(faceRects[0].x -2, faceRects[0].y -2, faceRects[0].width +4, faceRects[0].height +4);
				cv::rectangle(frame, cropRect, cv::Scalar(0, 255,0), 2);	
			}
			cv::imshow("FaceRecHelper", frame);
		} else {
			std::cout << "empty frame" << std::endl;
		}

		int k = cv::waitKey(10);
		switch(k) {
			// press 'q' to exit the program
			case 81: case 113:
				csv.close();
				return 0;
				break;
			// press 's' to snapshot the face
			case 83: case 115:
				if(faceRects.size() > 0) {
					std::string fn = "face" + std::to_string(imgCnt++) + ".jpg";
					cv::imwrite(fn, frame(faceRects[0]));
					csv << fn + ";" + argv[1] + "\n";
				}
				break;
		}
	}
	return 0;
}

std::vector<cv::Rect> detectFaces(cv::Mat frame) {
	std::vector<cv::Rect> faceRects;
	cclassifier.detectMultiScale(frame, faceRects);
	return faceRects;	
}