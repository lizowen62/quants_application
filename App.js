import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from "react-native";
import {
  backgroundColor,
  borderColor,
} from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import CryptoItem from "./components/CryptoItem";

import WS from "react-native-websocket";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [crypto, setCrypto] = useState([
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Thirddyuou Itiem",
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const selectCrypto = (key) => {
    setCrypto((prev) => {
      return prev.filter((todo) => todo.title != key);
    });
  };

  const fetchData = async () => {
    const resp = await fetch(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=200&cryptocurrency_type=coins",
      {
        method: "get",
        headers: new Headers({
          Accept: "application/json",
          "X-CMC_PRO_API_KEY": "776f4a5a-85ec-40de-9a6d-f99b9dc94e22",
        }),
      }
    );
    const data = await resp.json();
    setData(data.data);
    setLoading(false);
  };

  const renderItem = ({ item }) => <Item title={item.name} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cryptoList}>
        {data && (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <CryptoItem item={item} callback={selectCrypto}></CryptoItem>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  cryptoList: {
    paddingTop: 10,
    borderRadius: 7,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#A5A5A5",
    overflow: "scroll",
    margin: 8,
    maxHeight: 140,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default App;
