import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchModal from "./SearchModal";
import API_BASE_URL from "../../../config";
import NavigationBar from "../../components/NavigationBar";
import FilterModal from "../../components/FilterModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Filter options data
const filterOptions = [
  { id: "1", label: "Filter", icon: "options-outline" },
  { id: "2", label: "Sort by", icon: "swap-vertical-outline" },
  // { id: "3", label: "Available Today", icon: "calendar-outline" },
  { id: "4", label: "Pure Veg", icon: "leaf-outline" },
  // { id: "5", label: "Delivery Time", icon: "time-outline" },
  { id: "6", label: "Rating 4.0+", icon: "star-outline" },
];

interface Restaurant {
  _id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: {
    shopNo: string;
    floorNo: string;
    area: string;
    city: string;
  };
  time: {
    open: string;
    close: string;
  };
  cuisine: string;
  image: string[];
  rating: string;
  description: string;
  promoted: boolean;
  pureVeg: boolean;
}

const Search = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F8F8F8",
      paddingTop: insets.top,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      margin: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    searchPlaceholder: {
      color: "#666",
      marginLeft: 12,
      fontSize: 16,
    },
    filterSection: {
      marginBottom: 16,
    },
    filterList: {
      paddingHorizontal: 16,
      gap: 8,
    },
    filterChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: "#E0E0E0",
    },
    filterChipSelected: {
      backgroundColor: "#FF4B3A",
      borderColor: "#FF4B3A",
    },
    filterText: {
      fontSize: 14,
      color: "#666",
      marginLeft: 6,
    },
    filterTextSelected: {
      color: "#FFF",
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      marginHorizontal: 16,
      marginBottom: 16,
      color: "#1A1A1A",
    },
    restaurantList: {
      paddingHorizontal: 16,
      gap: 16,
    },
    restaurantCard: {
      backgroundColor: "#FFF",
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    restaurantImage: {
      width: "100%",
      height: 200,
      backgroundColor: "#F0F0F0",
    },
    restaurantContent: {
      padding: 16,
    },
    restaurantHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    restaurantName: {
      fontSize: 18,
      fontWeight: "600",
      color: "#1A1A1A",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#4CAF50",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    ratingText: {
      color: "#FFF",
      marginLeft: 4,
      fontWeight: "600",
    },
    cuisineText: {
      fontSize: 14,
      color: "#666",
      marginBottom: 4,
    },
    restaurantDesc: {
      fontSize: 14,
      color: "#666",
      lineHeight: 20,
    },
    restaurantFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    timeText: {
      fontSize: 14,
      color: "#666",
      marginLeft: 4,
    },
    promotedTag: {
      backgroundColor: "#FF4B3A",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    promotedText: {
      color: "#FFF",
      fontSize: 12,
      fontWeight: "500",
    },
  });

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Restaurant[]>([]);
  const [randomRestaurants, setRandomRestaurants] = useState<Restaurant[]>([]);
  const [randomExtraRestaurants, setRandomExtraRestaurants] = useState<
    Restaurant[]
  >([]);

  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [apiLink, setApiLink] = useState<string>("");

  // filter modal section
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [filterCount, setFilterCount] = useState<number>(5);
  const [filterSort, setFilterSort] = useState<string>("desc");
  const [isVeg, setIsVeg] = useState<boolean>(false);

  const [minRating, setMinRating] = useState<string | null>(null);

  const handleOpenFilter = () => {
    setFilterModalVisible(true);
  };

  const handleCloseFilter = () => {
    setFilterModalVisible(false);
  };

  const handleFilterButtonPress = (
    minRating: string | null,
    isVeg: boolean
  ) => {
    const linkToUse = `${API_BASE_URL}/api/restaurants/filterRandom?minRating=${
      minRating || ""
    }&isVeg=${isVeg}&count=${filterCount}&sort=${filterSort}`;

    // Log the generated query for filtered random restaurants
    console.log("Generated API Query for Filtered Random:", linkToUse);

    fetch(linkToUse)
      .then((response) => response.json())
      .then((data) => {
        setRandomRestaurants(data.results || []);
        setRandomExtraRestaurants(shuffleArray(data.results));
      })
      .catch((error) => {
        console.error("Error fetching filtered random restaurants:", error);
      });
  };

  const handleApplyFilters = (filters: {
    cuisines: string[];
    ratings: string;
  }) => {
    setSelectedCuisines(filters.cuisines);
    setSelectedRatings(filters.ratings);
    setApiLink(generateApiLink());
    setFilterModalVisible(false);

    handleFilterButtonPress(
      filters.ratings,
      filters.cuisines.includes("Pure Veg")
    );
  };

  const handleClearFilters = () => {
    // Handle clearing filters here
  };

  const scrollY = new Animated.Value(0);

  const generateApiLink = () => {
    const baseUrl = `${API_BASE_URL}/api/restaurants/filtered-search`;

    const params: Record<string, string | string[]> = {
      term: searchText, // Search text from modal
      cuisines: selectedCuisines, // Cuisine filter from FilterModal
      ratings: selectedRatings, // Ratings filter from FilterModal
    };

    const queryString = Object.entries(params)
      .filter(([_, value]) => value.length) // Remove empty values
      .map(([key, value]) =>
        Array.isArray(value) ? `${key}=${value.join(",")}` : `${key}=${value}`
      )
      .join("&");

    return `${baseUrl}?${queryString}`;
  };

  useEffect(() => {
    if (searchText.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const linkToUse = generateApiLink(); // Generate link with current searchText
    console.log("Using API Link for Search:", linkToUse);

    fetch(linkToUse)
      .then((response) => response.json())
      .then((data) => {
        setSuggestions(data.results || []);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  }, [searchText]); // Runs when searchText changes

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/restaurants/random`)
      .then(async (response) => {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (data.results) {
            setRandomRestaurants(data.results);
            setRandomExtraRestaurants(shuffleArray(data.results));
          }
        } catch (error) {
          console.error("JSON Parsing Error:", error);
        }
      })
      .catch((error) => {
        console.error("Error fetching random restaurants:", error);
      });
  }, []);

  const shuffleArray = (array: Restaurant[]): Restaurant[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleSuggestionPress = (item: Restaurant) => {
    navigation.navigate("RestaurantHomePage", { restaurant: item });
  };

  const formatTime = (restaurant: Restaurant): string => {
    return `${restaurant.time.open} - ${restaurant.time.close}`;
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const toggleSortOrder = () => {
    setFilterSort((prevSort) => (prevSort === "desc" ? "asc" : "desc"));
  };

  const renderFilterItem = ({ item }: { item: (typeof filterOptions)[0] }) => {
    // Determine if the button should be highlighted
    const isActive =
      (item.label === "Sort by" && filterSort === "asc") || // Highlight if sort is active
      (item.label === "Available Today" && isVeg) || // Highlight if vegetarian filter is active
      (item.label === "Rating 4.0+" && minRating === "4.0") || // Highlight if minRating is active
      (item.label === "Pure Veg" && isVeg); // Highlight if Pure Veg filter is active

    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          selectedFilters.includes(item.id) && styles.filterChipSelected,
          { backgroundColor: isActive ? "#FF4B3A" : "#FFF" }, // Change background color based on active state
        ]}
        onPress={() => {
          if (item.label === "Sort by") {
            toggleSortOrder(); // Toggle sort order
            handleFilterButtonPress(minRating, isVeg); // Update query with current minRating
          } else if (item.label === "Available Today") {
            const newIsVeg = !isVeg; // Toggle vegetarian filter
            setIsVeg(newIsVeg);
            handleFilterButtonPress(minRating, newIsVeg); // Update query with new vegetarian filter
          } else if (item.label === "Rating 4.0+") {
            // Toggle minRating for the rating button
            const newMinRating = minRating === "4.0" ? null : "4.0";
            setMinRating(newMinRating);
            handleFilterButtonPress(newMinRating, isVeg); // Update query with new minRating
          } else if (item.label === "Pure Veg") {
            const newIsVeg = !isVeg; // Toggle vegetarian filter
            setIsVeg(newIsVeg);
            handleFilterButtonPress(minRating, newIsVeg); // Update query with new vegetarian filter
          } else {
            handleOpenFilter(); // Open filter modal for other filters
          }
        }}
      >
        <Ionicons
          name={item.icon as any}
          size={16}
          color={isActive ? "#FFF" : "#666"} // Change icon color based on active state
        />
        <Text
          style={[
            styles.filterText,
            selectedFilters.includes(item.id) && styles.filterTextSelected,
            { color: isActive ? "#FFF" : "#666" }, // Change text color based on active state
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => handleSuggestionPress(item)}
    >
      <Image source={{ uri: item.image[0] }} style={styles.restaurantImage} />
      <View
        style={[
          styles.restaurantContent,
          { backgroundColor: "rgba(255, 255, 255, 0.8)" },
        ]}
      >
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.cuisineText}>{item.cuisine}</Text>
        <Text style={styles.restaurantDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.restaurantFooter}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.timeText}>{formatTime(item)}</Text>
          </View>
          {item.promoted && (
            <View style={styles.promotedTag}>
              <Text style={styles.promotedText}>Promoted</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FilterModal
        visible={filterModalVisible}
        onClose={handleCloseFilter}
        onApply={handleApplyFilters}
        onClear={() => setApiLink("")}
      />
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="search-outline" size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>
            Search for restaurants & cuisines
          </Text>
        </TouchableOpacity>

        <View style={styles.filterSection}>
          <FlatList
            data={filterOptions}
            renderItem={renderFilterItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          />
        </View>

        <Text style={styles.sectionTitle}>Popular Restaurants</Text>
        <FlatList
          data={randomRestaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          contentContainerStyle={styles.restaurantList}
        />

        <Text style={styles.sectionTitle}>Discover More</Text>
        <FlatList
          data={randomExtraRestaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => `extra-${item._id}`}
          scrollEnabled={false}
          contentContainerStyle={styles.restaurantList}
        />
      </Animated.ScrollView>

      <SearchModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        searchText={searchText}
        setSearchText={setSearchText}
        suggestions={suggestions}
        onSuggestionPress={handleSuggestionPress}
      />

      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

export default Search;
