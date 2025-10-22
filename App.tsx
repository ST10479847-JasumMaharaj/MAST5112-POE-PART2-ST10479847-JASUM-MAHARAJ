import React, { useState } from "react";

import {

  StyleSheet,

  Text,

  View,

  FlatList,

  TextInput,

  TouchableOpacity,

  SafeAreaView,

  Image,

  Alert,

  Keyboard,

  ScrollView,

  TouchableWithoutFeedback,

  KeyboardAvoidingView,

  Platform,

} from "react-native";

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";

import { Picker } from "@react-native-picker/picker";

import { RootStackParamList, RestaurantItem } from "./type";


const predefinedItems: RestaurantItem[] = [

  {

    itemName: "Tomato soup",

    description: "A creamy tomato soup with italian seasoning topped with freshly grated Parmigiano-Reggiano.",

    category: "Starter",

    price: 50,

  },

  {

    itemName: "Thai green curry",

    description: "This deliciously fragrant Thai green curry packs a flavourful punch.",

    category: "Mains",

    price: 110,

   
  },

  {

    itemName: "Peppermint Crisp Tart ",

    description: "Classic South-African dessert layered with a caramel and whipped cream filling and peppermint crisp chocolate.",

    category: "Dessert",

    price: 60,


  },

];


function ManageMenuScreen(props: NativeStackScreenProps<RootStackParamList, "ManageScreen">) {

  const [itemName, setItemName] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState<string>("Beverage");

  const [price, setPrice] = useState("");

  const [ingredients, setIngredients] = useState("");


  const handleSubmit = () => {

    if (itemName && description && category && price) {

      const priceValue = parseFloat(price);

      if (priceValue > 0) {

        const newItem: RestaurantItem = {

          itemName,

          description,

          category,

          price: priceValue,

        };

        props.route.params.setItems([...props.route.params.items, newItem]);

        props.navigation.goBack();

      } else {

        Alert.alert("Invalid Price - must be greater than 0");

      }

    } else {

      Alert.alert("Missing Fields", "Please fill all fields before saving.");

    }

  };


  return (

    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <ScrollView contentContainerStyle={styles.formContainer}>

          <Text style={styles.formHeader}>Add a New Menu Item</Text>


          <TextInput style={styles.input} placeholder="Item Name" value={itemName} onChangeText={setItemName} />

          <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />


          {/* ✅ Perfectly aligned picker */}

          <View style={styles.pickerWrapper}>

            <Text style={styles.label}>Category</Text>

            <View style={styles.pickerContainer}>

              <Picker
              
                selectedValue={category}

                onValueChange={(value) => setCategory(value)}

                mode="dropdown"

                dropdownIconColor="#4b2e2b"

                style={styles.pickerStyle}

                itemStyle={{ height: 45 }}

              >

                <Picker.Item label="Select a Category" value="" color="#999" />

                <Picker.Item label="Starters" value="Starters" />

                <Picker.Item label="Mains" value="Mains" />

                <Picker.Item label="Dessert" value="Dessert" />

              </Picker>

            </View>

          </View>


          <TextInput

            style={styles.input}

            placeholder="Price (e.g. 40)"

            keyboardType="numeric"

            value={price}

            onChangeText={setPrice}

          />




          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>

            <Text style={styles.saveButtonText}>Save Menu Item</Text>

          </TouchableOpacity>


          <TouchableOpacity style={styles.cancelButton} onPress={() => props.navigation.goBack()}>

            <Text style={styles.cancelButtonText}>Back</Text>

          </TouchableOpacity>

        </ScrollView>

      </TouchableWithoutFeedback>

    </KeyboardAvoidingView>

  );

}


function HomeScreen(props: NativeStackScreenProps<RootStackParamList, "HomeScreen">) {

  const [items, setItems] = useState<RestaurantItem[]>(predefinedItems);


  const removeItem = (index: number) => {

    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [

      { text: "Cancel", style: "cancel" },

      { text: "Yes", onPress: () => setItems(items.filter((_, i) => i !== index)) },

    ]);

  };


  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.mainTitle}>Silver Spoon by Christoffel</Text>

      <Text style={styles.subtitle}>For the love of delicious food</Text>

      <Text style={styles.totalText}>Total menu items: {items.length}</Text>

      <FlatList

        data={items}

        keyExtractor={(_, i) => i.toString()}

        renderItem={({ item, index }) => (

          <View style={styles.card}>

            <View style={styles.cardContent}>

              <Text style={styles.cardTitle}>{item.itemName}</Text>

              <Text style={styles.cardDesc}>{item.description}</Text>

              <Text style={styles.cardMeta}>

                {item.category} • R{item.price} 

              </Text>

              <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(index)}>

                <Text style={styles.removeText}>Remove</Text>

              </TouchableOpacity>

            </View>

          </View>

        )}

      />


      <TouchableOpacity

        style={styles.addButton}

        onPress={() => props.navigation.navigate("ManageScreen", { items, setItems })}

      >

        <Text style={styles.addText}>＋ Add New Item</Text>

      </TouchableOpacity>

    </SafeAreaView>

  );

}


function WelcomeScreen({ navigation }: { navigation: any }) {

  return (

    <SafeAreaView style={styles.welcomeContainer}>

      <Image

        source={{ uri: "https://i.pinimg.com/736x/7f/90/65/7f90654ba899eff1d0813c386037980d.jpg" }}

        style={styles.heroImage}

      />

      <View style={styles.overlay}>

        <Text style={styles.welcomeTitle}>Welcome to Silver Spoon by Christoffel</Text>

        <Text style={styles.welcomeText}>Your luxury 5-star restaurant experience — right on your screen.</Text>

        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate("HomeScreen")}>

          <Text style={styles.startText}>Explore our Menu</Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>

  );

}


export default function App() {

  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (

    <NavigationContainer>

      <Stack.Navigator>

        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />

        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />

        <Stack.Screen

          name="ManageScreen"

          component={ManageMenuScreen}

          options={{

            title: "Add Menu Item",

            headerStyle: { backgroundColor: "#81a9ffff" },

            headerTintColor: "#fff",

          }}

        />

      </Stack.Navigator>

    </NavigationContainer>

  );

}


const styles = StyleSheet.create({

  welcomeContainer: { flex: 1, backgroundColor: "#fffd8eff" },

  heroImage: { width: "100%", height: "100%", position: "absolute" },

  overlay: {

    flex: 1,

    backgroundColor: "rgba(0,0,0,0.45)",

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 30,

  },

  welcomeTitle: { color: "#fff", fontSize: 34, fontWeight: "700", fontStyle: 'italic' ,textAlign: "center", marginBottom: 10 },

  welcomeText: { color: "#fbe9e7", fontSize: 16, textAlign: "center", marginBottom: 30 },

  startButton: { backgroundColor: "#d7ccc8", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30 },

  startText: { color: "#070606ff", fontWeight: "bold", fontSize: 18 },


  container: { flex: 1, backgroundColor: "#d6f8e0ff", padding: 15 },

  mainTitle: { fontSize: 28, fontWeight: "800",fontStyle: 'italic', color: "#4b2e2b", textAlign: "center" },

  subtitle: { textAlign: "center", color: "#8d6759ff", marginBottom: 15, fontSize: 15 },

  totalText: {
  fontWeight: "bold",
  fontSize: 16,
  marginVertical: 10,
  color: "#333",
 },
  card: {

    backgroundColor: "#f0eed9ff",

    borderRadius: 18,

    marginVertical: 10,

    overflow: "hidden",

    shadowColor: "#000",

    shadowOpacity: 0.15,

    shadowRadius: 5,

    elevation: 5,

  },


  cardContent: { padding: 15 },

  cardTitle: { fontSize: 20, fontWeight: "700", color: "#4d2622ff" },

  cardDesc: { color: "#3f2c26ff", fontSize: 14, marginVertical: 5 },

  cardMeta: { color: "#463028ff", fontSize: 13 },

  removeButton: {

    backgroundColor: "#c6282865",

    padding: 10,

    borderRadius: 8,

    alignItems: "center",

    marginTop: 10,

  },

  removeText: { color: "#fff", fontWeight: "bold" },

  addButton: {

    backgroundColor: "#090241ff",

    borderRadius: 30,

    paddingVertical: 16,

    alignItems: "center",

    marginTop: 10,

    marginBottom: 20,

    elevation: 4,

  },

  addText: { color: "#fff8e1", fontSize: 18, fontWeight: "bold" },


  formContainer: { backgroundColor: "#f5f5f5", padding: 20 },

  formHeader: { fontSize: 24, color: "#4b2e2b", fontWeight: "bold", textAlign: "center", marginBottom: 20 },

  input: {

    backgroundColor: "#cef4fdff",

    borderRadius: 10,

    borderColor: "#8d6e63",

    borderWidth: 1,

    paddingHorizontal: 12,

    height: 50,

    justifyContent: "center",

    marginVertical: 8,

  },


  // PICKER STYLES

  pickerWrapper: { marginVertical: 10 },

  label: { fontSize: 15, fontWeight: "600", color: "#000000ff", marginBottom: 6, marginLeft: 4 },

  pickerContainer: {

    borderWidth: 1,

    borderColor: "#000d49ff",

    borderRadius: 10,

    backgroundColor: "#cef4fdff",

    height: 50,

    justifyContent: "center",

    overflow: "hidden",

  },

  pickerStyle: {

    height: 50,

    width: "100%",

    backgroundColor: "#cef4fdff",

    fontSize: 15,

    paddingHorizontal: 10,

    marginTop: Platform.OS === "ios" ? -6 : -2,

  },


  saveButton: { backgroundColor: "#090241ff", padding: 15, borderRadius: 10, marginTop: 15, alignItems: "center" },

  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  cancelButton: { backgroundColor: "#14048bab" , alignItems: "center", padding: 15, borderRadius: 10, marginTop: 15 },

  cancelButtonText: { color: "#ffffffff", fontWeight: "bold" },

});