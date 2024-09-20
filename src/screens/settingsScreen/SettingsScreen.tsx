import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen() {
  const [tempModalVisible, setTempModalVisible] = useState(false);
  const [windModalVisible, setWindModalVisible] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [windSpeedUnit, setWindSpeedUnit] = useState('Kilometers per hour');

  const handleSelectTemperatureUnit = async (unit: 'Celsius' | 'Fahrenheit') => {
    setTemperatureUnit(unit);
    setTempModalVisible(false);
    await AsyncStorage.setItem('temperatureUnit', unit);
  };

  const handleSelectWindSpeedUnit = async (unit: 'Kilometers per hour' | 'Meters per second' | 'Miles per hour' | 'Knots') => {
    setWindSpeedUnit(unit);
    setWindModalVisible(false);
    await AsyncStorage.setItem('windSpeedUnit', unit);
  };

  useEffect(() => {
    const loadUnitsFromStorage = async () => {
      const savedTempUnit = await AsyncStorage.getItem('temperatureUnit');
      const savedWindUnit = await AsyncStorage.getItem('windSpeedUnit');

      if (savedTempUnit) setTemperatureUnit(savedTempUnit);
      if (savedWindUnit) setWindSpeedUnit(savedWindUnit);
      
    };

    loadUnitsFromStorage();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Units</Text>

        {/* Temperature Unit Selection */}
        <TouchableOpacity style={styles.button} onPress={() => setTempModalVisible(true)}>
          <Text style={styles.buttonText}>
            Temperature Units: {temperatureUnit}
          </Text>
        </TouchableOpacity>

        {/* Wind Speed Unit Selection */}
        <TouchableOpacity style={styles.button} onPress={() => setWindModalVisible(true)}>
          <Text style={styles.buttonText}>
            Wind Speed Units: {windSpeedUnit}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Temperature Unit Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={tempModalVisible}
        onRequestClose={() => setTempModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setTempModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, temperatureUnit === 'Celsius' && styles.selectedButton]}
                  onPress={() => handleSelectTemperatureUnit('Celsius')}
                >
                  <Text style={styles.modalButtonText}>Celsius</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, temperatureUnit === 'Fahrenheit' && styles.selectedButton]}
                  onPress={() => handleSelectTemperatureUnit('Fahrenheit')}
                >
                  <Text style={styles.modalButtonText}>Fahrenheit</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal for Wind Speed Unit Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={windModalVisible}
        onRequestClose={() => setWindModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setWindModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, windSpeedUnit === 'Kilometers per hour' && styles.selectedButton]}
                  onPress={() => handleSelectWindSpeedUnit('Kilometers per hour')}
                >
                  <Text style={styles.modalButtonText}>Kilometers per hour</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, windSpeedUnit === 'Meters per second' && styles.selectedButton]}
                  onPress={() => handleSelectWindSpeedUnit('Meters per second')}
                >
                  <Text style={styles.modalButtonText}>Meters per second</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, windSpeedUnit === 'Miles per hour' && styles.selectedButton]}
                  onPress={() => handleSelectWindSpeedUnit('Miles per hour')}
                >
                  <Text style={styles.modalButtonText}>Miles per hour</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, windSpeedUnit === 'Knots' && styles.selectedButton]}
                  onPress={() => handleSelectWindSpeedUnit('Knots')}
                >
                  <Text style={styles.modalButtonText}>Knots</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  button: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#007BFF',
    alignContent:'space-between'
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    padding: 15,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  selectedButton: {
    backgroundColor: '#d0eaff',
  },
});
