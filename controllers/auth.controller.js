import {User} from "../models/User.js"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {

    const { email, password } = req.body;

    try {
        //Alternativa buscando por email

        let user = await User.findOne({ email });
        if (user) throw new Error("Email ya registrado 😒");

        user = new User({ email, password });
        await user.save();

        
        //Generar token JWT

       


        return res.json({token})
    } catch (error) {
        console.log(error)
        return res.status(404).json({ error: "Ya existe este usuario" });
    }
};

export const login = async (req, res)=>{

    try {
        const {email, password} = req.body
        let user = await User.findOne({email})
        if(!user) 
        
            return res.status(403).json({error: "No existe el usuario"})

        const respuestaPassword = await user.comparePassword(password)
        if(!respuestaPassword)
            return res.status(403).json({error: "Contraseña incorrecta"})
        
            //Generar el token JWT

            const token = jwt.sign({uid: user.id}, process.env.JWT_SECRET)
            return res.json({token})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error de Servidor"})
    }
    
}

