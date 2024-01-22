from utils import DataRecommender, getSupabaseClient
from supabase import Client
from models import WatchlistDBDataModel

class RecommenderController:
    recommender: DataRecommender
    dbClient: Client

    def __init__(self):
        self.recommender = DataRecommender()
        self.dbClient = getSupabaseClient()

    def generate_recommendations(self, title, genre, language, show_type, num=10):
        result = self.recommender.get_recommendations(title, genre, language, show_type, num)
        if result is None:
            return {"status": "error", "code": 404, "message": "Not Found", "data": []}, 404
        return {"status": "ok", "code": 200, "data": result, "message": ""}, 200

    def get_drama_info(self, link):
        result = self.recommender.get_drama_info(link)
        return {"status": "ok", "code": 200, "data": result}, 200

    def search(self, name_q, language, s_type):
        if name_q is not None:
            data = self.recommender.df[(self.recommender.df['lang'] == language) & (self.recommender.df['type'] == s_type) & (self.recommender.df['title'].str.contains(name_q))][['title', 'link', 'image']].to_dict(orient='records')
        else:
            data = self.recommender.df[(self.recommender.df['lang'] == language) & (self.recommender.df['type'] == s_type)][['title', 'link', 'image']].to_dict(orient='records')
        if len(data) == 0:
            return {"status": "error", "code": 404, "message": "Not Found", "data": []}, 404
        return {"status": "ok", "code": 200, 'language': language, "count": len(data), "type": s_type, "data": data}, 200
    
    def get_watch_list(self, user):
        """
        list_id: str PKEY
        user_id: str FKEY
        watch_list: list[(link(str), state(COMPLETE, WATCHING, PLANNED), recommended_by(None | link(str)))]
        """
        # Check if the row exists in the database
        
        row = self.dbClient.table('watchlist').select('*', count='exact').eq('user_id', user.id).execute()
        if row.count == 0:
            return {"status": "error", "code": 404, "message": "Not Found", "data": None}, 404
        else:
            return {"status": "ok", "code": 200, "data": row.data[0]}, 200
    
    def add_to_watch_list(self, user, link, state, name, image, recommended_by=None):
        row = self.dbClient.table('watchlist').select('*', count='exact').eq('user_id', user.id).execute()
        if row.count == 0:
            row = self.dbClient.table('watchlist').insert({
                'user_id': user.id,
                'watch_list': [WatchlistDBDataModel(link, state, name, image, recommended_by).toJSON()]
            }).execute()
        else:
            existingWatchList: list = row.data[0]['watch_list']
            existingWatchList.append(WatchlistDBDataModel(link, state, name, image, recommended_by).toJSON())
            row = self.dbClient.table('watchlist').update({
                'watch_list': existingWatchList
            }).eq('user_id', user.id).execute()
        return {"status": "ok", "code": 200, "data": row.data}, 200
    
    def remove_from_watch_list(self, user, link):
        row = self.dbClient.table('watchlist').select('*', count='exact').eq('user_id', user.id).execute()
        if row.count == 0:
            return {"status": "error", "code": 404, "message": "Not Found", "data": []}, 404
        else:
            existingWatchList = row.data[0]['watch_list']
            existingWatchList = list(filter(lambda x: x['link'] != link, existingWatchList))
            row = self.dbClient.table('watchlist').update({
                'watch_list': existingWatchList
            }).eq('user_id', user.id).execute()
            return {"status": "ok", "code": 200, "data": row.data}, 200
