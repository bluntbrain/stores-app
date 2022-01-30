# stores-app
A simple Mobile Application to collect Images from Stores.<br/>

![Screen Recording 2022-01-30 at 12 08 34 PM](https://user-images.githubusercontent.com/34113569/151689609-6824d592-e046-4bac-93b3-0c9d6898b82c.gif)

</br>Context Demo and User Login demo</br>

![Screen Recording 2022-01-30 at 12 10 07 PM](https://user-images.githubusercontent.com/34113569/151689600-054c2f84-045c-4180-8196-d779cbe19f4c.gif)

</br>Upload Image demo with 2 options "Choose from camera" and "Choose from Gallery:</br>

![Screen Recording 2022-01-30 at 12 09 36 PM](https://user-images.githubusercontent.com/34113569/151689607-b3d060f5-43de-46b9-a909-b3134ea1b357.gif)

</br>Dyamic Search demo, user can search any store by entering the store name, location, type etc.</br>


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
