import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import supabaseClient from "../../lib/supabase";
import Search from "../../components/Search";
import {
  fetchRecommendations,
  getDramaInfo,
  searchDramas,
} from "../../lib/apiHandler";
import SearchResult from "../../components/SearchResult";
import RecommendationsForm from "../../components/RecommendationsForm";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResultsDramas[]>([]);

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

  const onSearch = async () => {
    if (!user) return;
    const data = await searchDramas(search, user.access_token);
    setSearchResults(data);
  };

  return (
    <SafeAreaView
      className={`min-h-screen min-w-screen bg-gray-100 dark:bg-gray-950`}
    >
      <View className="h-full w-full p-5 flex flex-col space-y-10">
        <Text className="text-gray-800 dark:text-gray-100 text-2xl font-bold">
          Welcome, {user?.user_metadata?.full_name}
        </Text>

        {/* Searchbox for Dramas */}
        <Search onSearch={onSearch} value={search} setValue={setSearch} />

        <ScrollView className="flex flex-col space-y-5">
          {searchResults.length <= 0 && (
            <Text className="text-gray-800 dark:text-gray-100 text-center">
              Search for Shows
            </Text>
          )}

          {searchResults.length >= 0 &&
            searchResults.map((res: SearchResultsDramas, i) => (
              <SearchResult
                key={i}
                title={res.title}
                image={res.image}
                link={res.link}
              />
            ))}
        </ScrollView>
      </View>

      
    </SafeAreaView>
  );
};

export default Dashboard;
