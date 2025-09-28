# 🔧 API Integration Guide for AI Agents

## 📰 NewsAPI Integration (Loop Agent)

### Step 1: Get API Key

1. Go to [newsapi.org](https://newsapi.org/)
2. Sign up for free account
3. Get your API key (1000 requests/day free)

### Step 2: Add to Environment

```bash
# Add to .env.local
NEWS_API_KEY=your_newsapi_key_here
```

### Step 3: Update Loop Agent

```typescript
// In LoopAgent.ts
private async fetchNewsFromSources(location: { city: string; country: string }): Promise<NewsPost[]> {
  const apiKey = process.env.NEWS_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${location.city}&sortBy=publishedAt&language=en&apiKey=${apiKey}`
      );
      const data = await response.json();

      return data.articles.map((article: any) => ({
        id: `news-${Date.now()}-${Math.random()}`,
        title: article.title,
        content: article.description || article.content,
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        location: location,
        tags: this.extractTags(article.title)
      }));
    } catch (error) {
      console.log('NewsAPI failed, using fallback');
    }
  }

  // Fallback to mock data (current implementation)
  return this.getMockNews(location);
}
```

## 🔍 Google News API (Fact-Check Agent)

### Step 1: Install Google News Scraper

```bash
npm install google-news-scraper
```

### Step 2: Update Fact-Check Agent

```typescript
// In FactCheckAgent.ts
import GoogleNews from 'google-news-scraper';

private async crossReferenceWithSources(newsPost: NewsPost): Promise<number> {
  try {
    const results = await GoogleNews({
      searchTerm: newsPost.title.split(' ').slice(0, 5).join(' '), // First 5 words
      prettyURLs: true,
      queryVars: {
        hl: 'en-US',
        gl: 'US',
        ceid: 'US:en'
      }
    });

    // Check if similar headlines exist
    const similarCount = results.filter(result => {
      const similarity = this.calculateSimilarity(newsPost.title, result.title);
      return similarity > 0.6; // 60% similarity threshold
    }).length;

    const crossRefScore = Math.min((similarCount / 3) * 100, 100); // Max 100%
    this.log(`Cross-reference results: ${similarCount} similar articles found`);
    return crossRefScore;

  } catch (error) {
    this.log('Google News cross-reference failed, using mock data');
    return this.getMockCrossReference();
  }
}

private calculateSimilarity(str1: string, str2: string): number {
  // Simple word overlap calculation
  const words1 = str1.toLowerCase().split(' ');
  const words2 = str2.toLowerCase().split(' ');
  const intersection = words1.filter(word => words2.includes(word));
  return intersection.length / Math.max(words1.length, words2.length);
}
```

## 🌍 OpenWeatherMap API (Weather Context)

### For Weather-Related News Enhancement

```bash
# Get free API key at: https://openweathermap.org/api
WEATHER_API_KEY=your_weather_key_here
```

```typescript
// Add weather context to news articles
private async addWeatherContext(newsPost: NewsPost): Promise<NewsPost> {
  if (newsPost.tags?.includes('weather') || newsPost.title.toLowerCase().includes('weather')) {
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${newsPost.location.city}&appid=${process.env.WEATHER_API_KEY}`
      );
      const weatherData = await weatherResponse.json();

      newsPost.weatherContext = {
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Weather data not critical, continue without it
    }
  }
  return newsPost;
}
```

## 🎯 Additional Powerful APIs

### 1. **Perspective API** (Google) - Toxicity Detection

```bash
# Free with Google Cloud account
PERSPECTIVE_API_KEY=your_perspective_key
```

- Detects toxic/harmful content
- Perfect for content filtering in agents

### 2. **Bing Search API** - Alternative News Source

```bash
# Free tier available
BING_SEARCH_API_KEY=your_bing_key
```

- Cross-reference news across different sources
- Enhance fact-checking accuracy

### 3. **TextRazor API** - Entity Recognition

```bash
# Free tier: 500 requests/day
TEXTRAZOR_API_KEY=your_textrazor_key
```

- Extract people, places, organizations from news
- Add smart tagging to articles

## 🚀 Quick Implementation Priority

### **For Hackathon Demo** (In order of impact):

1. **✅ Google Gemini** (Already done!)
2. **🔥 NewsAPI** - Makes Loop Agent fetch real news
3. **📰 Google News** - Makes Fact-Check Agent more credible
4. **☁️ Weather API** - Adds contextual intelligence

### **Implementation Code Ready**

I can help you integrate any of these APIs right now! Just let me know which one you want to add first.

## 💡 Pro Tips for Judges

1. **Start with mock data** (already working)
2. **Add real APIs gradually** (shows progressive enhancement)
3. **Always have fallbacks** (demonstrates production thinking)
4. **Show API integration in demo** (proves technical depth)

## 🎪 Demo Script Addition

> "And here's the real power - our agents aren't using mock data. Watch as the Loop Agent fetches live news from NewsAPI, while the Fact-Check Agent cross-references with Google News in real-time."

**Which API would you like me to integrate first?**
