const Item = require('../models/Items');
const User = require("../models/User");
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const {checkPermissions} = require('../utils');
const cloudinary = require(`cloudinary`).v2;
const fs = require(`fs`);
const {categories,locations} = require('../utils');
//send categories also -> may be in dashboard too
//title, description, category, location, status, type, date, images, thumbnail, contact, user
const getAllItems = async(req,res)=>{
    const {search,category,location,order,type,featured} = req.query;

    let queryObject = {};
    if(search){
        queryObject.title = {$regex:search,$options:'i'};
    }
    if(category && category!=='all'){
        queryObject.category = category;
    }
    if(location && location!=='all'){
        queryObject.location = location;
    }
    if(type){
        queryObject.type=type;
    }
    if(featured){
        queryObject.featured=true;
    }

    const itemCount = await Item.find(queryObject).countDocuments();

    let sortOrder={
        date:-1
    };

    if(order && order === 'oldest'){
        sortOrder.date=1;
    }

    const page = req.query.page || 1;
    const limit =9;
    const skip = (page-1)*limit;    
    
    const aggregationPipeline =[
        {$match:queryObject},
        {$sort:sortOrder},
        {$skip:skip},
        {$limit:limit},
    ];

    const items = await Item.aggregate(aggregationPipeline);

    const pagination = {
        page:parseInt(page),pageSize:limit,pageCount:Math.ceil(itemCount/limit),total:itemCount
    }

    res.status(StatusCodes.OK).json({items,pagination,categories:[...categories,'all'],locations : [...locations,'all']});
}


const getSingleItem = async(req,res)=>{
    const {id} = req.params;
    const item = await Item.findOne({_id:id});

    if(!item){
        throw new CustomError.NotFoundError(`No item found with id: ${id}`);
    }

    res.status(StatusCodes.OK).json({item});
}

//title, description, category, location, status, type, date, images, thumbnail, contact, user
const createItem = async(req,res)=>{
    const {title,description,category,location,type,thumbnail} = req.body;

    const item = await Item.create({
        title,description,category,location,type,thumbnail,user:req.user.userId
    });

    await User.findOneAndUpdate({_id:req.user.userId},{$push:{items:item._id}},{new:true});

    res.status(StatusCodes.CREATED).json({item,msg:"Item created successfully"});
}

const updateItem = async(req,res)=>{
    const {id} = req.params;
    const {title,description,category,location,contact,status,image,featured} = req.body;
    // can't update item and thumbnail
    const user = await User.findOne({_id:req.user.userId});
    checkPermissions(req.user,user._id);

    const item = await Item.findOneAndUpdate({_id:id},{title,description,category,location,contact,status,featured},{new:true,runValidators:true});

    if(!item){
        throw new CustomError.NotFoundError(`Can't update this item`);
    }

    // images ka scene
    if(image){
        if(item.images.length === 5){
            throw new CustomError.BadRequestError(`Cannot upload more than 5 images`);
        }
        item.images=[...item.images,image];
        await item.save();
    }

    res.status(StatusCodes.OK).json({item,msg:"Item updated successfully"});
}

const deleteItem = async(req,res)=>{
    const {id} = req.params;
    const user = await User.findOne({_id:req.user.userId});

    checkPermissions(req.user,user._id);

    const item = await Item.findOneAndDelete({_id:id,user:req.user.userId});
    if(!item){
        throw new CustomError.NotFoundError(`Unable to delete this item`);
    }
    res.status(StatusCodes.OK).json({msg:"Item deleted successfully"});
}

const uploadImages = async(req,res)=>{
    if(!req.files){
        throw new CustomError.BadRequestError("Invalid upload request");
    }

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath,{
        use_filename:true,
        folder : 'Lost-and-Found'
    });

    // console.log(result);
    fs.unlinkSync(req.files.image.tempFilePath);
    res.status(StatusCodes.OK).json({image:result.secure_url});
}

// const addItems = async(req,res)=>{
//     const {userId} = req.user;
//     const user = await User.findOne({_id:userId});

//     const items = await Item.find({user:userId});

//     items.forEach(async(item)=>{
//         user.items.push(item._id);
//     });

//     await user.save();
//     res.status(StatusCodes.OK).json({msg:"Items added successfully",user});
// }

module.exports = {
    getAllItems,
    getSingleItem,
    createItem,
    updateItem,
    deleteItem,
    uploadImages,
}