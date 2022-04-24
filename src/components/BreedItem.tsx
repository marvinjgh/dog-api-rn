import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {BreedType} from '../redux/appSlice';
import {List, Card, IconButton} from 'react-native-paper';
import Theme from '../constants/Theme';

function BreedItem({
  breed,
  onPress,
  onFav,
}: {
  breed: BreedType;
  onPress?: () => void;
  onFav?: (name: string) => void;
}) {
  return (
    <Card
      style={{
        backgroundColor: Theme.colors.card,
      }}
      onPress={onPress}>
      <Card.Title
        title={breed.name}
        titleStyle={styles.text}
        right={props => (
          <IconButton
            {...props}
            icon={breed.fav ? 'heart' : 'heart-outline'}
            onPress={() => {
              onFav && onFav(breed.name);
            }}
          />
        )}
      />
      {(breed.subs ?? []).length > 0 && (
        <Card.Content>
          <List.Accordion title={'Subs'} style={styles.accordion}>
            {(breed.subs ?? []).map(sub => (
              <List.Item
                title={sub.name}
                key={sub.name}
                titleStyle={styles.text}
                style={{backgroundColor: Theme.colors.background}}
                right={props => (
                  <IconButton
                    {...props}
                    icon={sub.fav ? 'heart' : 'heart-outline'}
                    onPress={() => {
                      onFav && onFav(`${breed.name}-${sub.name}`);
                    }}
                  />
                )}
              />
            ))}
          </List.Accordion>
        </Card.Content>
      )}
    </Card>
  );
}

export default memo(BreedItem);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  text: {
    textTransform: 'capitalize',
  },
  accordion: {
    //backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderRadius: Theme.roundness,
  },
});
