import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { Flag } from "react-native-svg-flagkit";
import { Input } from "react-native-elements";
import Intl from "intl";
import "intl/locale-data/jsonp/en";

interface Currency {
  symbol: string;
  rate: number;
  desc: string;
}

interface Props {
  data: Currency;
  value?: number;
  input?: Function;
}

export function Currency(props: Props): JSX.Element {
  const flag = props.data.symbol.substring(0, 2);
  const {input} = props;
  const [value, setValue] = useState<string>(() => {
    if (props.value) return props.value.toString();
    else return "";
  });
  
  useEffect(()=>{input ? input(value) : null;},[value, input])

  let info;
  if (props.input) {
    info = (
      <Input
        keyboardType="numeric"
        maxLength={10}
        value={value}
        onChangeText={(input: string):void => {
          setValue(input);
        }}
      />
    );
  } else if(props.value){
    info = <Text>{Intl.NumberFormat().format(props.value)}</Text>;
  } else {
    info = <Text>{value}</Text>;
  }

  return (
    <View
      style={{
        flex: 10,
        flexDirection: "row",
        maxHeight: 60,
        backgroundColor: "#d3f8e2",
      }}
    >
      <View
        style={{
          flex: 2,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Flag id={flag} size={0.3} />
      </View>
      <View style={{ flex: 8, flexDirection: "column" }}>
        <View style={{ flex: 3, flexDirection: "column" }}>
          <View
            style={{
              flex: 2,
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 10, flexDirection: "row" }}>
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: 26 }}>{props.data.symbol}</Text>
              </View>
              <View
                style={{
                  flex: 7,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                {info}
              </View>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ fontSize: 10 }}>{props.data.desc}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
