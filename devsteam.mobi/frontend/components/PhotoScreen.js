/**
 * @format
 * @flow strict-local
 */

import type {Node} from 'react';
import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Route,
  ActivityIndicator,
} from 'react-native';

const PhotoScreen: ({route: Route}) => Node = ({route}) => {
  const {photo} = route.params;
  const {description, urls} = photo;

  const [loaded, setLoaded] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{uri: urls.full}}
          resizeMode="contain"
          style={styles.image}
          onLoadStart={() => setLoaded(false)}
          onLoadEnd={() => setLoaded(true)}
        />
        {!loaded && (
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
      <Text style={styles.description}>{description ?? 'Нет описания'}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  spinner: {
    justifyContent: 'center',
    position: 'absolute',
    left: '50%',
    right: '50%',
    top: 0,
    bottom: 0,
  },
  imageWrapper: {
    flex: 1,
    height: undefined,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  description: {
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PhotoScreen;
