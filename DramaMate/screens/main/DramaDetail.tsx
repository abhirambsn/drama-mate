import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  useColorScheme,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  fetchRecommendations,
  getDramaInfo,
  insertToWatchlist,
} from "../../lib/apiHandler";
import supabaseClient from "../../lib/supabase";
import RecommendationsForm from "../../components/RecommendationsForm";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { StarRatingDisplay } from "react-native-star-rating-widget";

const DramaDetail = () => {
  const route = useRoute();
  const { title, image, link, recommended_by } =
    route.params as DramaDetailRouteParams;
  const colorScheme = useColorScheme();
  const navigation = useNavigation<any>();

  const [language, setLanguage] = useState<string>("japanese");
  const [type, setType] = useState<string>("drama");
  const [num, setNum] = useState<number>(5);
  const [dramaInfo, setDramaInfo] = useState<DramaInfo>();
  const [user, setUser] = useState<any>(null);
  const [recommendationModalVisible, setRecommendationModalVisible] =
    useState<boolean>(false);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
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
    if (!link || !user) return;
    (async () => {
      setDramaInfo(await getDramaInfo(link, user.access_token));
      setLoading(false);
      setRefresh(false);
    })();
  }, [link, user, refresh]);

  const handleFetchRecommendation = async () => {
    const data = await fetchRecommendations(
      title,
      language,
      type,
      num,
      user?.access_token
    );
    if (data.length === 0) {
      Alert.alert(
        "Not Found",
        "No Recommendations found with selected options :(",
        [{ text: "OK", onPress: () => null }]
      );
      return;
    }
    setRecommendations(data);
    setRecommendationModalVisible(true);
  };

  const handleViewDramaDetails = (
    title: string,
    image: string,
    link: string,
    recommended_by: string | null = null
  ) => {
    setRecommendationModalVisible(false);
    navigation.navigate("DramaDetail", {
      title,
      image,
      link,
      recommended_by,
    } as DramaDetailRouteParams);
  };

  const addToWatchlist = async (
    link: string,
    name: string,
    image: string,
    recommended_by: string | null = null
  ) => {
    setLoading(true);
    await insertToWatchlist(
      link,
      "PLANNED",
      name,
      image,
      recommended_by,
      user?.access_token
    );
    Alert.alert("Success", "Added to watchlist!", [
      { text: "OK", onPress: () => null },
    ]);
    setLoading(false);
  };

  return (
    <SafeAreaView className="min-h-screen min-w-screen bg-gray-100 dark:bg-gray-950">
      {loading && (
        <View className="h-full items-center justify-center flex flex-col">
          <ActivityIndicator
            size="large"
            className="text-gray-800 dark:text-gray-200"
          />
        </View>
      )}
      {!loading && (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                setLoading(true);
                setRefresh(true);
              }}
            />
          }
          className="h-full w-full p-5 flex flex-col space-y-10"
        >
          <Text className="text-gray-800 dark:text-gray-100 text-2xl font-bold">
            Details
          </Text>

          <View className="w-full flex flex-col items-center space-y-4">
            <Image
              source={{ uri: image }}
              style={{objectFit: 'contain'}}
              className="w-80 h-40 rounded-lg object-contain"
            />
            <View className="items-center">
              <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                {title}
              </Text>
              <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                ( Native Title: {dramaInfo?.native_title} )
              </Text>
            </View>
            <View className="flex flex-col items-center justify-center space-x-2">
              <StarRatingDisplay
                rating={
                  (Number.parseFloat(dramaInfo?.score as string) / 10) * 5
                }
                maxStars={5}
              />
              {/* <Text className="text-lg text-yellow-400">
                {(Number.parseFloat(dramaInfo?.score as string) / 10) * 5}
              </Text> */}
            </View>

            <View className="space-y-2">
              <Text className="text-gray-800 dark:text-gray-200 text-sm font-bold text-left">
                Genre: {dramaInfo?.genre}
              </Text>
              <Text className="text-gray-800 dark:text-gray-200 text-lg font-bold text-left">
                Synopsis
              </Text>
              <Text className="text-gray-800 text-sm text-justify dark:text-gray-200">
                {dramaInfo?.synopsis}
              </Text>
            </View>
          </View>

          <Text className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Get Recommendations
          </Text>
          <RecommendationsForm
            language={language}
            setLanguage={setLanguage}
            type={type}
            setType={setType}
            num={num}
            setNum={setNum}
          />

          <View className="flex flex-col items-center space-y-2 justify-between">
            <TouchableOpacity
              className="w-full bg-purple-600 flex flex-row items-center justify-center space-x-3 p-3 rounded-xl"
              onPress={handleFetchRecommendation}
              disabled={loading || num === 0}
            >
              <AntDesign name="pluscircleo" size={16} color="white" />
              <Text className="text-gray-50">Fetch Recommendations</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                addToWatchlist(link, title, image, recommended_by);
              }}
              disabled={loading}
              className="w-full bg-teal-600 flex flex-row items-center justify-center space-x-3 p-3 rounded-xl"
            >
              <Entypo name="add-to-list" size={16} color="white" />
              <Text className="text-gray-50">Add to Watchlist</Text>
            </TouchableOpacity>
          </View>
          <View className="h-20"></View>
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        visible={recommendationModalVisible}
        hardwareAccelerated
        onDismiss={() => null}
        onRequestClose={() => {
          setRecommendationModalVisible((v) => !v);
        }}
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="min-h-screen min-w-screen bg-gray-100 dark:bg-gray-950">
          <ScrollView className="mt-10 h-full w-full p-5 flex flex-col space-y-10">
            <Text className="font-bold text-gray-800 dark:text-gray-200 text-2xl">
              Recommendations
            </Text>

            <View className="flex flex-col space-y-4">
              {recommendations.map((rec) => (
                <View
                  key={rec.title}
                  className="flex flex-row space-x-2 items-center justify-between"
                >
                  <TouchableOpacity
                    onPress={() =>
                      handleViewDramaDetails(
                        rec.title,
                        rec.image,
                        rec.link,
                        title
                      )
                    }
                    className="flex flex-row items-center space-x-3"
                  >
                    <Image
                      source={{ uri: rec.image }}
                      style={{objectFit: 'contain'}}
                      className="w-12 h-12 rounded-lg object-contain"
                    />
                    <Text className="text-gray-800 dark:text-gray-200 text-xs">
                      {rec.title.length >= 30
                        ? rec.title.slice(0, 30) + "..."
                        : rec.title}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setLoading(true);
                      addToWatchlist(rec.link, rec.title, rec.image);
                    }}
                  >
                    <AntDesign
                      name="pluscircleo"
                      size={24}
                      color={colorScheme == "dark" ? "white" : "black"}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => {
                setRecommendationModalVisible((v) => !v);
              }}
              className="w-full space-x-3 flex-row rounded-lg p-2 bg-gray-200 dark:bg-gray-900 flex items-center justify-center"
            >
              <AntDesign
                name="close"
                size={18}
                color={colorScheme == "dark" ? "white" : "black"}
              />
              <Text className="text-gray-800 dark:text-gray-200 text-base">
                Close
              </Text>
            </TouchableOpacity>
            <View className="h-20"></View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default DramaDetail;
