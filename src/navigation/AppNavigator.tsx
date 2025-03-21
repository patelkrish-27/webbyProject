import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import RegisterRestaurantScreen from "../screens/restaurant/RegisterRestaurantScreen";
import Search from "../screens/Search/Search";
import Profile from "../screens/Profile/Profile";
import Product from "../screens/Product/Product";
import HomeScreen from "../screens/restaurant/HomeScreen";
import FooterButton from "../screens/restaurant/RestaurantHomePageComponents/FooterButton";
import SearchedRestro from "../screens/restaurant/RestaurantHomePage";
import RestaurantBooking from "../screens/restaurant/RestaurantBooking";
import CategoryScreen from "../screens/restaurant/CategoryScreen";
import MenuScreen from "../screens/restaurant/MenuScreen";
import Demo from "../screens/Demo";
import BookingsScreen from "../screens/restaurant/BookingScreen";
import UserDetailsScreen from "../screens/auth/UserDetailsScreen";
import FavoriteRestaurantsScreen from "../screens/restaurant/FavouriteRestaurantScreen";
import BookedRestaurantsScreen from "../screens/restaurant/BookedRestaurantsScreen";
import AboutScreen from "../screens/restaurant/AboutScreen";
import HelpScreen from "../screens/restaurant/HelpScreen";
import Settings from "../screens/restaurant/Settings";
import EditProfileScreen from "../screens/restaurant/EditProfileScreen";
import SplashScreen from "../screens/SplashScreen";
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserDetails"
        component={UserDetailsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MenuItems"
        component={MenuScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }} // Prevents going back to login
      />
      <Stack.Screen
        name="RegisterRestaurant"
        component={RegisterRestaurantScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Product"
        component={Product}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FooterButton"
        component={FooterButton}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RestaurantHomePage"
        component={SearchedRestro}
        options={{ headerShown: false, title: "Restaurant" }}
      />
      <Stack.Screen
        name="RestaurantBooking"
        component={RestaurantBooking}
        options={{ headerShown: false, title: "Restaurant Booking" }}
      />
      <Stack.Screen
        name="categories"
        component={CategoryScreen}
        options={{ headerShown: true, title: "Categories" }}
      />
      <Stack.Screen
        name="bookings"
        component={BookingsScreen}
        options={{ headerShown: false, title: "Restaurant Booking" }}
      />
      <Stack.Screen
        name="favourite"
        component={FavoriteRestaurantsScreen}
        options={{ headerShown: true, title: "Favourites" }}
      />
      <Stack.Screen
        name="bookedScreen"
        component={BookedRestaurantsScreen}
        options={{ headerShown: true, title: "Your Bookings" }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: true, title: "About" }}
      />
      <Stack.Screen
        name="Help"
        component={HelpScreen}
        options={{ headerShown: true, title: "Help" }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: true, title: "Settings" }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: true, title: "Settings" }}
      />
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false, title: "WELCOME TO WEBBY" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
