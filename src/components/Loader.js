import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";

const Loader = ({ isLoading = false, withModal = false }) => {
  if (withModal && isLoading) {
    return (
      <Modal transparent visible={isLoading}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <ActivityIndicator size="large" color={'#000000'} />
        </View>
      </Modal>
    );
  }
  if (isLoading) {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      >
        <ActivityIndicator size="large" color={'#000000'} />
      </View>
    );
  }
  return null;
};

export default Loader;
