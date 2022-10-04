const {response}=require('express');
const { RESPONSE_MESSAGES } = require('../Helpers/ResponseMessages');
const Evento = require("../Model/Evento");
const Rama = require('../Model/Rama');
const Scout = require('../Model/Scout');
const logger = require('../Helpers/LoggerConfig');

const createEvento= async(req,res=response)=>{
    try{

        let rama_asociada = await Rama.findById(req.body.idRama);
        if(!rama_asociada ) {return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        if(req.body.idScout){
            let scout_= await Scout.findById(req.body.idScout);
            if(!scout_) {return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
            let evento = new Evento(req.body);
            evento.ramaAsignada.push(rama_asociada.id)
            evento.inscritos.push(scout_.id);
            await evento.save();
            return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
        }
        let evento = new Evento(req.body);
        evento.ramaAsignada.push(rama_asociada.id)
        await evento.save();
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(e) {
        logger.error(`createEvento: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readEventos= async(req,res=response)=>{
    try{
        const Eventos_ = await Evento.find();
        if(Eventos_){return res.status(200).json({ok:true,Eventos_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readEventos: Internal server error: ${e}`);
        res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readEvento= async(req,res=response)=>{
    try{
        const Evento_ = await Evento.findById(req.params.id);
        if(Evento_){return res.status(200).json({ok:true,Evento_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readEvento: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND})
    }
}
const getScoutsAsignadosEvento = async(req, res=response) => {
    try{
        let evento_ = await Evento.findById(req.params.id).populate('inscritos');
        if(!evento_){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        return res.status(200).json({ok:true,evento_,msg:RESPONSE_MESSAGES.SUCCESS_2XX,Evento:evento_.titulo});
}
catch(e){ logger.error(`getScoutAsignadosEvento: Internal server error: ${e}`);
return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
}

}

const updateEvento = async (req, res = response) => {
    try {
        let evento = await Evento.findById( req.params.id );
        if ( !evento ) {return res.status(404).json({ok: true,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Evento.updateOne({_id:req.params.id},{$set:{...req.body}}, { upsert: true });
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (e) {
        logger.error(`updateEvento: Internal server error: ${e}`);
       return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const deleteEvento= async(req,res=response)=>{
    try {
        let evento = await Evento.findById(req.params.id);
        if ( !evento ) {return res.status(404).json({ok: true,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Evento.findByIdAndDelete( req.params.id );
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}

module.exports={
    createEvento,
    readEvento,
    readEventos,
    getScoutsAsignadosEvento,
    updateEvento,
    deleteEvento
}