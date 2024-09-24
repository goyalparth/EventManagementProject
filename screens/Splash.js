import {StackActions, useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Signin'}],
      });
    }, 0);
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size={'large'} color={'khaki'} />
    </View>
  );
};

export default Splash;
