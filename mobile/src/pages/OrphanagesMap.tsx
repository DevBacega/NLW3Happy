import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import mapMarker from '../images/mapMarker.png';
import api from '../services/api';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

const OrphanagesMap: React.FC = () => {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      api.get('orphanages').then(response => {
        setOrphanages(response.data);
      });
    }, []),
  );

  const currentLocation = useCallback(async () => {
    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
    }
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    console.log('oii');
    setPosition({ latitude, longitude });
  }, []);

  const handleNavigateToOrphanageDetails = useCallback(
    (id: number) => {
      navigation.navigate('OrphanageDetails', { id });
    },
    [navigation],
  );
  const handleNavigateToCreateOrphanage = useCallback(() => {
    navigation.navigate('SelectMapPosition');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -22.7219274,
          longitude: -47.6236811,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        region={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        onMapReady={currentLocation}
      >
        {orphanages.map(orphanage => {
          return (
            <Marker
              key={orphanage.id}
              icon={mapMarker}
              calloutAnchor={{
                x: 2.7,
                y: 0.8,
              }}
              coordinate={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude,
              }}
            >
              <Callout
                tooltip
                onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}
              >
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>{orphanage.name}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {`${orphanages.length} orfanatos encontrados`}
        </Text>

        <RectButton
          style={styles.createOrphanageButton}
          onPress={handleNavigateToCreateOrphanage}
        >
          <Feather name="plus" size={20} color="#fff" />
        </RectButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    justifyContent: 'center',
  },
  calloutText: {
    fontFamily: 'Nunito_700Bold',
    color: '#0089a5',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 3,
  },
  footerText: {
    fontFamily: 'Nunito_700Bold',
    color: '#8fa7b3',
  },
  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15c3d6',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrphanagesMap;
