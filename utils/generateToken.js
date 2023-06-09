import jwt from "jsonwebtoken";

const generateToken = (id, email) => {

    return jwt.sign({
        id, email
    }, process.env.JWT_KEY, {
        expiresIn: "1d",
    })


}

export default generateToken;