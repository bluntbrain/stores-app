# stores-app
A simple Mobile Application to collect Images from Stores.

![634unh](https://user-images.githubusercontent.com/34113569/151647878-296c3c43-aed0-4974-af17-5e08315a6c90.gif)


Cases handled<br/>
1. If there are no stores found based on the search query user enters, show a vector and text saying "Oops! No stores found!"</br>
2. Show a loader when the image in uploading to cloud db and also while fetching data from db to improve user experience </br>
3. Implement universal search based on all keys present in a store object like: name, type, area etc.</br>
4. Data is beign stored and fetched from firbase realtime database </br>
5. Option for the user to either upload an image from gallary or click an image from camera (camera and files access permission requested from user)</br>
6. Firebase DB structure to store multiple images uploaded by the user for a particular store</br>

</br></br>

How we can make the application better?</br>
1. Backend API can be created return results based on user search query to reduce computation on front-end, and move that computation to backend. </br>
2. Use the library react-native-image-crop-picker, instead of react-native-image-picker to support multiple image selection and uploading in background </br>
