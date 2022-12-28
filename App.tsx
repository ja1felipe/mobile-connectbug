import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Modal,
  Image,
  TextInput,
  TextInputProps,
} from "react-native";
import assets from "./constants/assets";

interface IInput extends TextInputProps {
  label: string;
}

function Input({ ...props }: IInput) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ width: "100%" }}>
      <Text>{props.label}</Text>
      <TextInput
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={focus ? styles.inputOnFocus : styles.inputOnBlur}
        {...props}
      />
    </View>
  );
}

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = React.useState("Useless Text");

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
            <Input
              label="Título"
              maxLength={25}
              value={text}
              placeholder="Teste"
            />
            <Input
              label="Descrição"
              multiline
              maxLength={256}
              numberOfLines={7}
              value={text}
              placeholder="Teste"
              onChangeText={(text) => onChangeText(text)}
            />
            <Text>Hello World!</Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Image
                source={assets.close}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: "center",
                }}
              />
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
  closeButton: {
    backgroundColor: "red",
    borderRadius: 50,
    padding: 10,
    height: 40,
    width: 40,
    alignContent: "center",
    justifyContent: "center",
    position: "absolute",
    top: -60,
    right: 0,
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
    borderColor: "#6A6B83",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  inputOnBlur: {
    padding: 5,
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
    width: "100%",
    borderWidth: 1,
    borderColor: "#6A6B83",
    color: "#6A6B83",
    marginBottom: 10,
    textAlignVertical: "top",
    underlineColorAndroid: "transparent",
  },
  inputOnFocus: {
    padding: 5,
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
    width: "100%",
    borderWidth: 1,
    borderColor: "#9BC53D",
    color: "#6A6B83",
    marginBottom: 10,
    textAlignVertical: "top",
    underlineColorAndroid: "transparent",
  },
});
