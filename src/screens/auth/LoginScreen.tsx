import {
  View,
  Image,
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Input, Button, Text } from "@ui-kitten/components";
import tw from "twrnc";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { colors } from "../../theme/colors";
import {
  signOutFromGoogle,
  signUpWithGoogle,
  validateEmail,
  validatePass,
  hasPreviousSignIn,
} from "../../utils/authHelpers";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import axios from "axios";
import userStore from "../../zustand/userStore";
import API_BASE_URL from "../../../config";
import CustomGoogleSigninButton from "../../components/CustomGoogleSigninButton ";
import { CommonActions, useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const { setUser, clearUser } = userStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isInProgress, setIsInProgress] = useState(false);
  const navigation = useNavigation();
  // Check for existing login on component mount
  useEffect(() => {
    // signOutFromGoogle()
    checkPreviousLogin();
  }, []);

  // Check if user is already logged in
  const checkPreviousLogin = async () => {
    try {
      const userJson = await SecureStore.getItemAsync("user");
      if (userJson) {
        navigation.dispatch(CommonActions.preload("Home"));
        const storedUser = JSON.parse(userJson);
        setUser(storedUser);
        console.log("Previous login:", storedUser._id);
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error checking previous login:", error);
    }
  };

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    setIsInProgress(true);
    const currentUser = await hasPreviousSignIn();

    if (currentUser) {
      const loggedInUser = {
        email: currentUser.user.email,
        idToken: currentUser.user.id,
        name: currentUser.user.name,
        photoUrl: currentUser.user.photo,
      };

      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/login`, {
          params: {
            email: loggedInUser.email,
            idToken: loggedInUser.idToken,
          },
        });

        // Store user in SecureStore
        await SecureStore.setItemAsync(
          "user",
          JSON.stringify(response.data.user)
        );

        setUser(response.data.user);
        // Use 'replace' instead of 'navigate' if you want to replace the current screen
        navigation.replace("Home");
      } catch (error) {
        console.error("Google Sign-In Error:", error);
        Alert.alert("Sign-In Failed", "Please try again.");
        signOutFromGoogle();
      } finally {
        setIsInProgress(false);
      }
      return;
    }

    try {
      const userInfo = await signUpWithGoogle();
      if (userInfo.type === "success") {
        const user = {
          idToken: userInfo.data?.idToken,
          email: userInfo.data?.user.email,
        };

        const response = await axios.get(`${API_BASE_URL}/api/users/login`, {
          params: {
            email: user.email,
            idToken: user.idToken,
          },
        });

        if (response.data.status === false) {
          Alert.alert(response.data.message);
          signOutFromGoogle();
          setIsInProgress(false);
          return;
        } else {
          // Store user in SecureStore
          await SecureStore.setItemAsync(
            "user",
            JSON.stringify(response.data.user)
          );

          if (response.status === 201) {
            Alert.alert(
              "Sign-In Successful",
              `Welcome ${userInfo.data?.user.name}!`
            );
            setUser(response.data.user);
            navigation.navigate("Home");
          }
        }
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Sign-In Failed", "Please try again.");
      signOutFromGoogle();
    } finally {
      setIsInProgress(false);
    }
  };

  // Email/Password Login handler
  const handleLogin = async () => {
    setIsInProgress(true);
    if (!validateEmail(email) || !validatePass(password)) {
      Alert.alert("Invalid email or password");
      setPassword("");
      setIsInProgress(false);
      return;
    }

    try {
      const user = { email, password };
      const response = await axios.get(
        `${API_BASE_URL}/api/users/loginbyemail`,
        {
          params: {
            email: user.email,
            password: user.password,
          },
        }
      );

      if (response.data.status === false) {
        Alert.alert("Invalid email or password");
        setPassword("");
        return;
      } else {
        // Store user in SecureStore
        await SecureStore.setItemAsync(
          "user",
          JSON.stringify(response.data.user)
        );

        Alert.alert("Login Successful");
        navigation.navigate("Home");
        setUser(response.data.user);
      }
    } catch (error) {
      Alert.alert(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      setIsInProgress(false);
    }
  };

  // Logout function (to be used in Home or Profile screen)
  const handleLogout = async () => {
    try {
      // Remove user from SecureStore
      await SecureStore.deleteItemAsync("user");

      // Sign out from Google if needed
      await signOutFromGoogle();

      // Clear user in global state
      clearUser();

      // Navigate back to Login
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Restaurant owner registration handler
  const handleRestaurantOwnerRegistration = () => {
    Linking.openURL("https://webby-puce.vercel.app/");
  };

  return (
    <View style={tw`flex-1 justify-center p-4 items-center`}>
      <Image
        source={require("../../../assets/images/auth_icon.png")}
        style={tw`w-full h-40 mb-8`}
        resizeMode="contain"
      />
      <Text style={tw`text-3xl mb-8 text-center font-bold`}>LOGIN</Text>
      <Input
        keyboardType="email-address"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={tw`mb-4 ml-6 mr-6`}
        textStyle={tw`p-2`}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={tw`mb-4 ml-6 mr-6`}
        textStyle={tw`p-2`}
      />
      <View style={tw`w-full`}>
        <Button
          onPress={handleLogin}
          style={[tw`mb-4 ml-6 mr-6`, { backgroundColor: colors.primary }]}
          disabled={isInProgress}
        >
          Login
        </Button>
      </View>
      {/* <CustomGoogleSigninButton
        colors={colors}
        handleGoogleSignIn={handleGoogleSignIn}
        isInProgress={isInProgress}
      /> */}
      <TouchableOpacity
        style={[
          styles.buttonContainer,
          { borderColor: colors.primary },
          isInProgress && styles.disabled,
        ]}
        onPress={handleGoogleSignIn}
        disabled={isInProgress}
        activeOpacity={0.7}
      >
        <View style={styles.contentContainer}>
          <Image
            source={require("../../../assets/images/google_icon.png")}
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </View>
      </TouchableOpacity>
      <Button
        appearance="ghost"
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register
      </Button>

      {/* New Restaurant Owner Registration Button
      <Button
        onPress={handleRestaurantOwnerRegistration}
        style={[
          tw`mb-4 ml-6 mr-6 mt-2`, 
          { 
            backgroundColor: colors.secondary || '#FF9800',
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }
        ]}
      >
        Register as Restaurant Owner
      </Button> */}
      {/* <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 8,
          padding: 2,
          marginVertical: 10,
        }}
      >
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleGoogleSignIn}
          disabled={isInProgress}
        />
      </View> */}
    </View>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: "white",
    marginVertical: 10,
    width: "87%",
    // marginHorizontal:160,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  disabled: {
    opacity: 0.7,
  },
});
export default LoginScreen;
