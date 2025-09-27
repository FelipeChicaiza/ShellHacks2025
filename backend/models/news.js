import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  summary: {
    type: String,
    required: [true, "Summary is required"],
  },
  source: {
    type: String,
    required: [true, "Source is required"],
  },
  geotag: {
    type: {
      lat: Number,
      lng: Number
    },
    required: false,
  },
  state: { 
    type: String, 
    required: [true, "State is required"] },

  credibility_score: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

export default News;
