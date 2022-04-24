import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  SignIn: undefined;
  HomeTab: undefined;
  Breed: {name: string};
};

export type HomeTabParamList = {
  Breeds: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootStackFC<
  Screen extends keyof RootStackParamList,
  P = {},
> = React.FC<RootStackScreenProps<Screen> & P>;

export type HomeTabScreenProps<Screen extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
