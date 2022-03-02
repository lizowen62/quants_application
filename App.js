import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from "react-native";
import CryptoItem from "./components/CryptoItem";
import Graph from "./components/Graph";
import SearchCustom from "./components/SearchBar";

const App = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [select, setSelect] = useState("");
  const [symbol, setSymbol] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  function updateSearch(value) {
    let result = data.filter((item) =>
      item.name.toUpperCase().includes(value.toUpperCase())
    );
    setFilter(result);
  }

  const selectCrypto = (key) => {
    setSelect(key.quote.USD.price.toFixed(2));
    setSymbol(key.symbol);
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
    setFilter(data.data);
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <CryptoItem
      item={item}
      symbol={symbol}
      callback={selectCrypto}
    ></CryptoItem>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cryptoList}>
        <SearchCustom callback={updateSearch} />
        {loading == false ? (
          <FlatList
            initialNumToRender={10}
            data={filter}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Text>loading data from coinmarket </Text>
        )}
      </View>
      <View style={styles.graph}>
        <Graph item={symbol} quote={select}></Graph>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  graph: {
    justifyContent: "center",
    alignItems: "center",
  },
  cryptoList: {
    paddingTop: 15,
    borderRadius: 7,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#A5A5A5",
    overflow: "scroll",
    margin: 8,
    maxHeight: 240,
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
