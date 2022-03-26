import { Document, SchemaTypes } from 'mongoose';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
  '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
);

/**
 * Removes _id field in subdocuments and allows virtual fields to be returned
 */
export const readMapper = {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret, options) => {
      const { password, __v, ...rest } = ret;
      return rest;
    }
  }
};

/**
 * Defines timestamps fields in a schema
 */
export const timestamps = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

/**
 * Replaces the default mongoose id with a uuid string
 */
export const uuid = {
  type: SchemaTypes.String,
  default: nanoid
};

/**
 * Defines a schema type with a trimmed string
 */
export const trimmedString = {
  type: SchemaTypes.String,
  trim: true
};

/**
 * Defines a schema type with a trimmed required string
 */
export const trimmedRequiredString = {
  type: SchemaTypes.String,
  required: true,
  trim: true
};

/**
 * Defines a schema type with a lowercased trimmed string
 */
export const trimmedLowercaseString = {
  type: SchemaTypes.String,
  lowercase: true,
  trim: true
};

export const trimmedRequiredLowercaseString = {
  type: SchemaTypes.String,
  lowercase: true,
  trim: true,
  required: true
};

export const requiredNumber = {
  type: SchemaTypes.Number,
  required: true
};

export const requiredBoolean = {
  type: SchemaTypes.Boolean,
  required: true
};

export const optionalBoolean = {
  type: SchemaTypes.Boolean,
  required: true
};

export const requiredDate = {
  type: SchemaTypes.Date,
  required: true
};

export const uniqueIndex = {
  unique: true,
  index: true,
  required: true
};

export const foreignKey = (relation: string) => ({
  type: SchemaTypes.String,
  ref: relation,
  required: true
});

export const NIL_UUID = nanoid();

export interface BaseModel extends Document {
  _id: string;
  deleted_at: Date;
}
