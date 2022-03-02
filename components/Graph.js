import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryZoomContainer,
} from "victory-native";

let old = "btcusdt";

export default function Graph({ item, quote }) {
  const [count, setCount] = useState(0);
  const [real, setReal] = useState(0);
  const [datas, setDatas] = useState([{ x: 0, y: 0 }]);

  const msg = {
    method: "SUBSCRIBE",
    params: [`btcusdt@trade`],
    id: 1,
  }; // subscribe by default

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://stream.binance.com:9443/ws");
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify(msg));
    };

    ws.current.onclose = () => console.log("websocket closed");

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    let update = false;
    let unsub = false;

    if (item.toString().length != 0) {
      update = true;
    }

    if (!ws.current) return;

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (update == true) {
        if (old) {
          let msg = {
            method: "UNSUBSCRIBE",
            params: [`${old}@trade`],
            id: count,
          };
          ws.current.send(JSON.stringify(msg));
          unsub = true;
        }
        if (item && unsub == true) {
          let usd = item.toString().toLowerCase() + "usdt";
          let msg = {
            method: "SUBSCRIBE",
            params: [`${usd}@trade`],
            id: count + 100,
          };
          ws.current.send(JSON.stringify(msg));
          setDatas([]);
        }
        update = false;
        unsub = false;
      } else {
        if (message.s == item.toString().toUpperCase() + "USDT") {
          let date = (new Date().getTime() / 1000).toString().substr(-4);
          if (parseFloat(date) > 0.1) {
            let newValue = {
              x: new Date().getTime() / 1000,
              y: parseFloat(message.p),
            };
            setDatas((prevArray) => [...prevArray, newValue]);
            setReal(message.p);
          }
        }
      }
      if (item.toString().toLowerCase().length != 0) {
        old = item.toString().toLowerCase() + "usdt";
      }
      setCount(count + 1);
    };
  }, [item, quote]);

  return (
    <View style={styles.graph}>
      {datas.length > 1 ? (
        <VictoryChart
          width={350}
          theme={VictoryTheme.material}
          containerComponent={<VictoryZoomContainer />}
        >
          <VictoryAxis dependentAxis />
          <VictoryLine
            animate
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={datas}
          />
        </VictoryChart>
      ) : (
        <Text>Loading from binance websocket</Text>
      )}
      {item.toString().length != 0 ? (
        <Text>
          Cours Actuel du {item} : {real} ${" "}
        </Text>
      ) : (
        <Text></Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  graph: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
