import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import supabaseClient from "../../lib/supabase";
import { fetchWatchlist } from "../../lib/apiHandler";
import WatchlistItem from "../../components/WatchlistItem";

const MyList = () => {
  const [user, setUser] = useState<any>(null);
  const [watchlist, setWatchList] = useState<WatchListData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        alert(error.message);
        return;
      }
      if (data.session) {
        setUser({
          ...data.session.user,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const data = await fetchWatchlist(user.access_token);
      setWatchList(data);
      setLoading(false);
      setRefresh(false);
    })();
  }, [user, refresh]);

  return (
    <SafeAreaView className="min-h-screen min-w-screen bg-gray-100 dark:bg-gray-950">
      <View className="h-full w-full p-5 flex flex-col space-y-10">
        <Text className="text-gray-800 dark:text-gray-100 text-2xl font-bold">
          My List
        </Text>

        {loading && (
          <View className="h-full items-center justify-center flex flex-col">
            <ActivityIndicator
              size="large"
              className="text-gray-800 dark:text-gray-200"
            />
          </View>
        )}

        {!loading && watchlist.length > 0 ? (
          <FlatList
            data={watchlist}
            renderItem={({ item }) => (
              <WatchlistItem item={item} access_token={user?.access_token} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={() => {
                  setLoading(true);
                  setRefresh(true);
                }}
              />
            }
            keyExtractor={(item) => item.link}
          />
        ) : (
          <View className="flex h-full flex-col space-y-2 items-center justify-center">
            <Text className="text-center text-lg text-gray-600 dark:text-gray-400 font-semibold">
              Your watchlist is empty :(
            </Text>
            <Text className="text-center text-gray-600 dark:text-gray-400">Explore and add Dramas / Movies to your watchlist</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyList;
