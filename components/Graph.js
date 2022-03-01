import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Button, View, Text, TouchableOpacity } from "react-native";
import {
  VictoryBar,
  VictoryCandlestick,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "victory-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit'

let old = "btcusdt";

export default function Graph({ item }) {
  const [count, setCount] = useState(0);
  const [change, setChange] = useState(false);
  const [stream, setStream] = useState("");
  const [datas, setDatas] = useState([{ x: 1646131796 , y: 0 }]);

  let i = 0;

  const msg = {
    method: "SUBSCRIBE",
    params: [`btcusdt@trade`],
    id: 1,
  };

  const [isPaused, setPause] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://stream.binance.com:9443/ws");
    ws.current.onopen = () => {
      console.log("open");
      ws.current.send(JSON.stringify(msg));
    }; // sub to rand

    ws.current.onclose = () => console.log("ws closed");

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    let tmp = "";
    let i = 0;
    let update = false;
    let unsub = false;
    let up = true;
    const msg2 = {
      method: "UNSUBSCRIBE",
      params: [`btcusdt@trade`],
      id: 12,
    };

    if (item.toString().length != 0) {
      update = true;
    }

    console.log("old" + old);

    if (!ws.current) return;

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      let i = 0
      let last = ""
      let second = new Date().getTime() / 1000
      if (update == true) {
        console.log("on tente d'update" + tmp);
        if (old) {
          console.log("desoucrie de" + old);
          let msg4 = {
            method: "UNSUBSCRIBE",
            params: [`${old}@trade`],
            id: count,
          };
          console.log(JSON.stringify(msg4));
          ws.current.send(JSON.stringify(msg2));
          unsub = true;
        }

        if (item && unsub == true) {
          console.log("souscrire");
          let usd = item.toString().toLowerCase() + "usdt";
          let msg5 = {
            method: "SUBSCRIBE",
            params: [`${usd}@trade`],
            id: count + 100,
          };
          samples = [];
          console.log(JSON.stringify(msg5));
          ws.current.send(JSON.stringify(msg5));
           let newValue = { x: 1646131796, y: 2900 };
          setDatas([newValue]);
        }
        update = false;
        unsub = false;
      } else {
        if (message.s == item.toString().toUpperCase() + "USDT") {
          console.log( i )
          if ( i == 3 )
          {
            let newValue = { x: new Date().getTime() / 1000, y: parseInt(message.p) };
            setDatas((prevArray) => [...prevArray, newValue]);
            i = 0
          }
          i++
        }
        setCount(count + 1);
      }

      if (item.toString().toLowerCase().length != 0) {
        old = item.toString().toLowerCase() + "usdt";
      }
    };
  }, [item]);

  return (
    <View style={styles.graph}>
      {/* <Text>{JSON.stringify(datas)}</Text> */}
      <Text>{stream}</Text>
      <VictoryChart
        width={350}
        theme={VictoryTheme.material}
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
        {/* <VictoryAxis tickFormat={(t) => `${t.getDate()}/${t.getMonth()}`} />
          <VictoryAxis dependentAxis />
          {/* <VictoryCandlestick
            animate
            candleColors={{ positive: "#5f5c5b", negative: "#c43a31" }}
            data={datas}
          /> */}
      </VictoryChart>
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
