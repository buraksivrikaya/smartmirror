#include <iostream>
#include <fstream>
#include <sstream>

#include <opencv2/imgcodecs.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/videoio.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/video.hpp>
#include <opencv2/face.hpp>
#include <opencv2/objdetect/objdetect.hpp>

using namespace std;
using namespace cv;
using namespace cv::face;

class FaceUtil {

private:

    CascadeClassifier faceDetector;
    Ptr<FaceRecognizer> faceModel = createLBPHFaceRecognizer();

    tuple<vector<int>, vector<Mat>, map<int, string>> readFromCsv(string csvUri) {

        vector<int> labels;
        vector<Mat> images;
        map<int, string> labelInfos;

        ifstream csv(csvUri);
        string line;
        while(getline(csv, line)) {
            stringstream lines(line);
            string labelStr, name, imageUri;
            getline(lines, labelStr, ',');
            getline(lines, name, ',');
            getline(lines, imageUri, ',');

            Mat image = imread(imageUri, IMREAD_GRAYSCALE);
            int label = atoi(labelStr.c_str());

            labels.push_back(label);
            images.push_back(image);
            labelInfos[label] = name;
        }

        return make_tuple(labels, images, labelInfos);
    }

    vector<Mat> cropFaces(Mat image) {
        vector<Rect> faceRectangles;
        faceDetector.detectMultiScale(image, faceRectangles);

        vector<Mat> faces;
        for(unsigned int i=0; i < faceRectangles.size(); i++) {
            faces.push_back(image(faceRectangles[i]));
        }
        return faces;
    }

public:

    void loadFaceDetector(string dataUri) {
        faceDetector.load(dataUri);
    }

    void loadFaceModel(string dataUri) {
        faceModel->load(dataUri);
    }

    void trainFaceModel(string csvUri) {
        auto tuple = readFromCsv(csvUri);
        faceModel->train(get<1>(tuple), get<0>(tuple));
        for (auto const& x : get<2>(tuple)) {
            faceModel->setLabelInfo(x.first, x.second);
        }
    }

    void saveFaceModel(string outputUri) {
        faceModel->save(outputUri);
    }

    void predictFromImage(Mat image, int &predict, double &confidence, string &labelInfo) {
        Mat grayImage;
        cvtColor(image, grayImage, COLOR_RGB2GRAY);

        // Only process the one with the highest (lowest in implementation) confidence
        int bestPredict = -1;
        double bestConfidence = DBL_MAX;
        vector<Mat> faces = cropFaces(grayImage);
        for(unsigned int i=0; i < faces.size(); i++) {
            int tmpPredict;
            double tmpConfidence;
            faceModel->predict(faces[i], tmpPredict, tmpConfidence);

            if(tmpConfidence < bestConfidence) {
                bestConfidence = tmpConfidence;
                bestPredict = tmpPredict;
            }
        }

        predict = bestPredict;
        confidence = bestPredict == -1 ? 0 : bestConfidence;
        labelInfo = bestPredict == -1 ? "" : faceModel->getLabelInfo(bestPredict);
    }

};