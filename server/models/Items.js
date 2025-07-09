const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,'Please provide title'],
        maxlength:[50,'Title cannot be more than 50 characters']
    },
    description : {
        type: String,
        trim: true,
        minlength: [20, "Description should be minimum of 20 characters"],
        maxlength: [300, "Description should be maximum of 300 characters"],
        required: [true, "Please provide description"],
    },
    category: {
        type: String,
        enum: {
            values: ["Electronics","Clothing","Accessories","Books","Stationery","Bags and Luggage","Sports Equipment","Personal Care Items","Musical Instruments","Gadgets","Personal Documents","Office Supplies","Medication","Miscellaneous"],
            message: "{VALUE} is not supported",
        },
        required: [true, "Please provide category of the item"],
    },
    location: {
        type: String,
        enum: {
            values: ['Open Air Theatre (OAT)','NIT Main Gate','Guest House',"Teacher's Flat",'NIT Market','Senate Hall','Amul Canteen',"Moxie's Grill",'Walk In','Golden Jubilee','Sports Complex','ED Hall','Lecture Hall','Old Administration Block','AE Lawns','Electrical Department','Mechanical Department','Civil Department','Applied Mechanics Block','MBA/MCA Department','AB Block','Computer Engineering Department','ECE Department','L-Block',"Siemen's Building",'SAC','Jubilee Hall','Library','CCN','Health Centre','NIT Lake','Girls Hostel','Boys Hostel'],
            message: "{VALUE} is not supported",
        },
        required: [true, "Please enter location"],
    },
    status:{
        type:String,
        enum:{
            values:['Open','Resolved'],
            message:"{VALUE} is not supported"
        }, 
        default:'Open', 
    },
    type:{
        type:String,
        enum:{
            values:['Lost','Found'],
            message:"{VALUE} is not supported"
        },
        required:[true,"Please provide type of the item"]
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    images :{
        type:[String],
        validate:{
            validator: function(value){
                return value.length <= 5;
            },
            message:"Maximum of 5 images are allowed",
        },
    },
    thumbnail:{
        type:String,
        required:[true,"Please provide thumbnail image"],
    },
    contact:{
        type:String,
        validate: {
            validator: function(value) {
                return value.length === 10 && !isNaN(value);
            },
            message: "Please enter a valid phone number",
        },
    },
    user : {
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
    featured:{
        type:Boolean,
        default:false,
    }
},{timestamps:true});

module.exports = mongoose.model('Item',ItemSchema);