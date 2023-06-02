import jwt from "jsonwebtoken";

const generateToken = (id) => {

    return jwt.sign({
        id
    }, process.env.JWT_KEY, {
        expiresIn: "60s",
    })


}

export default generateToken;