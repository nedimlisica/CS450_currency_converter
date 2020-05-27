import React, { useState, useEffect } from "react";
import { FlatList, View, TouchableOpacity } from "react-native";
import { Currency } from "~/components/Currency";
import { SearchBar } from "react-native-elements";

type ICurrency = {
  symbol: string;
  rate: number;
  desc: string;
};

interface Props {
  data: Array<ICurrency>;
  selected: Array<ICurrency>;
  onPress: Function;
}

export function CurrencyPicker(props: Props): JSX.Element {
  const [search, setSearch] = useState("");
  const [shown, setShown] = useState(props.data);

  function filterList(): void {
    const filtered = props.data.filter((c) => {
      return (
        c.desc.toLowerCase().includes(search.toLowerCase()) ||
        c.symbol.toLowerCase().includes(search.toLowerCase())
      );
    });
    setShown(filtered);
  }
  useEffect(filterList, [search]);

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        onChangeText={(search: string): void => setSearch(search)}
        value={search}
      />
      <FlatList
        data={shown}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => props.onPress(item)}>
              <Currency
                data={item}
                {...(props.selected.filter(
                  (favorite) => favorite.symbol == item.symbol
                ).length > 0
                  ? {}
                  : {})}
              />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.symbol}
      />
    </View>
  );
}
