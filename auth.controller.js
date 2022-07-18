import {User} from "../models/User.js"

import { generateToken, generateRefreshToken } from "../utils/tokenManager.js";


export const register = async (req, res) => {

    const {nombre, email, password } = req.body;

    try {
        //Alternativa buscando por email

        let user = await User.findOne({ nombre, email });
        if (user) throw new Error("Email ya registrado 😒");

        

        user = new User({ nombre, email, password });
        await user.save();

        
        //Generar token JWT

        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.json({ user, token, expiresIn });

    } catch (error) {
        console.log(error)
        return res.status(404).json({ error: "Ya existe este usuario" });
    }
};

export const login = async (req, res)=>{

    try {
        const { email, password} = req.body
        let user = await User.findOne({email})
        if(!user) 
        
            return res.status(403).json({error: "No existe el usuario"})

        const respuestaPassword = await user.comparePassword(password)
        if(!respuestaPassword)
            return res.status(403).json({error: "Contraseña incorrecta"})
        
            //Generar el token JWT

           
        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.json({ user, token, expiresIn });
            
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error de Servidor"})
    }
    
}

export const refreshToken = (req, res) => {
    try {
        let refreshTokenCookie = req.cookies?.refreshToken;
        if (!refreshTokenCookie) throw new Error("No existe el refreshToken");

        const { id } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

        const { token, expiresIn } = generateToken(id);

        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        const data = errorsToken(error);
        return res.status(401).json({ error: data });
    }
};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean();
        delete user.password;
        return res.json({ user });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie("refreshToken");
    return res.json({ ok: true });
};
