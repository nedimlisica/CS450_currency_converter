import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";
import { CurrencyPicker } from "~/components/CurrencyPicker";
import { Currency } from "~/components/Currency";
import latest from "~/api/latest.json";
import symbols from "~/api/symbols.json";
import Swipeable from "react-native-gesture-handler/Swipeable";

type ICurrency = {
  symbol: string;
  rate: number;
  desc: string;
};


let currencies = new Array<ICurrency>();

Object.entries(latest.rates).forEach((rate, index) => {
  const c: ICurrency = {
    symbol: rate[0],
    rate: rate[1],
    desc: Object.values(symbols.symbols)[index],
  };
  currencies.push(c);
});

export default function ConverterScreen({ route, navigation }) {

  const [isLoading, setLoading] = useState(true);
  const [cur, setCur] = useState([]);

  useEffect(() => {
    fetch('http://sls-wus2-dev-cs450-currency-converter.azurewebsites.net/api/rates')
      .then((response) => response.json())
      .then((json) => setCur(json.rates))
      .catch((error) => console.error(error))
      .finally(() => {
        currencies = new Array<ICurrency>();
        Object.entries(cur).forEach((rate, index) => {
          const c: ICurrency = {
            symbol: rate[0],
            rate: rate[1],
            desc: Object.values(symbols.symbols)[index],
          };
          currencies.push(c);
        });
        setLoading(false);
      });


  }, []);

  const [amount, setAmount] = useState<number>(1);

  const [from, setFrom] = useState<ICurrency>(
    currencies.filter((c) => {
      return c.symbol == "BAM";
    })[0]
  );
  useEffect(() => { }, [cur]);
  
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
    const exists = favorites.filter((f) => newFav.symbol == f.symbol);
    if (!exists.length) setFavorites([...favorites, newFav]);
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

        {isLoading ? <ActivityIndicator /> : (
          <Currency
            data={from}
            input={(val: number) => {
              setAmount(val);
            }}
            value={1}
          />
        )}
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
        {isLoading ? <ActivityIndicator /> : (
          <FlatList
            data={favorites}
            extraData={amount}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity onPress={() => {
                  let temp = from;
                  setFrom(item);
                  removeFavorite(item);
                  addFavorite(temp);
                }}>
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
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.symbol}
          />)}
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
