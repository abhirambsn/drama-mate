import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from pathlib import Path
from PyMDL.Infopage import info
from utils.config import ConfigManager
from utils import createLogger, info_log, error_log

config = ConfigManager()
BASE_PATH = config.BASE_PATH

logger = createLogger('recommender')

class DataRecommender:
    df: pd.DataFrame
    datapath: Path
    
    def __init__(self):
        self.datapath = BASE_PATH / "data" / "final_processed_full_with_image.csv"
        self.df = pd.read_csv(self.datapath, encoding='utf-16')

    def get_recommendations(self, title, genre: list, lang, type="drama", num: int = 20):
        try:
            data = self.df[(self.df['type'] == type) & (self.df['lang'] == lang)]
            # Filter by genre
            if data.shape[0] == 0:
                return []
            data.reset_index(level=0, inplace=True)

            indices = pd.Series(data.index, index=data['title']).drop_duplicates()
            count = CountVectorizer(stop_words='english')
            count_matrix = count.fit_transform(data['text'])
            idx = indices[title]
            cosine_sim = cosine_similarity(count_matrix, count_matrix)
            scores = list(enumerate(cosine_sim[idx]))
            scores = sorted(scores, key = lambda x: x[1], reverse=True)
            scores = scores[1:num+1]

            movies = [i[0] for i in scores]
            info_log(logger, f"Retrieved Recommendations for {title} ({lang})")
            res =  data[['title', 'link', 'genre', 'image']].iloc[movies]
            return res.to_dict('records')
        except Exception as e:
            error_log(logger, f"Error in get_recommendations: {e}")
            return None
    
    def get_drama_info(self, link: str):
        url: str = None
        if link.startswith('https://'):
            url = link
        else:
            url = f"https://mydramalist.com{link}"
        data = info(url)
        result = {
            'name': data.title,
            'thumbnail': data.thumbnail,
            'native_title': data.native,
            'genre': data.genre,
            'score': data.ratings,
            'aka': data.aka,
            'date': data.date,
            'synopsis' : data.synopsis,
            'type': data.type,
            'cast': data.casts,
            'country': data.country,
            'duration': data.duration,
        }
        return result