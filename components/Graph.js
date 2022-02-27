import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View,  Text, TouchableOpacity } from "react-native";
import {
    VictoryBar,
    VictoryCandlestick,
    VictoryAxis,
    VictoryChart,
    VictoryLine,
    VictoryTheme,
  } from "victory-native";

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

export default function Graph ({ item }) {

    const [ count, setCount] = useState(0)
    const [ change, setChange] = useState(false)
    const [ stream , setStream] = useState("")

    let i = 0

    const msg = {
      method: 'SUBSCRIBE',
      params: [`btcusdt@kline_1m`],
      id: 1,
    };

    const [isPaused, setPause] = useState(false);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("wss://stream.binance.com:9443/ws")
        ws.current.onopen = () => {
          console.log("open")
          ws.current.send(JSON.stringify(msg));
        } // sub to rand 

        ws.current.onclose = () => console.log("ws closed");

        const wsCurrent = ws.current;

        return () => {
            wsCurrent.close();
        };
    }, []);

    useEffect(() => {

      const msg = {
        method: 'SUBSCRIBE',
        params: [`btcusdt@kline_1m`],
        id: 1,
      };

      const msg2 = {
          method: 'UNSUBSCRIBE',
          params: [`btcusdt@kline_1m`],
          id: 12,
      }
      
      const msg3 = {
        method: 'SUBSCRIBE',
        params: [`ethusdt@kline_1m`],
        id: 4,
      };

      let i = 0

      let update = false;

        if ( item.toString().length != 0)
        {
          update = true
        }

        if (!ws.current) return;

        ws.current.onmessage = e => {
            const message = JSON.parse(e.data);
            console.log(i)
            if ( i < 2 ) {
               console.log("sub", message);
            } else if ( update == true )  {
              console.log("sub new")
              ws.current.send(JSON.stringify(msg2));
              ws.current.send(JSON.stringify(msg3));
              update = false
            }
            else if ( i >= 2 ) {
              console.log("presub", message);
            }
            i++
        };
    }, [item]);



    const websock = ( stream ) => {

        const msg = {
          method: 'SUBSCRIBE',
          params: [`${stream}@kline_1m`],
          id: 1,
        };

        const unsub = {
            method: 'UNSUBSCRIBE',
            params: [`${stream}@kline_1m`],
            id: 1,
        };
        
        ws.onopen = () => {
          ws.send(JSON.stringify(msg));
        };

        setInterval(() => {
          ws.onmessage = e => {
            console.log(e)
            if (i > 6 ) ws.send(JSON.stringify(unsub));
            i++
        };
        }, 1000);
            
    }

  return (
      <View style={styles.graph}>
        <VictoryChart
          width={350}
          theme={VictoryTheme.material}
          domainPadding={{ x: 40 }}
          scale={{ x: "time" }}
        >
          <VictoryAxis tickFormat={(t) => `${t.getDate()}/${t.getMonth()}`} />
          <VictoryAxis dependentAxis />
          <VictoryCandlestick
            candleColors={{ positive: "#5f5c5b", negative: "#c43a31" }}
            data={sampleDataDates}
          />
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
