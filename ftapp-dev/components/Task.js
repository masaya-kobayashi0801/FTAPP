import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Countdown from "react-countdown";
// firebase
import { auth } from "../firebase";
import { child, getDatabase, ref, update, remove } from "firebase/database";

const Task = ({ taskData, index }) => {
  // firebase
  const db = getDatabase();
  const userId = auth.currentUser.uid;
  // useState
  const [modalVisible, setModalVisible] = useState(false);
  const [taskText, onChangeTaskText] = useState(taskData.task);
  const [goalText, onChangeGoalText] = useState(taskData.goal);
  // const [date, setDate] = useState(taskData.date);
  const [valueDate, setValueData] = useState(new Date());
  const [date, setDate] = useState(taskData.date);
  const [time, setTime] = useState(taskData.time);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [selectedManHour, setSelectedManHour] = useState(taskData.manHour);
  const [selectedStatus, setSelectedStatus] = useState(taskData.status);
  // const [taskId, setTaskId] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [triggerAlert, setTriggerAlert] = useState(true);

  let dateParts = date.split(" ");
  let result = dateParts[1] + " " + dateParts[2];
  let timeParts = time.split(":");
  let result2 =
    timeParts[0] + ":" + timeParts[1] + " " + timeParts[2].split(" ")[1];

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || valueDate;
    const str = currentDate.toLocaleString("ja-JP", { hour12: false });
    const dateOnly = str.slice(0, 10);
    const timeOnly = str.slice(-8);
    const currentDateString = currentDate.toDateString();
    const currentTimeString = timeOnly;
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
    const datePart = arr[0];
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

  const renderer = ({ hours, minutes, seconds }) => {
    return (
      <Text>{/* {hours} hours, {minutes} minutes, {seconds} seconds */}</Text>
    );
  };

  const handleInterval = ({ hours, minutes, seconds }) => {
    console.log(hours);
    console.log(minutes);
    console.log(seconds);
    if (minutes < 15 && triggerAlert) {
      setEnabled(true);
      alert("15分以内です");
      setTriggerAlert(false);
    }
    if (hours === 0 && minutes === 0 && seconds === 1) {
      alert("差分0になりました");
    }
  };

  const handleComplete = () => {
    setEnabled(false);
  };

  // // Set the two dates
  // let date1 = new Date("2023-08-03T20:31:58+09:00");
  // let date2 = new Date();

  // // Calculate the difference in milliseconds
  // let differenceInTime = date2.getTime() - date1.getTime();

  // // Calculate the difference in minutes
  // let differenceInMinutes = differenceInTime / (1000 * 60);

  //   `The difference between ${date1} and ${date2} is ${differenceInMinutes} minutes.`
  // );
  // const now = new Date();
  // const differenceInTime = now.getTime() - valueDate.getTime() ;
  // const differenceInMinutes = differenceInTime / (1000 * 60);
  //   `The difference between ${valueDate} and ${now} is ${differenceInMinutes} minutes.`
  // );
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const now = new Date();
  //     const diffInMinutes = (taskData.targetDate - now) / 1000 / 60;
  //     if (diffInMinutes <= 10) {
  //       clearInterval(intervalId);
  //     }
  //   }, 1000);
  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    const date1 = new Date(taskData.targetDate);
    const date2 = new Date();
    const diff = date1 - date2;
    let msec = diff;
    const hh = Math.floor(msec / 1000 / 60 / 60);
    const mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    const ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    if (mm < 15) {
      setEnabled(true);
    }
  }, []);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={styles.outline}
      >
        {/* <Text>タスク{index + 1}</Text> */}
        <View style={styles.container}>
          <Text>Task:{taskText}</Text>
          <Text>
            {result} {result2}
          </Text>
        </View>
        {/* <Text>目標：{goalText}</Text> */}
        {/* <Text>日付：{date}</Text>
        <Text>時間：{time}</Text> */}
        {/* <Text>工数：{selectedManHour}</Text> */}
        {/* <Text>ステータス：{selectedStatus}</Text> */}
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
            <Countdown
              date={taskData.targetDate}
              intervalDelay={1000} // 1秒ごとにコールバック関数を実行する
              renderer={renderer} // 残りの時間を表示する関数
              onTick={handleInterval} // インターバル毎に実行する関数
              onComplete={handleComplete} // タイマー終了時に実行する関数
            />
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
            {/* <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable> */}
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
    // margin: 20,
    backgroundColor: "white",
    // borderRadius: 20,
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
