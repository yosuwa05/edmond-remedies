import { model, Schema } from "mongoose";

const enquirySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Full Name is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
    },
    countryCode:{
        type:String,
        required:[true,'CountryCode is Required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v: string) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: (props: { value: any; }) => `${props.value} is not a valid email address!`
        }
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","follow-up","closed"]
    },
    hospitalName: {
        type: String,
        required: [true, 'Hospital Name is required'],
        trim: true
    },
    hospitalType: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        minlength: [5, 'Message must be at least 5 characters']
    }
}, {
    timestamps: true
});

export const EnquiryForm = model("EnquiryForm", enquirySchema);
