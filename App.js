import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Linking,
  Platform,
  Switch, // <-- Added here
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";


// =====================================================
// APP INFORMATION
// =====================================================

const APP_NAME = "Smart Money";

const STORAGE_KEY = "@smart_money_notes";

const PASSWORD_KEY = "@smart_money_password";

const SETTINGS_KEY = "@smart_money_settings";

const PROFILE_KEY = "@smart_money_profile";

const CREATOR_EMAIL = "mazenshereef.ads@gmail.com";


// =====================================================
// MAIN APP
// =====================================================

export default function App() {

  // ---------------------------------------------------
  // Navigation & Password
  // ---------------------------------------------------
  const [profileName, setProfileName] = useState("");
  const [appUnlocked, setAppUnlocked] = useState(false);

  const [passwordModal, setPasswordModal] = useState(false);

  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState("");
  const [screen, setScreen] = useState("home");
  const [password, setPassword] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordReady, setPasswordReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ---------------------------------------------------
  // Notes
  // ---------------------------------------------------

  const [notes, setNotes] = useState([]);

  const [selectedNote, setSelectedNote] = useState(null);

  // ---------------------------------------------------
  // Note Form
  // ---------------------------------------------------

  const [noteTitle, setNoteTitle] = useState("");

  // ---------------------------------------------------
  // Transaction Form
  // ---------------------------------------------------

  const [transactionName, setTransactionName] = useState("");

  const [transactionAmount, setTransactionAmount] = useState("");
  const [editingTransactionId, setEditingTransactionId] = useState(null);

  // ---------------------------------------------------
  // Appearance
  // ---------------------------------------------------

  const [darkMode, setDarkMode] = useState(false);

  // ---------------------------------------------------
  // Chatbot
  // ---------------------------------------------------

  const [chatQuestion, setChatQuestion] = useState("");

  const [chatAnswer, setChatAnswer] = useState("");

  // ---------------------------------------------------
  // Load Everything
  // ---------------------------------------------------

  useEffect(() => {
    loadNotes();
    loadSettings();
    loadProfile();
    loadPassword();
  }, []);


  // ===================================================
  // STORAGE
  // ===================================================

  async function loadNotes() {
    try {
      const savedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.log("Error Loading Notes : ", error);
    }
  }

  async function saveNotes(updatedNotes) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedNotes)
      );
      setNotes(updatedNotes);
    } catch (error) {
      console.log("Error Saving Notes : ", error);
    }
  }

  async function loadSettings() {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setDarkMode(settings.darkMode === true);
      }
    } catch (error) {
      console.log("Error Loading Settings : ", error);
    }
  }

  async function saveSettings(newDarkMode) {
    try {
      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          darkMode: newDarkMode,
        })
      );
    } catch (error) {
      console.log("Error Saving Settings : ", error);
    }
  }

  async function loadProfile() {
    try {
      const savedProfile = await AsyncStorage.getItem(PROFILE_KEY);
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setProfileName(profileData.name || "");
      }
    } catch (error) {
      console.log("Load Profile Error:", error);
    }
  }

  async function loadPassword() {
    try {
      const savedPassword = await AsyncStorage.getItem(PASSWORD_KEY);
      if (savedPassword) {
        setPassword(savedPassword);
        setHasPassword(true);
      } else {
        setHasPassword(false);
      }
      setPasswordReady(true);
    } catch (error) {
      console.log("Error Loading Password:", error);
      setPasswordReady(true);
    }
  }

  async function createPassword() {
    if (!enteredPassword.trim()) {
      Alert.alert("Missing Password", "Please Enter A Password .");
      return;
    }

    if (enteredPassword.length < 4) {
      Alert.alert(
        "Password Too Short",
        "Your Password Must Contain At Least 4 Characters ."
      );
      return;
    }

    if (enteredPassword !== confirmPassword) {
      Alert.alert(
        "Passwords Do Not Match",
        "Please Make Sure Both Passwords Are The Same ."
      );
      return;
    }

    try {
      await AsyncStorage.setItem(PASSWORD_KEY, enteredPassword);
      setPassword(enteredPassword);
      setHasPassword(true);
      setAppUnlocked(true);
      setEnteredPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log("Error Saving Password:", error);
      Alert.alert("Error", "The Password Could Not Be Saved .");
    }
  }

  async function changePassword() {
    if (!currentPasswordInput) {
      Alert.alert("Current Password Required", "Please Enter Your Current Password .");
      return;
    }

    if (currentPasswordInput !== password) {
      Alert.alert("Incorrect Password", "Your Current Password Is Incorrect .");
      return;
    }

    if (!newPasswordInput) {
      Alert.alert("New Password Required", "Please Enter Your New Password .");
      return;
    }

    if (newPasswordInput.length < 4) {
      Alert.alert(
        "Password Too Short",
        "Your New Password Must Contain At Least 4 Characters ."
      );
      return;
    }

    if (newPasswordInput !== confirmNewPasswordInput) {
      Alert.alert(
        "Passwords Do Not Match",
        "Please Make Sure Both New Passwords Are The Same ."
      );
      return;
    }

    try {
      await AsyncStorage.setItem(PASSWORD_KEY, newPasswordInput);
      setPassword(newPasswordInput);
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setConfirmNewPasswordInput("");
      setPasswordModal(false);

      Alert.alert(
        "Password Changed",
        "Your Password Has Been Changed Successfully ."
      );
    } catch (error) {
      console.log("Change Password Error:", error);
      Alert.alert("Error", "The Password Could Not Be Changed .");
    }
  }

  async function saveProfile() {
    try {
      const profileData = {
        name: profileName,
      };

      await AsyncStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(profileData)
      );

      Alert.alert(
        "Profile Saved",
        "Your Profile Has Been Saved Successfully ."
      );
    } catch (error) {
      console.log("Save Profile Error:", error);
      Alert.alert("Error", "Your Profile Could Not Be Saved .");
    }
  }

  function unlockApp() {
    if (enteredPassword === password) {
      setEnteredPassword("");
      setAppUnlocked(true);
      setScreen("home");
    } else {
      Alert.alert(
        "Incorrect Password",
        "The Password You Entered Is Incorrect ."
      );
      setEnteredPassword("");
    }
  }

  async function sendEmail() {
    const email = CREATOR_EMAIL;
    const subject = encodeURIComponent("Smart Money - Contact");
    const body = encodeURIComponent(
      "Hello,\n\nI would like to contact the creator of Smart Money.\n\n"
    );

    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    try {
      if (Platform.OS === "web") {
        if (
          typeof window !== "undefined" &&
          typeof window.location !== "undefined"
        ) {
          window.location.href = mailtoUrl;
          return;
        }
      }

      const supported = await Linking.canOpenURL(mailtoUrl);

      if (supported) {
        await Linking.openURL(mailtoUrl);
        return;
      }

      Alert.alert("Email", `Please send an email to:\n\n${email}`, [
        { text: "OK", style: "default" },
      ]);
    } catch (error) {
      console.log("Email Error:", error);
      Alert.alert("Unable To Open Email", `Please send an email to:\n\n${email}`, [
        { text: "OK", style: "default" },
      ]);
    }
  }

  // ===================================================
  // THEME
  // ===================================================

  const theme = darkMode ? darkTheme : lightTheme;

  function toggleDarkMode(value) {
    setDarkMode(value);
    saveSettings(value);
  }

  // ===================================================
  // CREATE NOTE
  // ===================================================

  function createNote() {
    if (!noteTitle.trim()) {
      Alert.alert("Missing Title", "Please Enter A Title For Your Note .");
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      title: noteTitle.trim(),
      createdDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      transactions: [],
    };

    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setSelectedNote(newNote);
    setNoteTitle("");
    setScreen("note");
  }

  // ===================================================
  // UPDATE SELECTED NOTE
  // ===================================================

  function updateSelectedNote(updatedNote) {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    saveNotes(updatedNotes);
    setSelectedNote(updatedNote);
  }

  // ===================================================
  // DELETE NOTE
  // ===================================================

  function deleteNote() {
    if (!selectedNote) return;

    const updatedNotes = notes.filter((note) => note.id !== selectedNote.id);
    setNotes(updatedNotes);
    setSelectedNote(null);
    setScreen("home");

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes)).catch(
      (error) => {
        console.log("Delete Note Error:", error);
      }
    );
  }

  // ===================================================
  // ADD / EDIT TRANSACTION
  // ===================================================

  function addTransaction(type) {
    if (!selectedNote) return;

    if (!transactionName.trim()) {
      Alert.alert("Missing Name", "Please Enter The Transaction Name .");
      return;
    }

    if (!transactionAmount.trim()) {
      Alert.alert("Missing Amount", "Please Enter The Amount .");
      return;
    }

    const cleanAmount = transactionAmount.replace(/,/g, "").trim();
    const amount = Number(cleanAmount);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please Enter A Valid Positive Number .");
      return;
    }

    let updatedTransactions;

    if (editingTransactionId) {
      updatedTransactions = selectedNote.transactions.map((tx) =>
        tx.id === editingTransactionId
          ? { ...tx, name: transactionName.trim(), amount: amount, type: type }
          : tx
      );
      setEditingTransactionId(null);
    } else {
      const transaction = {
        id: Date.now().toString(),
        name: transactionName.trim(),
        amount: amount,
        type: type,
      };

      updatedTransactions = [...selectedNote.transactions, transaction];
    }

    const updatedNote = {
      ...selectedNote,
      transactions: updatedTransactions,
    };

    updateSelectedNote(updatedNote);
    setTransactionName("");
    setTransactionAmount("");
    setScreen("note");
  }

  function editTransaction(transaction) {
    setEditingTransactionId(transaction.id);
    setTransactionName(transaction.name);
    setTransactionAmount(String(transaction.amount));
    if (transaction.type === "Cash In") {
      setScreen("cashIn");
    } else {
      setScreen("cashOut");
    }
  }

  // ===================================================
  // DELETE TRANSACTION
  // ===================================================

  function deleteTransaction(transactionId) {
    if (!selectedNote) return;

    const updatedTransactions = selectedNote.transactions.filter(
      (transaction) => transaction.id !== transactionId
    );

    const updatedNote = {
      ...selectedNote,
      transactions: updatedTransactions,
    };

    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id ? updatedNote : note
    );

    setNotes(updatedNotes);
    setSelectedNote(updatedNote);

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes)).catch(
      (error) => {
        console.log("Delete Transaction Error:", error);
      }
    );
  }

  // ===================================================
  // EDIT NOTE
  // ===================================================

  function saveEditedNote() {
    if (!selectedNote) return;

    if (!noteTitle.trim()) {
      Alert.alert("Missing Title", "Please Enter A Title .");
      return;
    }

    const updatedNote = {
      ...selectedNote,
      title: noteTitle.trim(),
    };

    updateSelectedNote(updatedNote);
    setNoteTitle("");
    setScreen("note");
  }

  // ===================================================
  // CALCULATE TOTALS
  // ===================================================

  function calculateTotals(note) {
    let cashIn = 0;
    let cashOut = 0;

    note.transactions.forEach((transaction) => {
      if (transaction.type === "Cash In") {
        cashIn += transaction.amount;
      }
      if (transaction.type === "Cash Out") {
        cashOut += transaction.amount;
      }
    });

    return {
      cashIn,
      cashOut,
      difference: cashIn - cashOut,
    };
  }

  // ===================================================
  // FORMAT MONEY
  // ===================================================

  function formatMoney(amount) {
    return Number(amount).toLocaleString("en-US") + " EGP";
  }

  // ===================================================
  // CHATBOT
  // ===================================================

  function askChatbot(question) {
    const cleanQuestion = question.trim().toLowerCase();

    if (!cleanQuestion) {
      Alert.alert("Ask Smart Money", "Please Enter A Question .");
      return;
    }

    let answer =
      "I Am Here To Help You Understand Your Money And Your Smart Money Notes .";

    if (cleanQuestion.includes("cash in")) {
      answer =
        "Cash In Means Money That You Received . For Example , Salary , Rent Received , Or Money Someone Paid You .";
    } else if (cleanQuestion.includes("cash out")) {
      answer =
        "Cash Out Means Money That You Paid . For Example , Electricity , Shopping , Rent Paid , Or Other Expenses .";
    } else if (cleanQuestion.includes("difference")) {
      answer =
        "Difference Is Calculated By Subtracting Cash Out From Cash In . For Example , 5000 EGP Cash In And 1000 EGP Cash Out Gives A Difference Of 4000 EGP .";
    } else if (cleanQuestion.includes("delete")) {
      answer =
        "You Can Delete A Transaction Using The Small Delete Button Next To It . You Can Delete An Entire Note Using The Delete Button At The Top Of The Note .";
    } else if (cleanQuestion.includes("note")) {
      answer =
        "A Note Keeps A Group Of Transactions Together . Each Note Has Its Own Cash In , Cash Out , And Difference Totals .";
    } else if (cleanQuestion.includes("smart money")) {
      answer =
        "Smart Money Helps You Organize Money You Receive And Money You Pay In A Simple And Professional Way .";
    }

    setChatAnswer(answer);
  }

  // ===================================================
  // PASSWORD SCREEN
  // ===================================================

  function PasswordScreen() {
    const isCreatingPassword = !hasPassword;

    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <View style={styles.passwordContainer}>
          <View style={styles.passwordLogo}>
            <Ionicons name="wallet-outline" size={55} color={theme.text} />
          </View>

          <Text style={[styles.passwordAppName, { color: theme.text }]}>
            Smart Money
          </Text>

          <Text style={[styles.passwordWelcome, { color: theme.secondary }]}>
            {isCreatingPassword
              ? "Create Your Password"
              : "Welcome Back"}
          </Text>

          <View style={styles.passwordInputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={21}
              color={theme.secondary}
            />

            <TextInput
              style={[styles.passwordInput, { color: theme.text }]}
              placeholder={
                isCreatingPassword
                  ? "Create Password"
                  : "Enter Your Password"
              }
              placeholderTextColor={theme.placeholder}
              value={enteredPassword}
              onChangeText={setEnteredPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={21}
                color={theme.secondary}
              />
            </TouchableOpacity>
          </View>

          {isCreatingPassword && (
            <View style={styles.passwordInputContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={21}
                color={theme.secondary}
              />

              <TextInput
                style={[styles.passwordInput, { color: theme.text }]}
                placeholder="Confirm Password"
                placeholderTextColor={theme.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.passwordButton, { backgroundColor: theme.button }]}
            onPress={isCreatingPassword ? createPassword : unlockApp}
          >
            <Ionicons
              name={
                isCreatingPassword
                  ? "checkmark-circle-outline"
                  : "lock-open-outline"
              }
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.passwordButtonText}>
              {isCreatingPassword ? "Create Password" : "Unlock Smart Money"}
            </Text>
          </TouchableOpacity>

          <Text
            style={[styles.passwordSecurityText, { color: theme.secondary }]}
          >
            Your Financial Records Stay On This Device .
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ===================================================
  // HOME SCREEN
  // ===================================================

  function HomeScreen() {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <View style={styles.mainLayout}>
          {/* SIDEBAR */}
          <View
            style={[
              styles.sidebar,
              {
                backgroundColor: theme.card,
                borderRightColor: theme.border,
              },
            ]}
          >
            <View style={styles.sidebarLogo}>
              <Ionicons name="wallet-outline" size={24} color={theme.text} />
            </View>

            <TouchableOpacity
              style={styles.sideButton}
              onPress={() => setScreen("settings")}
            >
              <Ionicons
                name="settings-outline"
                size={23}
                color={theme.secondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sideButton}
              onPress={() => setScreen("profile")}
            >
              <Ionicons
                name="person-outline"
                size={23}
                color={theme.secondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sideButton}
              onPress={() => setScreen("about")}
            >
              <Ionicons
                name="information-circle-outline"
                size={23}
                color={theme.secondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sideButton}
              onPress={() => setScreen("contact")}
            >
              <Ionicons
                name="mail-outline"
                size={23}
                color={theme.secondary}
              />
            </TouchableOpacity>
          </View>

          {/* MAIN CONTENT */}
          <View style={[styles.content, { backgroundColor: theme.background }]}>
            <Text style={[styles.appTitle, { color: theme.text }]}>
              Smart Money
            </Text>

            <Text style={[styles.subtitle, { color: theme.secondary }]}>
              Your Money , Organized .
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.notesContainer}
            >
              {notes.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="wallet-outline"
                    size={55}
                    color={theme.secondary}
                  />
                  <Text style={[styles.emptyTitle, { color: theme.secondary }]}>
                    No Transaction Notes Yet
                  </Text>
                  <Text style={[styles.emptyText, { color: theme.secondary }]}>
                    Create Your First Note To Start Tracking Your Money .
                  </Text>
                </View>
              ) : (
                notes.map((note) => (
                  <TouchableOpacity
                    key={note.id}
                    style={[
                      styles.noteCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => {
                      setSelectedNote(note);
                      setScreen("note");
                    }}
                  >
                    <View>
                      <Text style={[styles.noteTitle, { color: theme.text }]}>
                        {note.title}
                      </Text>
                      <Text
                        style={[
                          styles.transactionCount,
                          { color: theme.secondary },
                        ]}
                      >
                        {note.transactions.length} Transaction
                        {note.transactions.length !== 1 ? "s" : ""}
                      </Text>
                    </View>

                    <Text
                      style={[styles.noteDate, { color: theme.secondary }]}
                    >
                      {note.createdDate}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>

        {/* BOTTOM BAR */}
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: theme.card,
              borderTopColor: theme.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.addNoteButton, { backgroundColor: theme.button }]}
            onPress={() => {
              setNoteTitle("");
              setScreen("createNote");
            }}
          >
            <Ionicons name="add" size={25} color="#FFFFFF" />
            <Text style={styles.addNoteText}>Add Transaction Note</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ===================================================
  // CREATE NOTE SCREEN
  // ===================================================

  function CreateNoteScreen() {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <View style={styles.formContainer}>
          <TouchableOpacity
            onPress={() => setScreen("home")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={25} color={theme.text} />
          </TouchableOpacity>

          <Text style={[styles.formTitle, { color: theme.text }]}>
            New Transaction Note
          </Text>

          <Text style={[styles.inputLabel, { color: theme.secondary }]}>
            Note Title
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Example : House Expenses"
            placeholderTextColor={theme.placeholder}
            value={noteTitle}
            onChangeText={setNoteTitle}
          />

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setScreen("home")}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.button }]}
              onPress={createNote}
            >
              <Text style={styles.primaryText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ===================================================
  // NOTE SCREEN
  // ===================================================

  function NoteScreen() {
    if (!selectedNote) return null;

    const totals = calculateTotals(selectedNote);

    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        {/* HEADER */}
        <View
          style={[
            styles.noteHeader,
            {
              backgroundColor: theme.card,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <TouchableOpacity onPress={() => setScreen("home")}>
            <Ionicons name="arrow-back" size={25} color={theme.text} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={[styles.detailTitle, { color: theme.text }]}>
              {selectedNote.title}
            </Text>
            <Text style={[styles.detailDate, { color: theme.secondary }]}>
              {selectedNote.createdDate}
            </Text>
          </View>

          {/* EDIT */}
          <TouchableOpacity
            onPress={() => {
              setNoteTitle(selectedNote.title);
              setScreen("editNote");
            }}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color={theme.secondary}
            />
          </TouchableOpacity>

          {/* DELETE NOTE */}
          <TouchableOpacity onPress={deleteNote} style={{ marginLeft: 15 }}>
            <Ionicons name="trash-outline" size={24} color="#D44A4A" />
          </TouchableOpacity>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.cashInButton}
            onPress={() => {
              setTransactionName("");
              setTransactionAmount("");
              setEditingTransactionId(null);
              setScreen("cashIn");
            }}
          >
            <Ionicons
              name="arrow-down-circle-outline"
              size={22}
              color="#FFFFFF"
            />
            <Text style={styles.actionText}>Cash In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cashOutButton}
            onPress={() => {
              setTransactionName("");
              setTransactionAmount("");
              setEditingTransactionId(null);
              setScreen("cashOut");
            }}
          >
            <Ionicons
              name="arrow-up-circle-outline"
              size={22}
              color="#FFFFFF"
            />
            <Text style={styles.actionText}>Cash Out</Text>
          </TouchableOpacity>
        </View>

        {/* TRANSACTIONS */}
        <ScrollView
          style={styles.transactionList}
          showsVerticalScrollIndicator={false}
        >
          {selectedNote.transactions.length === 0 ? (
            <View style={styles.emptyTransactions}>
              <Ionicons
                name="receipt-outline"
                size={45}
                color={theme.secondary}
              />
              <Text style={[styles.emptyTitle, { color: theme.secondary }]}>
                No Transactions Yet
              </Text>
              <Text style={[styles.emptyText, { color: theme.secondary }]}>
                Add Cash In Or Cash Out Transactions .
              </Text>
            </View>
          ) : (
            selectedNote.transactions.map((transaction) => (
              <View
                key={transaction.id}
                style={[
                  styles.transactionCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.transactionName, { color: theme.text }]}
                  >
                    {transaction.name}
                  </Text>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: theme.secondary },
                    ]}
                  >
                    {formatMoney(transaction.amount)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.typeBadge,
                    transaction.type === "Cash In"
                      ? styles.cashInBadge
                      : styles.cashOutBadge,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {transaction.type.toUpperCase()}
                  </Text>
                </View>

                {/* SMALL EDIT BUTTON */}
                <TouchableOpacity
                  style={styles.transactionEditButton}
                  onPress={() => editTransaction(transaction)}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={17}
                    color={theme.text}
                  />
                </TouchableOpacity>

                {/* SMALL DELETE BUTTON */}
                <TouchableOpacity
                  style={styles.transactionDeleteButton}
                  onPress={() => deleteTransaction(transaction.id)}
                >
                  <Ionicons name="trash-outline" size={17} color="#D44A4A" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

        {/* SUMMARY */}
        <View
          style={[
            styles.summaryBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.secondary }]}>
              Cash In
            </Text>
            <Text style={[styles.cashInTotal, { color: theme.text }]}>
              {formatMoney(totals.cashIn)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.secondary }]}>
              Cash Out
            </Text>
            <Text style={[styles.cashOutTotal, { color: theme.text }]}>
              {formatMoney(totals.cashOut)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.secondary }]}>
              Difference
            </Text>
            <Text style={[styles.differenceTotal, { color: theme.text }]}>
              {formatMoney(totals.difference)}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ===================================================
  // CASH IN / CASH OUT
  // ===================================================

  function TransactionScreen({ type }) {
    const isCashIn = type === "Cash In";

    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <View style={styles.formContainer}>
          <TouchableOpacity
            onPress={() => setScreen("note")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={25} color={theme.text} />
          </TouchableOpacity>

          <Text style={[styles.formTitle, { color: theme.text }]}>
            {editingTransactionId ? `Edit ${type}` : type}
          </Text>

          <Text style={[styles.inputLabel, { color: theme.secondary }]}>
            Transaction Name
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder={
              isCashIn ? "Example : Salary" : "Example : Electricity"
            }
            placeholderTextColor={theme.placeholder}
            value={transactionName}
            onChangeText={setTransactionName}
          />

          <Text style={[styles.inputLabel, { color: theme.secondary }]}>
            Amount
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="0"
            placeholderTextColor={theme.placeholder}
            keyboardType="numeric"
            value={transactionAmount}
            onChangeText={setTransactionAmount}
          />

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setScreen("note")}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: isCashIn ? theme.button : "#555555",
                },
              ]}
              onPress={() => addTransaction(type)}
            >
              <Text style={styles.primaryText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ===================================================
  // EDIT NOTE
  // ===================================================

  function EditNoteScreen() {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <View style={styles.formContainer}>
          <TouchableOpacity
            onPress={() => setScreen("note")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={25} color={theme.text} />
          </TouchableOpacity>

          <Text style={[styles.formTitle, { color: theme.text }]}>
            Edit Note
          </Text>

          <Text style={[styles.inputLabel, { color: theme.secondary }]}>
            Note Title
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            value={noteTitle}
            onChangeText={setNoteTitle}
          />

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.button }]}
            onPress={saveEditedNote}
          >
            <Text style={styles.primaryText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ===================================================
  // SETTINGS
  // ===================================================

  function SettingsScreen() {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <ScrollView contentContainerStyle={styles.simpleScreen}>
          <TouchableOpacity onPress={() => setScreen("home")}>
            <Ionicons name="arrow-back" size={25} color={theme.text} />
          </TouchableOpacity>

          <Text style={[styles.formTitle, { color: theme.text }]}>
            Settings
          </Text>

          {/* DARK / LIGHT MODE */}
          <View
            style={[
              styles.settingRow,
              {
                borderBottomColor: theme.border,
              },
            ]}
          >
            <Ionicons
              name={darkMode ? "moon-outline" : "sunny-outline"}
              size={23}
              color={theme.secondary}
            />

            <Text style={[styles.settingText, { color: theme.text }]}>
              {darkMode ? "Dark Mode" : "Light Mode"}
            </Text>

            <Switch
              style={{ marginLeft: "auto" }}
              value={darkMode}
              onValueChange={toggleDarkMode}
            />
          </View>

          {/* CHANGE PASSWORD */}
          <TouchableOpacity
            style={[
              styles.settingRow,
              {
                borderBottomColor: theme.border,
              },
            ]}
            onPress={() => {
              setPasswordModal(true);
            }}
          >
            <Ionicons name="key-outline" size={23} color={theme.secondary} />

            <Text style={[styles.settingText, { color: theme.text }]}>
              Change Password
            </Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.secondary}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

          {/* ACCOUNT */}
          <TouchableOpacity
            style={[
              styles.settingRow,
              {
                borderBottomColor: theme.border,
              },
            ]}
            onPress={() => setScreen("profile")}
          >
            <Ionicons
              name="person-outline"
              size={23}
              color={theme.secondary}
            />

            <Text style={[styles.settingText, { color: theme.text }]}>
              Account
            </Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.secondary}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

          {/* CHATBOT */}
          <TouchableOpacity
            style={[
              styles.settingRow,
              {
                borderBottomColor: theme.border,
              },
            ]}
            onPress={() => setScreen("chatbot")}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={23}
              color={theme.secondary}
            />

            <Text style={[styles.settingText, { color: theme.text }]}>
              Smart Money Assistant
            </Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.secondary}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        </ScrollView>

        {/* PASSWORD MODAL FOR CHANGE PASSWORD */}
        <Modal
          visible={passwordModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setPasswordModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Change Password
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Current Password"
                placeholderTextColor={theme.placeholder}
                secureTextEntry={true}
                value={currentPasswordInput}
                onChangeText={setCurrentPasswordInput}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="New Password"
                placeholderTextColor={theme.placeholder}
                secureTextEntry={true}
                value={newPasswordInput}
                onChangeText={setNewPasswordInput}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Confirm New Password"
                placeholderTextColor={theme.placeholder}
                secureTextEntry={true}
                value={confirmNewPasswordInput}
                onChangeText={setConfirmNewPasswordInput}
              />

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setCurrentPasswordInput("");
                    setNewPasswordInput("");
                    setConfirmNewPasswordInput("");
                    setPasswordModal(false);
                  }}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: theme.button }]}
                  onPress={changePassword}
                >
                  <Text style={styles.primaryText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // ===================================================
  // ACCOUNT / PROFILE (ONLY NAME FIELD REMAINING)
  // ===================================================

  function ProfileScreen() {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >
          {/* HEADER */}
          <View style={styles.profileHeader}>
            <TouchableOpacity
              onPress={() => setScreen("settings")}
              style={styles.profileBackButton}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            <Text style={[styles.profileHeaderTitle, { color: theme.text }]}>
              Profile
            </Text>

            <View style={{ width: 40 }} />
          </View>

          {/* PROFILE PHOTO & AVATAR */}
          <View style={styles.profileTopSection}>
            <View
              style={[
                styles.profileAvatar,
                {
                  backgroundColor: theme.button,
                },
              ]}
            >
              <Text style={styles.profileAvatarText}>
                {profileName
                  ? profileName.trim().charAt(0).toUpperCase()
                  : "S"}
              </Text>
            </View>

            <Text style={[styles.profileName, { color: theme.text }]}>
              {profileName || "Smart Money User"}
            </Text>

            <Text style={[styles.profileSubtitle, { color: theme.secondary }]}>
              Manage Your Personal Information
            </Text>
          </View>

          {/* PERSONAL INFORMATION (NAME ONLY) */}
          <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.profileSectionTitle, { color: theme.text }]}>
              Personal Information
            </Text>

            {/* NAME */}
            <View style={styles.profileField}>
              <View style={styles.profileFieldIcon}>
                <Ionicons name="person-outline" size={21} color={theme.text} />
              </View>

              <View style={styles.profileFieldContent}>
                <Text
                  style={[styles.profileFieldLabel, { color: theme.secondary }]}
                >
                  Name
                </Text>

                <TextInput
                  style={[styles.profileTextInput, { color: theme.text }]}
                  value={profileName}
                  onChangeText={setProfileName}
                  placeholder="Enter Your Name"
                  placeholderTextColor={theme.placeholder}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity
            style={[styles.profileSaveButton, { backgroundColor: theme.button }]}
            onPress={saveProfile}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="#FFFFFF"
            />
            <Text style={styles.profileSaveButtonText}>Save Profile</Text>
          </TouchableOpacity>

          {/* ACCOUNT INFORMATION */}
          <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.profileSectionTitle, { color: theme.text }]}>
              Account Information
            </Text>

            <View style={styles.profileInfoRow}>
              <View style={styles.profileInfoIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={21}
                  color={theme.text}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.profileInfoTitle, { color: theme.text }]}>
                  Account Security
                </Text>
                <Text
                  style={[
                    styles.profileInfoDescription,
                    { color: theme.secondary },
                  ]}
                >
                  Your Smart Money Account Is Protected .
                </Text>
              </View>
            </View>

            <View style={styles.profileInfoRow}>
              <View style={styles.profileInfoIcon}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={21}
                  color={theme.text}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.profileInfoTitle, { color: theme.text }]}>
                  Local Account
                </Text>
                <Text
                  style={[
                    styles.profileInfoDescription,
                    { color: theme.secondary },
                  ]}
                >
                  Your Profile Information Is Stored On This Device .
                </Text>
              </View>
            </View>
          </View>

          {/* BACK BUTTON */}
          <TouchableOpacity
            style={[
              styles.profileBackLargeButton,
              { borderColor: theme.border },
            ]}
            onPress={() => setScreen("settings")}
          >
            <Ionicons name="arrow-back-outline" size={20} color={theme.text} />
            <Text
              style={[
                styles.profileBackLargeButtonText,
                { color: theme.text },
              ]}
            >
              Back To Settings
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ===================================================
  // CHATBOT
  // ===================================================

  function ChatbotScreen() {
    const questions = [
      "What Is Cash In ?",
      "What Is Cash Out ?",
      "How Is Difference Calculated ?",
      "How Do I Delete A Transaction ?",
      "What Is A Note ?",
      "What Is Smart Money ?",
    ];

    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <ScrollView contentContainerStyle={styles.chatbotContainer}>
          <TouchableOpacity onPress={() => setScreen("settings")}>
            <Ionicons name="arrow-back" size={25} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.chatbotHeader}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={45}
              color={theme.text}
            />

            <Text
              style={[
                styles.formTitle,
                { color: theme.text, marginBottom: 5 },
              ]}
            >
              Smart Money Assistant
            </Text>

            <Text style={[styles.emptyText, { color: theme.secondary }]}>
              Choose A Question Or Ask Your Own Question .
            </Text>
          </View>

          {/* QUICK QUESTIONS */}
          {questions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chatQuestionButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => askChatbot(question)}
            >
              <Text style={[styles.chatQuestionText, { color: theme.text }]}>
                {question}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={19}
                color={theme.secondary}
              />
            </TouchableOpacity>
          ))}

          {/* CUSTOM QUESTION */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border,
                marginTop: 15,
              },
            ]}
            placeholder="Ask Something About Smart Money"
            placeholderTextColor={theme.placeholder}
            value={chatQuestion}
            onChangeText={setChatQuestion}
          />

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.button }]}
            onPress={() => askChatbot(chatQuestion)}
          >
            <Text style={styles.primaryText}>Ask Assistant</Text>
          </TouchableOpacity>

          {/* ANSWER */}
          {chatAnswer ? (
            <View
              style={[
                styles.chatAnswerBox,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.chatAnswerTitle, { color: theme.text }]}>
                Smart Money Assistant
              </Text>

              <Text style={[styles.chatAnswerText, { color: theme.secondary }]}>
                {chatAnswer}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ===================================================
  // ABOUT
  // ===================================================

  function AboutScreen() {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <ScrollView contentContainerStyle={styles.simpleScreen}>
          <TouchableOpacity onPress={() => setScreen("home")}>
            <Ionicons name="arrow-back" size={25} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.aboutHeader}>
            <Ionicons name="wallet-outline" size={65} color={theme.text} />

            <Text style={[styles.aboutAppName, { color: theme.text }]}>
              Smart Money
            </Text>

            <Text style={[styles.aboutVersion, { color: theme.secondary }]}>
              Version 1 . 0
            </Text>
          </View>

          <View
            style={[
              styles.aboutCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.aboutSectionTitle, { color: theme.text }]}>
              About The App
            </Text>

            <Text style={[styles.aboutParagraph, { color: theme.secondary }]}>
              Smart Money Is A Simple And Professional Personal Money Management
              Application Designed To Help You Organize Your Daily Financial
              Transactions With Clarity And Ease .
            </Text>

            <Text style={[styles.aboutParagraph, { color: theme.secondary }]}>
              The Application Allows You To Create Independent Transaction Notes ,
              Record Money You Receive As Cash In , Record Money You Pay As Cash
              Out , And Automatically Calculate The Difference Between Them .
            </Text>

            <Text style={[styles.aboutParagraph, { color: theme.secondary }]}>
              Every Note Is Independent . Money From One Note Is Never Carried
              Into Another Note . This Keeps Your Financial Records Clear ,
              Organized , And Easy To Understand .
            </Text>

            <Text style={[styles.aboutParagraph, { color: theme.secondary }]}>
              Smart Money Was Designed With A Clean Interface , Simple
              Navigation , And Reliable Local Data Storage So Your Information
              Remains Available When You Return To The Application .
            </Text>
          </View>

          <Text style={[styles.creatorText, { color: theme.secondary }]}>
            Designed And Developed With Care .
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ===================================================
  // CONTACT CREATOR
  // ===================================================

  function ContactScreen() {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <View style={styles.simpleScreen}>
          <TouchableOpacity onPress={() => setScreen("home")}>
            <Ionicons name="arrow-back" size={25} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.contactHeader}>
            <Ionicons name="mail-outline" size={65} color={theme.text} />

            <Text
              style={[
                styles.formTitle,
                { color: theme.text, textAlign: "center", marginBottom: 10 },
              ]}
            >
              Contact Creator
            </Text>

            <Text
              style={[
                styles.aboutText,
                { color: theme.secondary, textAlign: "center" },
              ]}
            >
              Have A Question , Suggestion , Or Found A Problem ? Send An Email
              Directly To The Creator Of Smart Money .
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.button }]}
            onPress={sendEmail}
          >
            <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryText}>Send Email To Creator</Text>
          </TouchableOpacity>

          <Text style={[styles.emailText, { color: theme.secondary }]}>
            {CREATOR_EMAIL}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ===================================================
  // SCREEN ROUTER
  // ===================================================

  if (!passwordReady) {
    return null;
  }

  if (!hasPassword || !appUnlocked) {
    return PasswordScreen();
  }

  if (screen === "home") {
    return HomeScreen();
  }

  if (screen === "createNote") {
    return CreateNoteScreen();
  }

  if (screen === "note") {
    return NoteScreen();
  }

  if (screen === "cashIn") {
    return TransactionScreen({
      type: "Cash In",
    });
  }

  if (screen === "cashOut") {
    return TransactionScreen({
      type: "Cash Out",
    });
  }

  if (screen === "editNote") {
    return EditNoteScreen();
  }

  if (screen === "settings") {
    return SettingsScreen();
  }

  if (screen === "profile") {
    return ProfileScreen();
  }

  if (screen === "chatbot") {
    return ChatbotScreen();
  }

  if (screen === "about") {
    return AboutScreen();
  }

  if (screen === "contact") {
    return ContactScreen();
  }

  return HomeScreen();
}


// =====================================================
// LIGHT THEME
// =====================================================

const lightTheme = {
  background: "#F7F7F5",
  card: "#FFFFFF",
  text: "#202020",
  secondary: "#858585",
  border: "#E6E6E6",
  button: "#202020",
  placeholder: "#AAAAAA",
};


// =====================================================
// DARK THEME
// =====================================================

const darkTheme = {
  background: "#111111",
  card: "#1D1D1D",
  text: "#F5F5F5",
  secondary: "#A5A5A5",
  border: "#303030",
  button: "#333333",
  placeholder: "#777777",
};


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  modalContainer: {
    borderRadius: 20,
    padding: 22,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 20,
  },

  profileHeader: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },

  profileBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  profileHeaderTitle: {
    fontSize: 20,
    fontWeight: "900",
  },

  profileTopSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 25,
  },

  profileAvatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  profileAvatarText: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
  },

  profileName: {
    fontSize: 24,
    fontWeight: "900",
  },

  profileSubtitle: {
    fontSize: 13,
    marginTop: 5,
  },

  profileCard: {
    marginHorizontal: 18,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  profileSectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 10,
  },

  profileField: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  profileFieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  profileFieldContent: {
    flex: 1,
  },

  profileFieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 3,
  },

  profileTextInput: {
    minHeight: 35,
    paddingVertical: 5,
    paddingHorizontal: 0,
    fontSize: 15,
    fontWeight: "600",
  },

  profileSaveButton: {
    height: 55,
    marginHorizontal: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },

  profileSaveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  profileInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },

  profileInfoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  profileInfoTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  profileInfoDescription: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },

  profileBackLargeButton: {
    height: 52,
    marginHorizontal: 18,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  profileBackLargeButtonText: {
    fontSize: 14,
    fontWeight: "800",
  },

  passwordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  passwordLogo: {
    width: 95,
    height: 95,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  passwordAppName: {
    fontSize: 32,
    fontWeight: "900",
  },

  passwordWelcome: {
    fontSize: 15,
    marginTop: 7,
    marginBottom: 35,
  },

  passwordInputContainer: {
    width: "100%",
    height: 55,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  passwordInput: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
  },

  passwordButton: {
    width: "100%",
    height: 55,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },

  passwordButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  passwordSecurityText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 18,
  },

  container: {
    flex: 1,
  },

  mainLayout: {
    flex: 1,
    flexDirection: "row",
  },

  // ---------------------------------------------------
  // SIDEBAR
  // ---------------------------------------------------

  sidebar: {
    width: 62,
    alignItems: "center",
    paddingTop: 18,
    borderRightWidth: 1,
  },

  sidebarLogo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  sideButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  // ---------------------------------------------------
  // HOME
  // ---------------------------------------------------

  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 25,
  },

  appTitle: {
    fontSize: 29,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },

  notesContainer: {
    paddingTop: 25,
    paddingBottom: 30,
  },

  noteCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    minHeight: 95,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderWidth: 1,
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  transactionCount: {
    fontSize: 12,
    marginTop: 6,
  },

  noteDate: {
    fontSize: 12,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 25,
  },

  emptyTransactions: {
    alignItems: "center",
    paddingTop: 70,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 15,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 13,
    marginTop: 7,
    textAlign: "center",
    lineHeight: 20,
  },

  // ---------------------------------------------------
  // BOTTOM BAR
  // ---------------------------------------------------

  bottomBar: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 15,
    borderTopWidth: 1,
  },

  addNoteButton: {
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  addNoteText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },

  // ---------------------------------------------------
  // FORMS
  // ---------------------------------------------------

  formContainer: {
    flex: 1,
    padding: 22,
  },

  backButton: {
    marginBottom: 25,
  },

  formTitle: {
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 30,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    borderWidth: 1,
    marginBottom: 22,
  },

  formButtons: {
    flexDirection: "row",
    marginTop: 10,
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8E8E6",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#555555",
  },

  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  // ---------------------------------------------------
  // NOTE HEADER
  // ---------------------------------------------------

  noteHeader: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    gap: 15,
  },

  detailTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  detailDate: {
    fontSize: 12,
    marginTop: 3,
  },

  // ---------------------------------------------------
  // CASH BUTTONS
  // ---------------------------------------------------

  actionRow: {
    flexDirection: "row",
    padding: 15,
    gap: 12,
  },

  cashInButton: {
    flex: 1,
    height: 50,
    backgroundColor: "#3C6B46",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  cashOutButton: {
    flex: 1,
    height: 50,
    backgroundColor: "#8A4545",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  // ---------------------------------------------------
  // TRANSACTIONS
  // ---------------------------------------------------

  transactionList: {
    flex: 1,
    paddingHorizontal: 15,
  },

  transactionCard: {
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },

  transactionName: {
    fontSize: 15,
    fontWeight: "700",
  },

  transactionAmount: {
    fontSize: 13,
    marginTop: 5,
  },

  typeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 10,
    marginLeft: 8,
  },

  cashInBadge: {
    backgroundColor: "#DCEBDD",
  },

  cashOutBadge: {
    backgroundColor: "#F0DADA",
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#555555",
  },

  transactionEditButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  transactionDeleteButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F5E7E7",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  // ---------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------

  summaryBox: {
    margin: 15,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
  },

  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
  },

  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },

  cashInTotal: {
    fontSize: 14,
    fontWeight: "800",
  },

  cashOutTotal: {
    fontSize: 14,
    fontWeight: "800",
  },

  differenceTotal: {
    fontSize: 16,
    fontWeight: "900",
  },

  // ---------------------------------------------------
  // SIMPLE SCREENS
  // ---------------------------------------------------

  simpleScreen: {
    flexGrow: 1,
    padding: 22,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 19,
    borderBottomWidth: 1,
  },

  settingText: {
    marginLeft: 14,
    fontSize: 15,
    fontWeight: "600",
  },

  // ---------------------------------------------------
  // CHATBOT
  // ---------------------------------------------------

  chatbotContainer: {
    padding: 22,
    paddingBottom: 40,
  },

  chatbotHeader: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  chatQuestionButton: {
    minHeight: 55,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  chatQuestionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
  },

  chatAnswerBox: {
    marginTop: 20,
    borderRadius: 17,
    borderWidth: 1,
    padding: 18,
  },

  chatAnswerTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 9,
  },

  chatAnswerText: {
    fontSize: 14,
    lineHeight: 23,
  },

  // ---------------------------------------------------
  // ABOUT
  // ---------------------------------------------------

  aboutHeader: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 25,
  },

  aboutAppName: {
    fontSize: 29,
    fontWeight: "900",
    marginTop: 10,
  },

  aboutVersion: {
    fontSize: 13,
    marginTop: 5,
  },

  aboutCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },

  aboutSectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 15,
  },

  aboutParagraph: {
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 16,
  },

  creatorText: {
    textAlign: "center",
    marginTop: 25,
    fontSize: 13,
  },

  // ---------------------------------------------------
  // CONTACT
  // ---------------------------------------------------

  contactHeader: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 15,
  },

  aboutText: {
    fontSize: 14,
    lineHeight: 22,
  },

  emailText: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 13,
  },
});