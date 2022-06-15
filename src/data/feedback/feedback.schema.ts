import { trimmedRequiredString, requiredDate, SchemaFactory } from "../base";
import { IFeedback } from "./feedback.model";

const FeedbackSchema = SchemaFactory<IFeedback>({
    title: {...trimmedRequiredString},
    content: {...trimmedRequiredString},
    date: {...requiredDate}
})

export default FeedbackSchema