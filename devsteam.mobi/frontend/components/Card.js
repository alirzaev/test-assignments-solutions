/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

const Card = ({photo, onClick}: {photo: Photo, onClick: () => void}) => {
  const handler = onClick ?? (() => {});

  return (
    <View style={styles.card}>
      <View style={[styles.box]} onTouchEndCapture={() => handler()}>
        <Image source={{uri: photo.urls.thumb}} style={styles.image} />
      </View>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {photo.user.username}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginBottom: 5,
    width: 110,
    height: 110,
    position: 'relative',
  },
  card: {
    margin: 5,
    width: 110,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    padding: 5,
    width: '100%',
    textAlign: 'center',
    borderBottomColor: 'rgba(127, 127, 127, 0.5)',
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
});

export default Card;
