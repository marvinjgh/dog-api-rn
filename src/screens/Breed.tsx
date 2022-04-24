import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getBreeds} from '../apis/dogceo';
import {
  ActivityIndicator,
  IconButton,
  Headline,
  Title,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import {BreedType, setBreedFav, setBreedImg, State} from '../redux/appSlice';
import ScreenLayout from '../components/ScreenLayout';
import {RootStackScreenProps} from '../navigations/types';

export default function Breed({route}: RootStackScreenProps<'Breed'>) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  // const [searchQuery, setSearchQuery] = React.useState('');
  const breed = useSelector<State, BreedType>(
    state =>
      state.breeds.find(element => element.name === route.params.name) ?? {
        name: '',
        subs: [],
        img: '',
        fav: false,
      },
  );
  const dispatch = useDispatch();
  const {width} = useWindowDimensions();

  useEffect(() => {
    async function fecthData() {
      setLoading(true);
      try {
        if (breed.img === '') {
          const res = await getBreeds(route.params.name);
          dispatch(
            setBreedImg({
              name: route.params.name,
              imgs: res.message as string[],
            }),
          );
        }
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
    }
    fecthData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.nameBox}>
          <Headline style={styles.title}>{breed.name}</Headline>
          <IconButton
            icon={breed.fav ? 'heart' : 'heart-outline'}
            onPress={() => {
              dispatch(setBreedFav({name: breed.name}));
            }}
          />
        </View>
        {error && <Headline style={styles.title}>{error}</Headline>}
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Image
            source={{uri: breed.img}}
            style={[
              styles.mainImage,
              {
                width: width * 0.75,
                height: width * 0.75,
              },
            ]}
          />
        )}
        {(breed.subs as BreedType[]).length > 0 && (
          <View style={styles.subsListBox}>
            <Title>Sub Breeds</Title>
            {breed.subs?.map(sub => (
              <View key={sub.name} style={styles.subBox}>
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <Image
                    source={{uri: sub.img}}
                    style={{width: width * 0.25, height: width * 0.25}}
                  />
                )}

                <View style={styles.subNameBox}>
                  <Headline style={styles.title}>{sub.name}</Headline>
                  <IconButton
                    icon={sub.fav ? 'heart' : 'heart-outline'}
                    onPress={() => {
                      dispatch(setBreedFav({name: sub.name}));
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  title: {
    textTransform: 'capitalize',
    alignSelf: 'center',
  },
  mainImage: {
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  nameBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 16,
  },
  subsListBox: {
    marginVertical: 16,
  },
  subNameBox: {
    marginLeft: 16,
  },
  subBox: {flexDirection: 'row', marginTop: 8},
});
