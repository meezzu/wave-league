import { Document } from "mongoose";

export interface IFeedback extends Document {
    title: string;
    content: string;
    date: Date;

}