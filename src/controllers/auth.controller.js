import User from '../models/user.model.js'
import bcript from 'bcryptjs'
import {createAccessToken} from '../libs/jwt.js'


//funcion para registrar un usuario con un token de acceso
export const register = async (req, res) => {
   //saco los datos que me envian desde el body
   const { email, password, username } = req.body;
 
   try {
      //creo la contraseña hasheada 
     const passwordHashs= await bcript.hash(password,10)
     //creo el usuario con los datos que vienen del req.body y con la contraseña hasheada
     const newUser = new User({
       username,
       email,
       password:passwordHashs,
     });
 
    const userSaved = await newUser.save();
    const token=await createAccessToken({id:userSaved._id})
    res.cookie('token',token)
    res.json({
       message:"Usuario creado correctamente",
       id:userSaved._id,
       username:userSaved.username,
       email:userSaved.email,
       createAt:userSaved.createdAt,
       updateAt:userSaved.updatedAt,
    })
   } catch (error) {
     console.error(error);
     res.status(500).send('Error registering user');
  }
 };

export const Login = async (req, res) => {
   //saco los datos que me envian desde el body
   const { email, password} = req.body;
   try {
      //comparo el email del body con lo que esta en la base de datos para que coincidan los email
    const userFound=await User.findOne({email});
    //si no coinciden, le mando al cliente el codigo 400 con User not found
    if(!userFound) return res.status(400).json({message:"User not found"});
     //si coincide el email sigo con la contraseña, comparo la contraseña que le mando por el body con la de la base de datos pero encriptada
     const isMatch= await bcript.compare(password,userFound.password);
     //si no coincide le mando al cliente un error 400 con Incorrect password
     if(!isMatch){return res.status(400).json({message:"Incorrect password"})}
   
    //Crea el token de acceso para el usuario y le asigna el Token al id asociado
    const token=await createAccessToken({id:userFound._id})
    //manda el token por cookie
    res.cookie('token',token)
    //arma la respuesta con los datos para el cliente 
    res.json({
       id: userFound._id,
       username:userFound.username,
       email:userFound.email,
       createAt:userFound.createdAt,
       updateAt:userFound.updatedAt,
    })
   } catch (error) {
     console.error(error);
     res.status(500).send('Error registering user');
  }
 };

export const logout= (req,res)=>{
   //elimino la cookie donde tiene el token de acceso
   res.cookie('token', "",{
      //reseteo los dias
      expires:new Date(0)
   })
   return res.sendStatus(200)
}

export const profile= async(req,res)=>{
   const userFound= await User.findById(req.user.id)
   if(!userFound){return res.status(400).json({message:"User not found"}) }
   return res.json({
      id:userFound._id,
      username:userFound.username,
      email:userFound.email,
      createdAt:userFound.createdAt,
      updateAt:userFound.updatedAt,
   })
  
}