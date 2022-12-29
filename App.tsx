import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Modal,
  Image,
  TextInput,
  TextInputProps,
  ScrollView,
} from "react-native";

import assets from "./constants/assets";

interface IInput extends TextInputProps {
  label?: string;
}

function Input({ ...props }: IInput) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ width: "100%" }}>
      {props.label ? <Text>{props.label}</Text> : null}
      <TextInput
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        {...props}
        style={focus ? styles.inputOnFocus : styles.inputOnBlur}
      />
    </View>
  );
}

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, onChangeTitle] = useState("");
  const [description, onChangeDescription] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);

  const handleAddStep = useCallback(() => {
    setSteps((prev) => [...prev, ""]);
  }, []);

  const handleRemoveStep = useCallback(() => {
    setSteps((prev) => [...prev].slice(0, -1));
  }, []);

  const handleChangeStep = (text: string, i: number) => {
    const newArr = [...steps];
    newArr[i] = text;
    setSteps([...newArr]);
  };

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
          <ScrollView
            contentContainerStyle={{ padding: 35 }}
            style={styles.modalView}
          >
            <Input
              label="Título"
              maxLength={25}
              value={title}
              onChangeText={(text) => onChangeTitle(text)}
              placeholder="Título/Área/Tópico"
            />

            <Input
              label="Descrição"
              multiline
              maxLength={256}
              numberOfLines={7}
              value={description}
              placeholder="Breve descrição"
              onChangeText={(text) => onChangeDescription(text)}
            />

            <Text>Passo a passo</Text>
            {steps.map((step, i) => {
              return (
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                  key={i}
                >
                  <Input
                    value={step}
                    placeholder={`Passo ${i + 1}`}
                    onChangeText={(text) => handleChangeStep(text, i)}
                  />
                  <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
                    {steps.length > 1 && steps.length === i + 1 ? (
                      <Pressable
                        style={styles.removeStepButton}
                        onPress={handleRemoveStep}
                      >
                        <Image
                          source={assets.remove}
                          style={{
                            width: 20,
                            height: 20,
                            alignSelf: "center",
                          }}
                        />
                      </Pressable>
                    ) : null}
                    {steps.length === i + 1 ? (
                      <Pressable
                        style={styles.addStepButton}
                        onPress={handleAddStep}
                      >
                        <Image
                          source={assets.close}
                          style={{
                            width: 20,
                            height: 20,
                            alignSelf: "center",
                            transform: [{ rotate: "45deg" }],
                          }}
                        />
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </ScrollView>
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
    top: -50,
    right: 30,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%",
    maxHeight: "70%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
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
    borderWidth: 1,
    borderColor: "#9BC53D",
    color: "#6A6B83",
    marginBottom: 10,
    textAlignVertical: "top",
    underlineColorAndroid: "transparent",
  },
  addStepButton: {
    backgroundColor: "#9BC53D",
    borderRadius: 50,
    marginLeft: 5,
    height: 30,
    width: 30,
    alignContent: "center",
    justifyContent: "center",
  },
  removeStepButton: {
    backgroundColor: "red",
    borderRadius: 50,
    marginLeft: 5,
    height: 30,
    width: 30,
    alignContent: "center",
    justifyContent: "center",
  },
});
