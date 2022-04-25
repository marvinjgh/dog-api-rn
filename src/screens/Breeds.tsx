import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getAllBreeds} from '../apis/dogceo';
import {ActivityIndicator, Searchbar} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import {BreedType, setBreedFav, setBreeds, State} from '../redux/appSlice';
import BreedItem from '../components/BreedItem';
import ScreenLayout from '../components/ScreenLayout';
import {HomeTabScreenProps} from '../navigations/types';

export default function Breeds({navigation}: HomeTabScreenProps<'Breeds'>) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const breeds = useSelector<State, BreedType[]>(state => state.breeds);
  const dispatch = useDispatch();

  const onChangeSearch = (query: React.SetStateAction<string>) =>
    setSearchQuery(query);

  useEffect(() => {
    async function fecthData() {
      setLoading(true);
      try {
        const res = await getAllBreeds();
        dispatch(setBreeds(res.message));
      } catch (exception: any) {
        if (exception.response) {
          setError(exception.response.data.message);
        } else {
          console.log(exception);
          setError('error in catch');
        }
      } finally {
        setLoading(false);
      }
    }
    fecthData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({item}: {item: BreedType}) => (
    <BreedItem
      breed={item}
      onPress={() => navigation.navigate('Breed', {name: item.name})}
      onFav={name => {
        dispatch(setBreedFav({name}));
      }}
    />
  );
  const renderSeparator = () => <View style={styles.separetor} />;
  const keyExtractor = (item: BreedType) => item.name;
  const renderEmpty = () =>
    loading ? <ActivityIndicator /> : <Text>{error}</Text>;

  return (
    <ScreenLayout>
      <Searchbar
        placeholder="Search breed"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <FlatList
        data={breeds.filter(breed => {
          if (searchQuery) {
            return breed.name.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return true;
        })}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={renderSeparator}
        refreshing={loading}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderSeparator}
        ListFooterComponent={renderSeparator}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  separetor: {
    height: 8,
  },
  listContainer: {
    marginHorizontal: 16,
  },
});
