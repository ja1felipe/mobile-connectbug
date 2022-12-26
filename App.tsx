import React, { useState } from "react";
import { StyleSheet, View, Pressable, Text, Modal, Image } from "react-native";
import assets from "./constants/assets";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Hello World!</Text>
            <Pressable
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Image
          source={assets.bug}
          style={{
            width: 30,
            height: 30,
            transform: [{ rotate: "45deg" }],
            alignSelf: "center",
          }}
        />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    margin: 10,
  },
  button: {
    backgroundColor: "red",
    borderRadius: 50,
    padding: 10,
    height: 70,
    width: 70,
    alignContent: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 15,
    right: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
