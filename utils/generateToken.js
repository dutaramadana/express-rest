import jwt from "jsonwebtoken";

const generateToken = (id, email) => {

    return jwt.sign({
        id, email
    }, process.env.JWT_KEY, {
        expiresIn: "60s",
    })


}

export default generateToken;