import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect} from 'react';

//icons
import logoutIcon from '../../assets/icons/logout.png';
import uploadIcon from '../../assets/icons/upload.png';
import shopIcon from '../../assets/icons/shop.png';
import nostores from '../../assets/images/nostores.png';

import Fuse from "fuse.js";
import {Searchbar} from 'react-native-paper';
import database from '@react-native-firebase/database';
import Loader from '../../components/Loader';
export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [storesArray, setStoresArray] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    database()
      .ref('/stores')
      .once('value')
      .then(snapshot => {
        // console.log('User data: ', snapshot.val());
        var result = Object.keys(snapshot.val()).map(key => [
          key,
          snapshot.val()[key],
        ]);
        console.log('User data: ', result.length);
        setStoresArray(result);
        setIsLoading(false)
      });
      setTimeout(() => {
        setIsLoading(false)
      }, 3000);
  }, []);

  const getAllMyStores = () => {};

  const onChange = (searchText) => {
    const options = {
    isCaseSensitive: false,
    threshold: 0.3,
    // keys: [
    //   "status",
    //   "ordered_items.product_name",
    //   "ordered_items.subscription_plan.plan_name",
    //   "ordered_items.subscription_plan.service_name",
    // ],
  };
    setSearchQuery(searchText)
    const fuseCategory = new Fuse(storesArray, options);
    var temp = fuseCategory.search(searchText);
    let dummyArray = [];
    temp.forEach((item) => {
      dummyArray.push(item.item);
    });
    // setSearchData(dummyArray);
    console.log("searched leads ==", dummyArray);
  };
  const renderItem = ({item}) => (
    <View style={styles.storeCard}>
      <View style={styles.storeCardLeft}>
        <Image source={shopIcon} style={styles.storeImage} />
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.storeName}>{item[1].name}</Text>
          <Text style={styles.storeDetails}>
            {item[1].type} || {item[1].area}{' '}
          </Text>
        </View>
      </View>
      <View style={styles.storeCardRight}>
        <Image source={uploadIcon} style={styles.storeImage} />
      </View>
    </View>
  );

  return (
    <>
    <View>
      <View style={styles.topContainer}>
        <Text style={styles.welcome}>Welcome, Ishan</Text>
        <Image source={logoutIcon} style={styles.logout} />
      </View>
      <Searchbar
        placeholder="Search"
        onChangeText={onChange}
        value={searchQuery}
        style={styles.search}
        iconColor='#545454'
      />
      {storesArray.length > 0 || isLoading? (
        <FlatList
          data={storesArray}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center",marginHorizontal:20}}>
       <Image source={nostores} style={{marginBottom:30, height:250, width:250}}/>
        <Text style={{ color: '#757575',textAlign:'center',lineHeight:22,fontSize:16}}>
         Oops! No stores found.
        </Text>
      </View>
      )}
    </View>
    <Loader isLoading={isLoading}/>
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
});
