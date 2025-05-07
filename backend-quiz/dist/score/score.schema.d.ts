import mongoose, { Document, Types } from 'mongoose';
export type ScoreDocument = Score & Document;
export declare class Score {
    score: number;
    userId: Types.ObjectId;
    createdAt: Date;
}
export declare const ScoreSchema: mongoose.Schema<Score, mongoose.Model<Score, any, any, any, mongoose.Document<unknown, any, Score> & Score & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Score, mongoose.Document<unknown, {}, mongoose.FlatRecord<Score>> & mongoose.FlatRecord<Score> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
