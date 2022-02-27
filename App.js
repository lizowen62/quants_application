import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Button,
  StyleSheet,
  Text,
  StatusBar,
} from "react-native";
import {
  backgroundColor,
  borderColor,
} from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import CryptoItem from "./components/CryptoItem";
import Graph from "./components/Graph";
import SearchCustom from "./components/SearchBar";
import WS from "react-native-websocket";


const sampleDataDates = [
  { x: new Date(2016, 6, 1), open: 5, close: 10, high: 15, low: 0 },
  { x: new Date(2016, 6, 2), open: 10, close: 15, high: 20, low: 5 },
  { x: new Date(2016, 6, 3), open: 15, close: 20, high: 22, low: 10 },
  { x: new Date(2016, 6, 4), open: 20, close: 10, high: 25, low: 7 },
  { x: new Date(2016, 6, 5), open: 20, close: 10, high: 25, low: 7 },
  { x: new Date(2016, 6, 6), open: 20, close: 10, high: 25, low: 7 },
  { x: new Date(2016, 6, 7), open: 20, close: 10, high: 25, low: 7 },
  { x: new Date(2016, 6, 8), open: 20, close: 10, high: 25, low: 7 },
  { x: new Date(2016, 6, 9), open: 20, close: 10, high: 25, low: 7 },
  { x: new Date(2016, 6, 10), open: 20, close: 10, high: 25, low: 7 },
  { x: new Date(2016, 6, 11), open: 20, close: 10, high: 25, low: 7 },
  { x: new Date(2016, 6, 5), open: 10, close: 8, high: 15, low: 5 },
];


const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const App = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [select, setSelect] = useState("");
  const [symbol, setSymbol] = useState("");
  const [sample, setSample] = useState([]);

  useEffect(() => {
    fetchData();
    setSample(sampleDataDates)
  }, []);

  function updateSearch(value) {
    //do your search logic or anything
    console.log(value)
}

  function handleFilter(e) {
    e.preventDefault();
    console.group();
    console.log(e.target.value);
    filter = data.filter( data.name != e.target.value)
    console.groupEnd();
  }

  const selectCrypto = (key, symbol) => {
    setSelect(key);
    setSymbol(symbol)
    setData((prev) => {
      return prev.filter((todo) => todo.name != key);
    });
  };

  const fetchData = async () => {
    const resp = await fetch(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=20&cryptocurrency_type=coins",
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
      <SearchCustom callback={updateSearch}/>
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
      <View style={styles.graph}>
        <Graph item={symbol}></Graph>
      </View>
      {select.length != 0 ? (
        <Text>Cours Actuelgs du {select}</Text>
      ) : (
        <Text></Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  graph: {
    padding: 8,
    paddingLeft: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  cryptoList: {
    marginTop: 10,
    paddingTop: 15,
    borderRadius: 7,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#A5A5A5",
    overflow: "scroll",
    margin: 8,
    maxHeight: 180,
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
