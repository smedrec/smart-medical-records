import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder data - replace with actual data structure from FMDA
const mockMedicalData = {
  patientInfo: {
    name: 'Jane Doe',
    age: 42,
    bloodType: 'O+',
  },
  recentAppointments: [
    { id: '1', date: '2024-07-15', doctor: 'Dr. Smith', reason: 'Annual Checkup' },
    { id: '2', date: '2024-06-01', doctor: 'Dr. Jones', reason: 'Flu Symptoms' },
  ],
  labResults: [
    { id: 'a', testName: 'Cholesterol', value: '190 mg/dL', status: 'Normal' },
    { id: 'b', testName: 'Blood Sugar', value: '95 mg/dL', status: 'Normal' },
  ],
  medications: [
    { id: 'x', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
  ]
};

const DataDisplayScreen = () => {
  // In a real app, this data would come from props or a state management solution
  const data = mockMedicalData;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        <View className="p-4 bg-white border-b border-gray-200">
          <Text className="text-xl font-semibold text-center text-blue-600">Medical Data Overview</Text>
        </View>

        <View className="p-4">
          {/* Patient Info Section */}
          <View className="bg-white p-4 rounded-lg shadow mb-4">
            <Text className="text-lg font-semibold text-gray-700 mb-2">Patient Information</Text>
            <Text className="text-base text-gray-600">Name: {data.patientInfo.name}</Text>
            <Text className="text-base text-gray-600">Age: {data.patientInfo.age}</Text>
            <Text className="text-base text-gray-600">Blood Type: {data.patientInfo.bloodType}</Text>
          </View>

          {/* Recent Appointments Section */}
          <View className="bg-white p-4 rounded-lg shadow mb-4">
            <Text className="text-lg font-semibold text-gray-700 mb-2">Recent Appointments</Text>
            {data.recentAppointments.map(appt => (
              <View key={appt.id} className="mb-2 pb-2 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                <Text className="text-base text-gray-600">Date: {appt.date}</Text>
                <Text className="text-base text-gray-600">Doctor: {appt.doctor}</Text>
                <Text className="text-base text-gray-600">Reason: {appt.reason}</Text>
              </View>
            ))}
          </View>

          {/* Lab Results Section */}
          <View className="bg-white p-4 rounded-lg shadow mb-4">
            <Text className="text-lg font-semibold text-gray-700 mb-2">Lab Results</Text>
            {data.labResults.map(result => (
              <View key={result.id} className="mb-2 pb-2 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                <Text className="text-base text-gray-600">Test: {result.testName}</Text>
                <Text className="text-base text-gray-600">Value: {result.value} ({result.status})</Text>
              </View>
            ))}
          </View>

          {/* Medications Section */}
          <View className="bg-white p-4 rounded-lg shadow">
            <Text className="text-lg font-semibold text-gray-700 mb-2">Current Medications</Text>
            {data.medications.map(med => (
              <View key={med.id} className="mb-2 pb-2 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                <Text className="text-base text-gray-600">Name: {med.name}</Text>
                <Text className="text-base text-gray-600">Dosage: {med.dosage}</Text>
                <Text className="text-base text-gray-600">Frequency: {med.frequency}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataDisplayScreen;
