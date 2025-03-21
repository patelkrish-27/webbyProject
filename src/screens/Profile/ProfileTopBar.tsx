import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  useColorScheme,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Get the screen width and height
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// Define the user prop type
interface UserProps {
  name: string;
  email: string;
  photoUrl?: string;
  address?: string;
  phoneNumber?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

const ProfileTopBar = ({ user }: any) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme);
  
  useEffect(() => {
    setTheme(systemTheme);
  }, [systemTheme]);
  
  // const isDarkMode = theme === "dark";
  const isDarkMode = false;
  const textColor = isDarkMode ? "#FFF" : "#000";
  const backgroundColor = isDarkMode ? "#333" : "#FFF";
  const redColor = isDarkMode ? "#FF6347" : "red";
  const profilePicBorderColor = isDarkMode ? "#FFF" : "#121212";
  
  // Extract first name for display if needed
  const firstName = user?.name ? user.name.split(' ')[0] : '';
  
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#121212" : "#FFF" },
      ]}>
      <View
        style={[
          styles.bottombar,
          { backgroundColor: isDarkMode ? "#121212" : "#FFF" },
        ]}>
        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={[styles.profileName, { color: textColor }]}>
            {user?.name || "User Name"}
          </Text>
          <Text style={[styles.profileEmail, { color: textColor }]}>
            {user?.email || "user@example.com"}
          </Text>
        </View>
        
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          {user?.photoUrl ? (
            <Image
              source={{ uri: user.photoUrl }}
              style={[styles.profilePic, { borderColor: profilePicBorderColor }]}
            />
          ) : (
            <Image
              source={require("../../../assets/images/profilePic.jpg")}
              style={[styles.profilePic, { borderColor: profilePicBorderColor }]}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: screenWidth * 0.25,
    borderWidth: 1,
  },
  backArrow: {
    position: "absolute",
    left: 20,
    top: screenHeight * 0.01,
  },
  container: {
    // flex: 1,
    // justifyContent: "space-between",
  },
  topbar: {
    width: screenWidth,
    height: screenHeight * 0.05,
    justifyContent: "center",
  },
  bottombar: {
    width: screenWidth,
    height: screenHeight * 0.13,
    marginTop: 5,
    flexDirection: "row", // Align text and image side by side
    justifyContent: "space-between", // Space between text and image
    alignItems: "center", // Vertically center items
    paddingHorizontal: 20, // Add some horizontal padding to avoid items touching edges
    marginBottom: 15,
  },
  textSection: {
    flex: 1, // Take up available space for text
    justifyContent: "center", // Center text vertically
  },
  imageSection: {
    justifyContent: "center", // Center the image vertically
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
    textAlign: "left",
    fontFamily: "Arial",
    letterSpacing: 1,
    textTransform: "uppercase",
    lineHeight: 30,
    marginLeft: 10,
  },
  profileEmail: {
    fontSize: 16,
    textAlign: "left",
    fontFamily: "Arial",
    letterSpacing: 1,
    textTransform: "lowercase",
    lineHeight: 20,
    marginBottom: 8,
    marginLeft: 10,
  },
  profileViewActivity: {
    color: "#ff5050",
    opacity: 0.7,
    fontSize: 16,
    textAlign: "left",
    fontFamily: "Arial",
    letterSpacing: 1,
    textTransform: "lowercase",
    lineHeight: 20,
    marginBottom: 5,
    fontWeight: "bold",
    marginLeft: 10,
  },
  arrowIcon: {
    marginLeft: 5,
  },
});

export default ProfileTopBar;