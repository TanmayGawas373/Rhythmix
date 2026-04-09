import mongoose, { Document, Schema } from "mongoose";

export interface SongData {
  title: string;
  artist: string;
  duration: number;
  genre: string;
  url: string;
  poster: string;
}

export interface ISong extends Document {
  title: string;
  artist: string;
  duration: number;
  genre: string; 
  url: string;      
  poster: string;
}

const SongSchema = new Schema<ISong>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  duration: { type: Number, required: true },
  genre: { type: String, required: true },
  url: { type: String, required: true },
  poster: { type: String, required: true}
});

export default mongoose.model<ISong>("Song", SongSchema);