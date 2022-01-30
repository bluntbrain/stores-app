import React , {useEffect}from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    ToastAndroid
} from 'react-native';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthContext } from '../../components/context';

const index = ({navigation}) => {
    const [users, setUsers] = React.useState(null)

    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const { signIn } = React.useContext(AuthContext);

    useEffect(() => {
        database()
        .ref('/users')
        .once('value')
        .then(snapshot => {
          console.log('User data: ', snapshot.val());
          setUsers( snapshot.val())
        });
    }, []);
    

    const textInputChange = (val) => {
        if( val.trim().length >= 3 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 8 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const loginHandle = async() => {
        if((users['db4f73b6-5f22-4ca0-bcdb-0ad15749c46e'].name == data.username || users['f9ceb8a8-8d11-4ac2-ba8c-8771613ab2a5'].name  == data.username) && data.password == 'retailpulse'){
            if(users['db4f73b6-5f22-4ca0-bcdb-0ad15749c46e'].name == data.username){
                const jsonValue = JSON.stringify(users['db4f73b6-5f22-4ca0-bcdb-0ad15749c46e'])    
                await AsyncStorage.setItem('userToken', jsonValue)
            }
            if(users['f9ceb8a8-8d11-4ac2-ba8c-8771613ab2a5'].name == data.username){
                const jsonValue = JSON.stringify(users['f9ceb8a8-8d11-4ac2-ba8c-8771613ab2a5'])    
                await AsyncStorage.setItem('userToken', jsonValue)
            }
            signIn();
            return
        }
        else{
            ToastAndroid.show('Invalid credentials', ToastAndroid.SHORT);
        }
    }

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#757575' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Welcome to Stores App!</Text>
        </View>
        <View 
           
            style={[styles.footer, {
                // backgroundColor: colors.background
            }]}
        >
            <Text style={[styles.text_footer, {
                color: '#000000'
            }]}>Username</Text>
            <View style={styles.action}>
                {/* <FontAwesome 
                    name="user-o"
                    color={'#000000'}
                    size={20}
                /> */}
                <TextInput 
                    placeholder="Your Username"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: '#000000'
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                {data.check_textInputChange ? 
                <View
                    animation="bounceIn"
                >
                    {/* <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    /> */}
                </View>
                : null}
            </View>
            { data.isValidUser ? null : 
            <View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Username must be 3 characters long.</Text>
            </View>
            }
            

            <Text style={[styles.text_footer, {
                color: '#000000',
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                {/* <Feather 
                    name="lock"
                    color={'#000000'}
                    size={20}
                /> */}
                <TextInput 
                    placeholder="Your Password"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: '#000000'
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {/* {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    } */}
                </TouchableOpacity>
            </View>
            { data.isValidPassword ? null : 
            <View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
            </View>
            }
            

            <TouchableOpacity>
                <Text style={{color: '#009387', marginTop:15}}>Forgot password?</Text>
            </TouchableOpacity>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => loginHandle()}
                >
               
                    <Text style={[styles.textSign, {
                        color:'#000000'
                    }]}>Sign In</Text>
               
                </TouchableOpacity>
            </View>
        </View>
      </View>
    );
};

export default index;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#757575'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth:1,
        borderColor:'#000000'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
  });