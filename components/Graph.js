import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Button, View,  Text, TouchableOpacity } from "react-native";
import {
    VictoryBar,
    VictoryCandlestick,
    VictoryAxis,
    VictoryChart,
    VictoryLine,
    VictoryTheme,
  } from "victory-native";
  
  let samples = []

  let old = "btcusdt"

  let sampleDataDates = [
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
    const [ datas, setDatas ] = useState(
      [
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
      ]
    )

    let i = 0

    const msg = {
      method: 'SUBSCRIBE',
      params: [`btcusdt@trade`],
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
      let tmp = ""
      let i = 0
      let update = false;
      let unsub = false;
      const msg = {
        method: 'SUBSCRIBE',
        params: [`btcusdt@kline_1m`],
        id: 1,
      };
      const msg2 = {
          method: 'UNSUBSCRIBE',
          params: [`btcusdt@trade`],
          id: 12,
      }
       const msg3 = {
        method: 'SUBSCRIBE',
        params: [`ethusdt@kline_1m`],
        id: 4,
      };

        if ( item.toString().length != 0)
        {
          update = true
        }

        console.log("old" + old)

        if (!ws.current) return;

        ws.current.onmessage = e => {
            const message = JSON.parse(e.data);
            console.log(tmp)
            if ( update == true )  {
              console.log("on tente d'update" + tmp)

              if ( old ) 
              {
                console.log("desoucrie de" + old)
                let msg4 = {
                  method: 'UNSUBSCRIBE',
                  params: [`${old}@trade`],
                  id: count,
                };
                console.log(JSON.stringify(msg4))
                ws.current.send(JSON.stringify(msg2));
                unsub = true
              }

              if ( item && unsub == true)
              {
                console.log("souscrire")
                let usd = item.toString().toLowerCase() + 'usdt'
                let msg5 = {
                  method: 'SUBSCRIBE',
                  params: [`${usd}@trade`],
                  id: count + 100 ,
                };
                samples = []
                console.log(JSON.stringify(msg5))
                ws.current.send(JSON.stringify(msg5));
              }
              update = false
              unsub = false
            }
            else {
              if ( message.s == item.toString().toUpperCase() + 'USDT')
                  console.log(message.p)
                  // let newValue = { x: new Date(2016, 6, 12), open: 30, close: 10, high: 35, low: 0 }
                  // setDatas(prevArray => [...prevArray, newValue])

            }

            if ( item.toString().toLowerCase().length != 0 )
            {
              old = item.toString().toLowerCase() + 'usdt' 
            }
        };

        setCount(count + 1)
        

    }, [item]);

    function updateSearch() {
      console.log("olol")
      let newValue = { x: new Date(2016, 6, 12), open: 30, close: 10, high: 35, low: 0 }
      setDatas(prevArray => [...prevArray, newValue])
    }

  return (
      <View style={styles.graph}>
        <Button
          onPress={updateSearch}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        <Text>{ stream }</Text>
        <VictoryChart
          width={350}
          theme={VictoryTheme.material}
          domainPadding={{ x: 40 }}
          scale={{ x: "time" }}
        >
          <VictoryAxis tickFormat={(t) => `${t.getDate()}/${t.getMonth()}`} />
          <VictoryAxis dependentAxis />
          <VictoryCandlestick
            animate
            candleColors={{ positive: "#5f5c5b", negative: "#c43a31" }}
            data={datas}
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
