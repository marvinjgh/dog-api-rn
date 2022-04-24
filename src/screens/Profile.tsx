import {
  ActivityIndicator,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {logout, setBreedFav, State} from '../redux/appSlice';
import {useDispatch, useSelector} from 'react-redux';
import {
  Button,
  Subheading,
  TextInput,
  Title,
  Modal,
  Portal,
  IconButton,
} from 'react-native-paper';
import {getRandomImg} from '../apis/dogceo';
import Theme from '../constants/Theme';
import ScreenLayout from '../components/ScreenLayout';

const Profile = () => {
  const localState = useSelector<State, State>(state => state);
  let favorites = localState.breeds.filter(breed => {
    return breed.fav || breed.subs?.some(sub => sub.fav);
  });

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [random, setRandom] = useState('');
  const [error, setError] = useState();
  const [breed, setBreed] = useState<any>();

  const showModal = async () => {
    setError(undefined);
    setVisible(true);
    setLoading(true);
    try {
      const res = await getRandomImg();
      const regex = /https:\/\/images\.dog\.ceo\/breeds\/(.*)\/.*\.jpg/;
      const breedName = regex.exec(res.message as string);
      if (breedName) {
        const nameParts = breedName[1].split('-');
        const localB = localState.breeds.find(
          element => element.name === nameParts[0],
        );
        let localfav;
        if (nameParts.length > 1) {
          localfav =
            localB?.subs?.find(element => element.name === nameParts[1])?.fav ??
            false;
        } else {
          localfav = localB?.fav ?? false;
        }
        setBreed({
          name: nameParts.join(' - '),
          toFav: breedName[1],
          fav: localfav,
        });
      }
      setRandom(res.message as string);
    } catch (exception: any) {
      if (exception.response) {
        setError(exception.response.data.message);
      } else {
        console.log(exception);
        setError(exception.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const hideModal = () => setVisible(false);

  const {width} = useWindowDimensions();

  return (
    <ScreenLayout>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}>
          <Title>Random Dog</Title>
          {error && <Subheading>{error}</Subheading>}
          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
              <View style={styles.rowStyle}>
                <Subheading style={styles.favsTitle}>{breed?.name}</Subheading>
                <IconButton
                  icon={breed?.fav ? 'heart' : 'heart-outline'}
                  onPress={() => {
                    console.log(setBreedFav({name: breed?.toFav}));
                    dispatch(setBreedFav({name: breed?.toFav}));
                    setBreed({
                      ...breed,
                      fav: !breed.fav,
                    });
                  }}
                />
              </View>
              <Image
                source={{uri: random}}
                style={[
                  styles.image,
                  {
                    width: width * 0.75,
                    height: width * 0.75,
                  },
                ]}
              />
            </>
          )}
        </Modal>
      </Portal>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.box}>
          <View style={styles.boxInput}>
            <TextInput
              label={'Name'}
              mode="outlined"
              returnKeyType="next"
              value={localState.name}
              editable={false}
              style={styles.input}
            />
          </View>
          <View style={styles.boxInput}>
            <TextInput
              label={'Email'}
              mode="outlined"
              keyboardType="email-address"
              value={localState.email}
              editable={false}
              style={styles.input}
            />
          </View>
          <View style={styles.boxButtons}>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => {
                showModal();
              }}>
              random
            </Button>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => {
                dispatch(logout());
              }}>
              Logout
            </Button>
          </View>
          <Title>Favorites Breeds:</Title>
          {favorites.length === 0 ? (
            <Subheading>You don't have favorites yet.</Subheading>
          ) : (
            <>
              {favorites.map(breedt => {
                let favs = [];
                breedt.fav && favs.push(breedt.name);
                breedt.subs?.forEach(
                  sub => sub.fav && favs.push(`${breedt.name} - ${sub.name}`),
                );
                return favs.map(fav => (
                  <Subheading style={styles.favsTitle} key={fav}>
                    {fav}
                  </Subheading>
                ));
              })}
            </>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
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
  modal: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 24,
    minHeight: 200,
  },
  image: {
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  boxButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  favsTitle: {textTransform: 'capitalize'},
  rowStyle: {flexDirection: 'row'},
});
