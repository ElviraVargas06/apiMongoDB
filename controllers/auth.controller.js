export const register = (req, res)=>{
    console.log(req.body)
    res.json({ok: "Registrado"})
}

export const login = (req, res)=>{
    res.json({ok: "login"})
}

