import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  geotag: {
    type: {
      lat: Number,
      lng: Number
    },
    required: false,
  },
  credibility_score: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

export default News;
