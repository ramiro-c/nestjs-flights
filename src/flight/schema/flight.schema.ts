import { Schema } from 'mongoose';

export const FlightSchema = new Schema(
  {
    pilot: { type: String, required: true },
    airplane: { type: String, required: true },
    destinationCity: { type: String, required: true },
    flightDate: { type: Date, required: true },
    passengers: [
      { type: Schema.Types.ObjectId, ref: 'passengers', autopopulate: true },
    ],
  },
  { timestamps: true },
);
