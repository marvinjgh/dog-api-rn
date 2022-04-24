import {StyleSheet, View, TextInput as NativeTextInput} from 'react-native';
import {TextInput, Button, Headline} from 'react-native-paper';
import React from 'react';
import {useDispatch} from 'react-redux';
import {login} from '../redux/appSlice';
import {RootStackScreenProps} from '../navigations/types';
import ScreenLayout from '../components/ScreenLayout';
import Theme from '../constants/Theme';

export default function SignIn({}: RootStackScreenProps<'SignIn'>) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const nameRef = React.useRef<NativeTextInput>(null);
  const emailRef = React.useRef<NativeTextInput>(null);

  const dispatch = useDispatch();

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.box}>
          <Headline style={styles.title}>Welcome to Dog.ceo App</Headline>
          <View style={styles.boxInput}>
            <TextInput
              label={'Name'}
              mode="outlined"
              returnKeyType="next"
              ref={nameRef}
              value={name}
              onChangeText={setName}
              onSubmitEditing={() => {
                emailRef.current?.focus();
              }}
              style={styles.input}
            />
          </View>
          <View style={styles.boxInput}>
            <TextInput
              label={'Email'}
              mode="outlined"
              keyboardType="email-address"
              ref={emailRef}
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>
          <Button
            mode="contained"
            onPress={() => {
              // TODO manejo de campos vacios
              dispatch(login({name, email}));
            }}
            style={styles.button}>
            Sign In
          </Button>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  box: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: Theme.roundness * 2,
    borderWidth: 1,
    padding: 16,
  },
  title: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  boxInput: {
    marginBottom: 16,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#fff',
  },
  button: {minHeight: 56, justifyContent: 'center'},
});
