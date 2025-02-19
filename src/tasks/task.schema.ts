import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Task {
    @Prop({ required: true })
    url: string;

    @Prop({ enum: ["NEW", "PROCESSING", "DONE", "ERROR"], default: "NEW" })
    status: string;

    @Prop({ type: Number, default: null })
    http_code: number | null;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
