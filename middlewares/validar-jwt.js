const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT=(req,res=response,next)=>{
    const token=req.header('TokenAuth');

    if(!token){
        return res.status(401).json({ok:false,msg:'Error: token no enviado.'});
    }
    try {
       const {uid,name,email,rol}=jwt.verify(token,process.env.SECRET_JWT_SEED);
       req.uid=uid;
       req.name=name;
       req.email=email;
       req.rol=rol;
    } catch (error) {
        res.status(401).json({ok:false,msg:'Token no válido.'})
    }

    //TODO ok
    next();
}

module.exports={
    validarJWT
}