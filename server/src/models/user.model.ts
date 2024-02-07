import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Regex, UserRoles } from "../utils/constants";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    }
    role: string;
    isVerified: boolean;
    courses: Array<{courseId: string}>;
    comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: {
            validator: function (value: string) {
                return Regex.email.test(value);
            },
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String
    },
    role: {
        type: String,
        default: UserRoles.User,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    courses: [
        {
            courseId: String, 
        }
    ]
},
{
    timestamps: true
}) 

// Hash password before saving
userSchema.pre<IUser>('save', async function(next){
    if(!this.isModified('password')){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// Compare password
userSchema.methods.comparePassword = async function(enterdPassword: string): Promise<boolean>{
    return await bcrypt.compare(enterdPassword, this.password);
}

// User model
export const UserModel: Model<IUser> = mongoose.model('User', userSchema);
