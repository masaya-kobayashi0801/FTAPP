import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
// firebase
import { auth, createPaymentIntent } from "../firebase";
import { child, getDatabase, ref, update, remove } from "firebase/database";
// stripe
import { useStripe } from "@stripe/stripe-react-native";
import { STRIPE_PUBLISHABLE_KEY } from "@env";

const Task = ({ taskData, index, clientKey }) => {
  // firebase
  const db = getDatabase();
  const userId = auth.currentUser.uid;
  // useState
  const [modalVisible, setModalVisible] = useState(false);
  const [taskText, onChangeTaskText] = useState(taskData.task);
  const [goalText, onChangeGoalText] = useState(taskData.goal);
  const [date, setDate] = useState(taskData.date);
  const [time, setTime] = useState(taskData.time);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [selectedManHour, setSelectedManHour] = useState(taskData.manHour);
  const [selectedStatus, setSelectedStatus] = useState(taskData.status);
  const [enabled, setEnabled] = useState(false);

  // useStripe
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [clientSecret, setClientSecret] = useState();

  const taskTime = new Date(date + " " + time);

  const [valueDate, setValueData] = useState(taskTime);

  //useRef
  const alertShownRef = useRef(false);

  let dateParts = date.split(" ");
  let result = dateParts[1] + " " + dateParts[2];
  let timeParts = time.split(":");
  let result2 = " " + timeParts[0] + ":" + timeParts[1];

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || valueDate;
    const currentDateString = currentDate.toDateString();
    const currentTimeString = currentDate.toLocaleTimeString("ja-JP", {
      hour12: false,
    });
    setShow(false);
    setValueData(currentDate);
    mode === "date" ? setDate(currentDateString) : setTime(currentTimeString);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const writeTaskUpdate = () => {
    const obj = new Date(date);
    const str = JSON.stringify(obj);
    const arr = str.split("T");
    const timePart = arr[1];
    const newTime = `${time}.000Z`;
    const newStr = str.replace(timePart, newTime);
    const usersRef = child(ref(db), "users/" + userId + "/tasks/" + index);
    update(usersRef, {
      date: date,
      goal: goalText,
      manHour: selectedManHour,
      status: selectedStatus,
      task: taskText,
      time: time,
      targetDate: newStr,
    });
  };

  const writeTaskDelete = () => {
    const userRef = child(ref(db), "users/" + userId + "/tasks/" + index);
    remove(userRef)
      .then(() => {})
      .catch((error) => {});
  };

  const fetchClientSecret = async () => {
    try {
      const response = await createPaymentIntent({
        amount: 10000,
        currency: "usd",
      });

      const clientSecret = response.data.clientSecret;
      setClientSecret(clientSecret);
    } catch (error) {
      console.error("dbg001" + error);
    }
  };

  const handlePay = async () => {
    try {
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientKey, // paymentIntentのクライアントシークレットキー。これは支払いの確認と認証に使用
        merchantDisplayName: "FTAPP", // : 支払いプロセス中に表示される商店名または表示名。ユーザーに表示される情報
        publishableKey: STRIPE_PUBLISHABLE_KEY,
      });
      if (!error) {
        const result = await presentPaymentSheet({ clientSecret });
        if (result.error) {
          console.log("Error:", result.error);
        } else {
          console.log("Success:", result);
        }
      } else {
        console.log("initPaymentSheetでエラーが発生しました", error);
      }
    } catch (err) {
      console.error("エラーが発生しました", err);
    }
  };

  // useEffect

  useEffect(() => {
    fetchClientSecret();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const diff = taskTime - now;

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        console.log(`${hours} hours, ${minutes} minutes, ${seconds} seconds`);
        if (hours === 0 && minutes <= 15 && !alertShownRef.current) {
          // Alert.alert("15分以内になりました！");
          setEnabled(true);
          alertShownRef.current = true;
        }
        if (hours === 0 && minutes === 0 && seconds === 1) {
          if (selectedStatus === "To Do") {
            handlePay();
            console.log("status変更されていないので、罰金です");
          }
          setEnabled(false);
        }
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      alertShownRef.current = false;
    };
  }, [selectedStatus]);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={styles.outline}
      >
        <View style={styles.container}>
          <Text>Task:{taskText}</Text>
          <Text>
            {result}
            {result2}
          </Text>
        </View>
      </TouchableOpacity>
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
            <Text style={styles.modalText}>Task</Text>
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
              <View style={styles.buttonWrap}>
                <TouchableOpacity
                  onPress={() => showMode("date")}
                  style={styles.dateButtonStyle}
                >
                  <Text style={styles.dateText}>{date}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => showMode("time")}
                  style={styles.timeButtonStyle}
                >
                  <Text style={styles.dateText}>{time}</Text>
                </TouchableOpacity>
                {show && (
                  <DateTimePicker
                    value={valueDate}
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
                  enabled={enabled}
                >
                  <Picker.Item label="To Do" value="To Do" />
                  <Picker.Item label="In Progress" value="In Progress" />
                  <Picker.Item label="resolved" value="resolved" />
                </Picker>
              </View>
            </SafeAreaView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: 200,
              }}
            >
              <Button
                title="Update"
                onPress={() => {
                  writeTaskUpdate();
                  setModalVisible(false);
                }}
              ></Button>
              <Button
                title="Delete"
                onPress={() => {
                  writeTaskDelete();
                  setModalVisible(false);
                }}
              ></Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  outline: {
    borderWidth: 1,
    borderColor: "#707070",
    borderStyle: "solid",
    backgroundColor: "#FFFFFF",
    height: 46,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
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
  pickerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  picker: {
    height: 50,
    width: 250,
    borderWidth: 1,
    borderColor: "black",
  },
});

export default Task;
