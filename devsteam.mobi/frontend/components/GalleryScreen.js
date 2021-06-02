/**
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  ActivityIndicator,
  Appearance,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import Card from './Card';
import {fetchPhotos} from '../actions/GalleryActions';
import Status from '../enum/Status';

class GalleryScreen extends Component {
  componentDidMount(): void {
    this.props.fetchPhotos();
  }

  openPhoto(photo: Photo): void {
    this.props.navigation.navigate('Photo', {
      photo,
    });
  }

  onScroll({layoutMeasurement, contentOffset, contentSize}): void {
    const {status} = this.props;

    if (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 55 &&
      status !== Status.FETCHING
    ) {
      this.props.fetchPhotos();
    }
  }

  render(): React$Node {
    const isDarkMode = Appearance.getColorScheme() === 'dark';

    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    const {status, photos} = this.props;

    return (
      <SafeAreaView style={[backgroundStyle, styles.container]}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          contentInsetAdjustmentBehavior="automatic"
          scrollEventThrottle={300}
          onScroll={event => this.onScroll(event.nativeEvent)}>
          <View style={[styles.gallery]}>
            {photos.map(photo => (
              <Card
                photo={photo}
                key={photo.id}
                onClick={() => this.openPhoto(photo)}
              />
            ))}
          </View>
          {(status === Status.IDLE || status === Status.FETCHING) && (
            <View style={styles.spinner}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = store => ({
  ...store.gallery,
});

const mapDispatchToProps = dispatch => ({
  fetchPhotos: () => dispatch(fetchPhotos()),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  gallery: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GalleryScreen);
