import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import '../services/googleSignin';

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);

  const signIn = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      setIsLoading(false);
      if (isSuccessResponse(response)) {
        setData(response.data);
      } else {
        console.log('SIGNIN FAILURE');
      }
    } catch (error) {
      setIsLoading(false);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("PLAY SERVICES NOT AVAILABLE ON USER'S DEVICE");
            break;
          case statusCodes.SIGN_IN_REQUIRED:
            console.log('SIGNIN REQUIRED');
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('SIGNIN CANCELLED');
          default:
            console.log('ERROR SIGNING IN', JSON.stringify(error));
        }
      } else {
        console.log('ERROR SIGNING IN: ELSE CASE', error);
      }
    }
  };
  return (
    <>
      <TouchableOpacity
        onPress={signIn}
        disabled={isLoading}
        style={{
          padding: 16,
          borderWidth: 1,
          borderColor: 'khaki',
          borderRadius: 4,
        }}>
        {isLoading ? (
          <ActivityIndicator size={'small'} />
        ) : (
          <Text>Google Signin</Text>
        )}
      </TouchableOpacity>
      <Text>{JSON.stringify(data)}</Text>
    </>
  );
};

export default Signin;
