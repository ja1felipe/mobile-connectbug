import React, { useCallback, useEffect, useState } from "react";
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
  Appearance,
  ActivityIndicator,
  Alert,
} from "react-native";

import assets from "./constants/assets";

import * as ImagePicker from "expo-image-picker";
import * as Device from "expo-device";
import * as Application from "expo-application";
import * as SecureStore from "expo-secure-store";
import { v4 as uuidv4 } from "uuid";
import { BugReportType, statusTranslated } from "./types/bug-report.type";

type TDeviceInfos = {
  manufactor: string | null;
  model: string | null;
  systemVersion: string | null;
  bundleId: string | null;
  buildNumber: string | null;
  appVersion: string | null;
  deviceName: string | null;
};
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

interface IListOfCreated {
  deviceId: string;
}

function ListOfCreated({ deviceId }: IListOfCreated) {
  const [createds, setCreateds] = useState<BugReportType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getCreateds = async () => {
      fetch(`https://meutccbackend.loca.lt/bugreport/user/${deviceId}`, {
        method: "get",
      })
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            res.json().then((res) => {
              console.log(res);
              setCreateds(res);
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getCreateds();
  }, []);

  return (
    <>
      {loading ? (
        <ActivityIndicator
          size={"large"}
          color={"#2274A5"}
          animating={loading}
        />
      ) : (
        <View>
          <View style={styles.section}>
            <View style={styles.sectionItem}>
              <Text style={{ ...styles.itemText, fontWeight: "bold" }}>
                Titulo
              </Text>
            </View>
            <View style={styles.sectionItem}>
              <Text style={{ ...styles.itemText, fontWeight: "bold" }}>
                Status
              </Text>
            </View>
          </View>
          {createds.map((br) => {
            return (
              <View key={br.id} style={styles.section}>
                <View style={styles.sectionItem}>
                  <Text style={styles.itemText}>{br.title}</Text>
                </View>
                <View style={styles.sectionItem}>
                  <Text style={styles.itemText}>
                    {statusTranslated[br.status]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </>
  );
}

export default function App() {
  const colorScheme = Appearance.getColorScheme();

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<Partial<TDeviceInfos>>();
  const [deviceId, setDeviceId] = useState("");

  const [index, setIndex] = useState(0);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newImgs = [...images, ...result.assets];
      setImages(newImgs);
    }
  };

  const clearImages = async () => {
    setImages([]);
  };

  const handleSubmitForm = useCallback(async () => {
    setLoading(true);
    const form = new FormData();
    form.append("created_by_id", deviceId);
    form.append("title", title);
    form.append("description", description);
    form.append("steps", JSON.stringify(steps));
    images.forEach((file) => {
      let localUri = file.uri;
      let filename = localUri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename!);
      let type = match ? `image/${match[1]}` : `image`;
      form.append(
        "screenshots",
        JSON.parse(
          JSON.stringify({
            uri: file.uri,
            name: filename,
            type: type,
          })
        )
      );
    });
    form.append("deviceInfos", JSON.stringify(deviceInfo));
    fetch("https://meutccbackend.loca.lt/bugreport", {
      method: "post",
      body: form,
    })
      .then((res) => {
        if (res.status == 201) {
          Alert.alert(
            "Info",
            "Sucesso! O bug foi reportado com sucesso, muito obrigado!"
          );
          setTitle("");
          setDescription("");
          setSteps([""]);
          setImages([]);
          setModalVisible(false);
        }
      })
      .catch((error) => {
        Alert.alert("Error");
        console.log("error upload", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [title, description, steps, images, deviceInfo]);

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

  useEffect(() => {
    const infos = {
      appVersion: Application.nativeApplicationVersion,
      buildNumber: Application.nativeBuildVersion,
      bundleId: Application.applicationId,
      deviceName: Device.deviceName,
      manufactor: Device.manufacturer,
      model: Device.modelName,
      systemVersion: Device.osVersion,
    };
    setDeviceInfo(infos);

    const getDeviceId = async () => {
      let uuid = uuidv4();
      let fetchUUID = await SecureStore.getItemAsync("secure_deviceid");
      //if user has already signed up prior
      if (fetchUUID) {
        uuid = fetchUUID;
      }
      console.log(uuid);
      await SecureStore.setItemAsync("secure_deviceid", uuid);
      setDeviceId(uuid);
    };

    getDeviceId();
  }, []);

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
            <Image
              source={colorScheme === "dark" ? assets.logo : assets.logoDark}
              style={{
                width: 200,
                height: 100,
                alignSelf: "center",
              }}
            />
            <View style={{ flexDirection: "row", marginBottom: 15 }}>
              <Pressable style={styles.tabButton} onPress={() => setIndex(0)}>
                <Text style={{ textTransform: "uppercase", color: "white" }}>
                  Criar
                </Text>
              </Pressable>
              <Pressable
                style={{ ...styles.tabButton, backgroundColor: "#2274A5" }}
                onPress={() => setIndex(1)}
              >
                <Text style={{ textTransform: "uppercase", color: "white" }}>
                  Ver Criados
                </Text>
              </Pressable>
            </View>
            {index === 0 ? (
              <>
                <Input
                  label="Título"
                  maxLength={25}
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  placeholder="Título/Área/Tópico"
                />

                <Input
                  label="Descrição"
                  multiline
                  maxLength={256}
                  numberOfLines={7}
                  value={description}
                  placeholder="Breve descrição"
                  onChangeText={(text) => setDescription(text)}
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
                      <View
                        style={{ flexDirection: "row", alignSelf: "flex-end" }}
                      >
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
                <Text>Screenshots</Text>
                {images.length > 0 ? (
                  <ScrollView horizontal={true} style={styles.imagesView}>
                    {images.map((img) => {
                      return (
                        <Image
                          key={img.uri}
                          source={{ uri: img.uri }}
                          style={{ width: 100, height: 100, marginRight: 5 }}
                        />
                      );
                    })}
                  </ScrollView>
                ) : null}
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  {images.length > 0 ? (
                    <Pressable
                      style={{ ...styles.imagesButton, backgroundColor: "red" }}
                      onPress={clearImages}
                    >
                      <Text
                        style={{ color: "white", textTransform: "uppercase" }}
                      >
                        Limpar
                      </Text>
                    </Pressable>
                  ) : null}
                  <Pressable style={styles.imagesButton} onPress={pickImages}>
                    <Text
                      style={{ color: "white", textTransform: "uppercase" }}
                    >
                      Upload
                    </Text>
                  </Pressable>
                </View>
                <Pressable
                  disabled={loading}
                  style={styles.submitButton}
                  onPress={handleSubmitForm}
                >
                  {loading ? (
                    <ActivityIndicator color={"#D9D9D9"} animating={loading} />
                  ) : (
                    <Text
                      style={{ color: "white", textTransform: "uppercase" }}
                    >
                      Enviar
                    </Text>
                  )}
                </Pressable>
              </>
            ) : (
              <>
                <ListOfCreated deviceId={deviceId} />
              </>
            )}
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
  imagesView: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "#D9D9D9",
    overflow: "scroll",
  },
  imagesButton: {
    flex: 1,
    backgroundColor: "#9BC53D",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 10,
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#2274A5",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 10,
    marginTop: 20,
    alignItems: "center",
  },
  tabButton: {
    flex: 1,
    backgroundColor: "#9BC53D",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 10,
    alignItems: "center",
  },
  section: {
    flexBasis: "100%",
    flexWrap: "nowrap",
    flexDirection: "row",
  },
  sectionItem: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "100%",
  },
  itemText: {
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
    padding: 5,
  },
});
