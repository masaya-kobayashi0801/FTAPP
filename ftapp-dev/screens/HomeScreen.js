import { auth, createPaymentIntent } from "../firebase";

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  SafeAreaView,
} from "react-native";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useClientSecret } from "../context/ClientSecretContext";
// import Ionicons from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import {
  child,
  getDatabase,
  ref,
  push,
  update,
  onValue,
} from "firebase/database";
import Task from "../components/Task";

const HomeScreen = () => {
  const db = getDatabase();
  const [modalVisible, setModalVisible] = useState(false);
  const [taskText, onChangeTaskText] = useState("");
  const [goalText, onChangeGoalText] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [selectedManHour, setSelectedManHour] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [taskId, setTaskId] = useState("");
  const [fetchData, setFetchData] = useState(null);
  const { clientSecret } = useClientSecret();
  const cardDetails = useSelector((state) => state.cardDetails.cardDetails);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const writeTaskPost = () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const taskData = {
        task: taskText,
        goal: goalText,
        date: date.toDateString(),
        time: date.toLocaleTimeString("ja-JP", { hour12: false }),
        manHour: selectedManHour,
        status: selectedStatus,
        targetDate: date,
      };
      const newTaskKey = push(child(ref(db), "tasks")).key;
      setTaskId(newTaskKey);
      const updates = {};
      updates["users/" + userId + "/tasks/" + newTaskKey] = taskData;
      update(ref(db), updates);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    const userId = user.uid;
    const dbRef = ref(db, `users/${userId}/tasks/${taskId}`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setFetchData(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: "center" }}>
        ここにタスクデータを表示するよ
      </Text>
      <View>
        {fetchData &&
          Object.keys(fetchData).map((key) => (
            <React.Fragment key={key}>
              <Task
                taskData={fetchData[key]}
                clientKey={clientSecret}
                index={key}
                cardDetails={cardDetails}
              />
            </React.Fragment>
          ))}
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setDate(new Date());
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>New Task</Text>
            <SafeAreaView>
              <TextInput
                style={styles.input}
                onChangeText={onChangeTaskText}
                value={taskText}
                placeholder="Task"
              />
              <TextInput
                style={styles.input}
                onChangeText={onChangeGoalText}
                value={goalText}
                placeholder="Goal"
              />
              <Text style={styles.modalText}>Start Time</Text>
              <View style={styles.buttonWrap}>
                <TouchableOpacity
                  onPress={() => showMode("date")}
                  style={styles.dateButtonStyle}
                >
                  <Text
                    style={styles.dateText}
                  >{`${date.toDateString()}`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => showMode("time")}
                  style={styles.timeButtonStyle}
                >
                  <Text style={styles.dateText}>{`${date.toLocaleTimeString(
                    "ja-JP",
                    { hour12: false }
                  )}`}</Text>
                </TouchableOpacity>
                {show && (
                  <DateTimePicker
                    value={date}
                    mode={mode}
                    display="default"
                    onChange={onChange}
                  />
                )}
              </View>
              <View style={styles.pickerContainer}>
                <Text>Man hour</Text>
                <Picker
                  selectedValue={selectedManHour}
                  onValueChange={(itemValue) => {
                    setSelectedManHour(itemValue);
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="0.5" value="0.5" />
                  <Picker.Item label="1" value="1" />
                  <Picker.Item label="1.5" value="1.5" />
                  <Picker.Item label="2" value="2" />
                  <Picker.Item label="2.5" value="2.5" />
                  <Picker.Item label="3" value="3" />
                </Picker>
              </View>
              <View style={styles.pickerContainer}>
                <Text>Status</Text>
                <Picker
                  selectedValue={selectedStatus}
                  onValueChange={(itemValue) => {
                    setSelectedStatus(itemValue);
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="To Do" value="To Do" />
                </Picker>
              </View>
            </SafeAreaView>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                writeTaskPost();
                setModalVisible(false);
                onChangeTaskText("");
                onChangeGoalText("");
                setSelectedManHour("0.5");
                setSelectedStatus("To Do");
                setDate(new Date());
              }}
            >
              <Text style={styles.textStyle}>Submit</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                setDate(new Date());
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
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
  buttonWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateButtonStyle: {
    borderColor: "#707070",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    height: 46,
    padding: 10,
    margin: 10,
    width: "55%",
  },
  timeButtonStyle: {
    borderColor: "#707070",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    height: 46,
    padding: 10,
    margin: 10,
    width: "35%",
  },
  dateText: {
    color: "#707070",
  },
  button: {
    marginTop: 10,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  submitButton: {
    borderWidth: 1,
    height: 46,
    borderRadius: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderColor: "#707070",
    borderStyle: "solid",
    backgroundColor: "#FFFFFF",
    height: 46,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  picker: {
    height: 50,
    width: "50%",
    borderWidth: 1,
    borderColor: "#000",
  },
});

export default HomeScreen;
