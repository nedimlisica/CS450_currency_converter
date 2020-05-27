import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";
import { Overlay } from "react-native-elements";
import { CurrencyPicker } from "~/components/CurrencyPicker";
import { Currency } from "~/components/Currency";
import latest from "~/fixer.io/latest.json";
import symbols from "~/fixer.io/symbols.json";
import Swipeable from "react-native-gesture-handler/Swipeable";

type ICurrency = {
  symbol: string;
  rate: number;
  desc: string;
};

const currencies = new Array<ICurrency>();
Object.entries(latest.rates).forEach((rate, index) => {
  const c: ICurrency = {
    symbol: rate[0],
    rate: rate[1],
    desc: Object.values(symbols.symbols)[index],
  };
  currencies.push(c);
});

export default function ConverterScreen({ route, navigation }) {
  const [amount, setAmount] = useState<number>(1);

  const [from, setFrom] = useState<ICurrency>(
    currencies.filter((c) => {
      return c.symbol == "BAM";
    })[0]
  );

  const [favorites, setFavorites] = useState<Array<ICurrency>>([
    currencies.filter((c) => {
      return c.symbol == "HRK";
    })[0],
    currencies.filter((c) => {
      return c.symbol == "EUR";
    })[0],
  ]);

  const [visible, setVisible] = useState<boolean>(false);

  function addFavorite(newFav: ICurrency): void {
    setFavorites([...favorites, newFav]);
  }

  function removeFavorite(c: ICurrency): void {
    const newFavorites = favorites.filter((f) => c.symbol != f.symbol);
    setFavorites(newFavorites);
  }

  return (
    <View
      style={{
        flex: 10,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#c5283d",
      }}
    >
      <View style={{ flex: 3 }}>
        <Currency
          data={from}
          input={(val: number) => {
            setAmount(val);
          }}
          value={1}
        />
      </View>

      <View style={{ flex: 7 }}>
        <Overlay
          fullScreen={true}
          isVisible={visible}
          onBackdropPress={() => setVisible(false)}
        >
          <CurrencyPicker
            data={currencies}
            selected={favorites}
            onPress={addFavorite}
          />
        </Overlay>
        <Text>{amount}</Text>
        <FlatList
          data={favorites}
          extraData={amount}
          renderItem={({ item }) => {
            return (
              <Swipeable
                renderRightActions={() => (
                  <View>
                    <Button title="X" onPress={() => removeFavorite(item)} />
                  </View>
                )}
              >
                <Currency
                  data={item}
                  value={(item.rate * amount) / from.rate}
                />
              </Swipeable>
            );
          }}
          keyExtractor={(item) => item.symbol}
        />
        <Button
          title="ADD FAVORITE"
          onPress={() => {
            setVisible(true);
          }}
        />
      </View>
    </View>
  );
}
