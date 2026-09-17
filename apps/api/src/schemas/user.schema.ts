// apps/api/src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export type UserRole = 'admin' | 'editor';

@Schema({
  timestamps: true,
  collection: 'users',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: any) => {
      delete ret.password;
      return ret;
    },
  },
})
export class User extends Document {
  @Prop({
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: [true, 'Password is required'],
    select: false, // do not return password by default
  })
  password: string;

  @Prop({
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 120,
  })
  name: string;

  @Prop({
    type: String,
    enum: ['admin', 'editor'],
    default: 'admin',
    index: true,
  })
  role: UserRole;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);