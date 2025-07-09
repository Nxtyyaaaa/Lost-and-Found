const User = require('../models/User');
const CustomError = require('../errors');
const {StatusCodes} = require('http-status-codes');
const {checkPermissions, categories,locations,branches} = require('../utils');
const cloudinary = require('cloudinary');

const getAllUsers  = async(req,res)=>{
   const users = await User.find({});
   res.status(StatusCodes.OK).json({users});
}

const getSingleUser = async(req,res)=>{
    const {id} = req.params;
    const user = await User.findOne({_id:id});

    if(!user){
        throw new CustomError.NotFoundError(`No user with id : ${id}`);
    }

    checkPermissions(req.user,user._id);
    res.status(StatusCodes.OK).json({user});
}

const getCurrentUser = async(req,res)=>{
    const {userId} = req.user;

    const user =await User.findOne({_id:userId}).select('-password').populate({
        path:'items',
        select:'title description category location status type date images thumbnail',
    });
    res.status(StatusCodes.OK).json({user,categories,locations,branches});
}

const updateUser = async(req,res)=>{
    const {name,profileImage,branch} = req.body;
    const {id} = req.params;
    const user = await User.findOne({_id:id});

    if(!user){
        throw new CustomError.NotFoundError(`No user with id : ${id}`);
    }
    
    checkPermissions(req.user,user._id);

    if(profileImage && profileImage!==""){
        if(profileImage == "https://res.cloudinary.com/drnrsxnx9/image/upload/v1721289157/Lost-and-Found/tmp-1-1721289111010_xglzvn.png"){
            user.profileImage=profileImage;
        }
        else{
            function getImagePublicId(url){
                const parts = url.split('/');
                const publicIdPart = parts[parts.length-1].split('.')[0];
                return publicIdPart;
            }

            const url=user.profileImage;
            const imagePublicId = getImagePublicId(url);

            await cloudinary.v2.api.delete_resources([`Lost-and-Found/${imagePublicId}`],{
                type:"upload",
                resource_type:"image"   
            }).then((result)=>{
                // console.log("Deleted result : ",result);
            }).catch((error)=>{
                // console.log("Error in deleting image : ",error);
            })
            user.profileImage=profileImage;
        }
    }
    if(name){
        user.name=name;
    }
    if(branch){
        user.branch=branch;
    }

    await user.save();

    // const updatedUser = await User.findOneAndUpdate({_id:id},{name,profileImage,branch},{new:true,runValidators:true});
    res.status(StatusCodes.OK).json({user,msg:"User updated Successfully"});
}

const deleteUser = async(req,res)=>{
    const {id} = req.params;
    const user = await User.findOne({_id:id});
    // console.log(user);
    if(!user){
        throw new CustomError.NotFoundError(`No user with id : ${id}`);
    }
    
    checkPermissions(req.user,user._id);

    // await user.remove(); -> In new mongoose versions it is not allowed to use the remove hook, so if I need to use the pre hook, then a pre hook to deleteOne has to be created
    await User.deleteOne({_id:id});
    
    return res.status(StatusCodes.OK).json({msg:"User deleted successfully"});
}

module.exports ={getAllUsers,getSingleUser,getCurrentUser,updateUser,deleteUser};