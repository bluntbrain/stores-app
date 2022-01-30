import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useEffect} from 'react';
import {BottomSheet} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

//icons
import logoutIcon from '../../assets/icons/logout.png';
import uploadIcon from '../../assets/icons/upload.png';
import shopIcon from '../../assets/icons/shop.png';
import nostores from '../../assets/images/nostores.png';

//context
import {AuthContext} from '../../components/context';

import Fuse from 'fuse.js';
import {Searchbar} from 'react-native-paper';
import database from '@react-native-firebase/database';
import Loader from '../../components/Loader';
export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchedLeads, setSearchedLeads] = React.useState([]);
  const [showBottomSheet, setShowBottomSheet] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState('');
  const [storesArray, setStoresArray] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUSer, setCurrentUser] = React.useState(null);

  const {signOut} = React.useContext(AuthContext);

  useEffect(() => {
    getCurrentUser().then(resUser => {
      console.log('user in home ===', resUser);
      let parsedUser = JSON.parse(resUser)
      setCurrentUser(parsedUser)
      database()
        .ref('/stores')
        .once('value')
        .then(snapshot => {
          let dummyArray = [];
          var result = Object.keys(snapshot.val()).map(key => [
            key,
            snapshot.val()[key],
          ]);
          let allStores = Object.values(snapshot.val());
          allStores.forEach((item, index) => {
            item.id = result[index][0];
          });

          allStores.forEach(item => {
            if (parsedUser?.stores.includes(item.id)) {
              dummyArray.push(item);
            }
          });

          console.log('User data: ', dummyArray);
          setStoresArray(dummyArray);
          setIsLoading(false);
        });
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  const getCurrentUser = async () => {
    return await AsyncStorage.getItem('userToken');
    console.log('user in home ===', user);
    setCurrentUser(user);
  };

  const onPickImage = () => {
    console.log('onPickImage');
    let options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
    };
    try {
      launchImageLibrary(options, res => {
        if (
          res?.assets != undefined &&
          res?.assets != null &&
          res?.assets[0]?.uri != null
        ) {
          console.log(res?.assets[0]?.uri);
          uploadImage(res?.assets[0]?.uri);
        }
      });
    } catch (error) {
      console.log('error');
      setIsLoadingInside(false);
    }
  };

  const onPickFromCamera = () => {
    console.log('onPickImage');
    let options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
    };
    try {
      launchCamera(options, res => {
        if (
          res?.assets != undefined &&
          res?.assets != null &&
          res?.assets[0]?.uri != null
        ) {
          console.log(res?.assets[0]?.uri);
          uploadImage(res?.assets[0]?.uri);
        }
      });
    } catch (error) {
      console.log('error');
      setIsLoadingInside(false);
    }
  };

  const uploadImage = async (uri, type) => {
    setShowBottomSheet(false);
    setIsLoading(true);
    let key = parseInt(Math.random() * 100);
    const filename = uri.substring(uri.lastIndexOf('/images') + 1);
    const data = await RNFS.readFile(uri, 'base64');
    const imageRef = storage().ref(filename);
    await imageRef.putString(data, 'base64');
    const url = await imageRef.getDownloadURL();
    console.log('uploading image .....', url);
    database()
      .ref(`/images/${selectedId}/${key}`)
      .update({
        imageUrl: url,
      })
      .then(() => {
        setIsLoading(false);
        ToastAndroid.show('Image uploaded successfully!', ToastAndroid.SHORT);
        console.log('Data set.');
      });
    setIsLoading(false);
    setShowBottomSheet(false);
  };
  const onChange = searchText => {
    const options = {
      isCaseSensitive: false,
      threshold: 0.1,
      keys: ['name', 'type', 'area', 'address'],
    };
    setSearchQuery(searchText);
    const fuseCategory = new Fuse(storesArray, options);
    var temp = fuseCategory.search(searchText);
    let dummyArray = [];
    temp.forEach(item => {
      dummyArray.push(item.item);
    });
    // setSearchData(dummyArray);
    setSearchedLeads(dummyArray);
    console.log('searched leads ==', dummyArray);
  };
  const renderItem = ({item}) => (
    <View style={styles.storeCard}>
      <View style={styles.storeCardLeft}>
        <Image source={shopIcon} style={styles.storeImage} />
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.storeName}>{item.name}</Text>
          <Text style={styles.storeDetails}>
            {item.type} || {item.area}{' '}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.storeCardRight}
        onPress={() => {
          setShowBottomSheet(true);
          setSelectedId(item.id);
        }}>
        <Image source={uploadIcon} style={styles.storeImage} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View>
        <View style={styles.topContainer}>
          <Text style={styles.welcome}>Hi, {currentUSer?.name}</Text>
          <TouchableOpacity onPress={() => signOut()}>
            <Image source={logoutIcon} style={styles.logout} />
          </TouchableOpacity>
        </View>
        <Searchbar
          placeholder="Search"
          onChangeText={onChange}
          value={searchQuery}
          style={styles.search}
        />
        {searchedLeads.length > 0 ? (
          <Text style={styles.title}>{searchedLeads.length} results</Text>
        ) : (
          <Text style={styles.title}>Stores </Text>
        )}
        {storesArray.length > 0 || isLoading ? (
          <FlatList
            data={searchedLeads.length > 0 ? searchedLeads : storesArray}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 20,
            }}>
            <Image
              source={nostores}
              style={{marginBottom: 30, height: 250, width: 250}}
            />
            <Text
              style={{
                color: '#757575',
                textAlign: 'center',
                lineHeight: 22,
                fontSize: 16,
              }}>
              Oops! No stores found.
            </Text>
          </View>
        )}
      </View>
      <Loader isLoading={isLoading} />
      <BottomSheet modalProps={{}} isVisible={showBottomSheet}>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}>
          <View
            style={{
              backgroundColor: '#EE5253',
              padding: 10,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: '#ffffff',
                fontSize: 18,
                fontWeight: '800',
              }}>
              Upload Image
            </Text>
            <Icon
              onPress={() => setShowBottomSheet(false)}
              name="close"
              size={20}
              style={{alignSelf: 'flex-end'}}
              color="#ffffff"
            />
          </View>
          <TouchableOpacity onPress={() => onPickImage()}>
            <Text style={styles.bottomSheetOption}>
              Choose picture from gallery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPickFromCamera()}>
            <Text style={styles.bottomSheetOption}>Click from camera</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#efefef',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logout: {
    width: 40,
    height: 40,
    margin: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '800',
    marginHorizontal: 20,
    marginTop: 30,
  },
  search: {
    backgroundColor: '#ffffff',
    margin: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#757575',
  },
  storeCard: {
    flexDirection: 'row',
  },
  storeCardLeft: {
    backgroundColor: '#ffffff',
    // width:'90%',
    height: 75,
    flex: 4,
    marginLeft: 12,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    elevation: 1,
  },

  storeCardRight: {
    backgroundColor: '#ffffff',
    flex: 1,
    // width:'90%',
    height: 75,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  storeDetails: {
    fontSize: 12,
    color: '#757575',
  },
  storeImage: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    color: '#000000',
  },
  bottomSheetOption: {
    textAlign: 'center',
    padding: 20,
    color: '#999999',
    fontWeight: '700',
    fontSize: 14,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
});
