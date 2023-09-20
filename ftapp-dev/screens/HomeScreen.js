// import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  SafeAreaView,
  Button,
} from "react-native";
import { StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Countdown from "react-countdown";
import { Picker } from "@react-native-picker/picker";
import {
  child,
  getDatabase,
  ref,
  set,
  push,
  update,
  onValue,
} from "firebase/database";
import Task from "../components/Task";
import { useCallback } from "react";

// function writeUserData(userId, name, email) {
//   const db = getDatabase();
//   set(ref(db, "users/" + userId), {
//     username: name,
//     email: email,
//   });
// }

// writeUserData(1, "Masaya", "test@test.co.jp");
const HomeScreen = () => {
  // const handleLogout = () => {
  //   signOut(auth)
  //     .then(() => {
  //     })
  //     .catch((error) => {
  //     });
  // };

  const db = getDatabase();

  const [modalVisible, setMedalVisible] = useState(false);
  const [taskText, onChangeTaskText] = useState("");
  const [goalText, onChangeGoalText] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [selectedManHour, setSelectedManHour] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [triggerAlert, setTriggerAlert] = useState(true);
  // const [dateShow, setDateShow] = useState(false);
  // const [timeShow, setTimeShow] = useState(false);]
  const [taskId, setTaskId] = useState("");
  const [fetchData, setFetchData] = useState(null);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    const isoString = currentDate.toISOString();
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
        time: date.toLocaleTimeString(),
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

  const renderer = ({ hours, minutes, seconds }) => {
    return (
      <Text>{/* {hours} hours, {minutes} minutes, {seconds} seconds */}</Text>
    );
  };

  const handleInterval = useCallback(({ hours, minutes, seconds }) => {
    console.log(111);
    if (minutes < 15 && triggerAlert) {
      alert("15分以内です");
      setTriggerAlert(false);
    }
    if (hours === 0 && minutes === 0 && seconds === 1) {
      alert("差分0になりました");
    }
  }, []);
  const handleComplete = () => {
    // setEnabled(false);
  };

  useEffect(() => {
    const user = auth.currentUser;
    const userId = user.uid;
    // const newTaskKey = push(child(ref(db), "tasks")).key;
    const dbRef = ref(db, `users/${userId}/tasks/${taskId}`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setFetchData(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text>ホーム画面</Text>
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: 10,
          padding: 10,
          backgroundColor: "#2196F3",
          borderRadius: 10,
          width: 100,
        }}
      >
        <Text style={{ color: "white" }}>ログアウト</Text>
      </TouchableOpacity> */}
      <Text style={{ textAlign: "center" }}>
        ここにタスクデータを表示するよ
      </Text>
      <View>
        {fetchData &&
          Object.keys(fetchData).map((key) => (
            <React.Fragment key={key}>
              <Task taskData={fetchData[key]} index={key} />
              {/* <Countdown
                date={fetchData[key].targetDate}
                intervalDelay={1000} // 1秒ごとにコールバック関数を実行する
                renderer={renderer} // 残りの時間を表示する関数
                onTick={handleInterval} // インターバル毎に実行する関数
                onComplete={handleComplete} // タイマー終了時に実行する関数
              /> */}
            </React.Fragment>
          ))}
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setMedalVisible(true);
        }}
      >
        {/* <Text style={styles.addButtonText}>タスク追加</Text> */}
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          alert("Modal has been closed.");
          setMedalVisible(!modalVisible);
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
                  <Text
                    style={styles.dateText}
                  >{`${date.toLocaleTimeString()}`}</Text>
                </TouchableOpacity>
                {/* <Button
                  onPress={() => showMode("time")}
                  title={`${date.toLocaleTimeString()}`}
                /> */}
                {/* <Text>Selected Date: {date.toDateString()}</Text> */}
                {/* <Text>Selected Time: {date.toLocaleTimeString()}</Text> */}
                {/* <Countdown
                  date={date}
                  intervalDelay={1000} // 1秒ごとにコールバック関数を実行する
                  renderer={renderer} // 残りの時間を表示する関数
                  onTick={handleInterval} // インターバル毎に実行する関数
                  onComplete={handleComplete} // タイマー終了時に実行する関数
                /> */}
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
                  {/* <Picker.Item label="In Progress" value="In Progress" />
                  <Picker.Item label="resolved" value="resolved" /> */}
                </Picker>
              </View>
            </SafeAreaView>
            {/* <Button
              title="Submit"
              onPress={() => {
                writeTaskPost();
                setMedalVisible(false);
                onChangeTaskText("");
                onChangeGoalText("");
                setSelectedManHour("0.5");
                setSelectedStatus("未着手");
                setDate(new Date());
              }}
              style={styles.button}
            ></Button> */}
             <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                writeTaskPost();
                setMedalVisible(false);
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
                setMedalVisible(!modalVisible);
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
  buttonWrap: {
    // flex: 1,
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
