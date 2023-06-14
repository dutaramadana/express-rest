import otpGenerator from "otp-generator";

const generateOTP = async (req, res, next) => {
  req.app.locals.otp = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  // EXPIRED THE OTP AFTER 10 SECONDS
  setTimeout(() => {
    req.app.locals.otp = null;
    console.log("OTP EXPIRED!");
  }, 10000);

  res.status(201).send({ otpCode: req.app.locals.otp });
};

const verivyOTP = async (req, res, next) => {
  const otpCode = req.app.locals.otp;

  if (parseInt(req.app.locals.otp) === parseInt(otpCode)) {
    req.app.locals.otp = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ message: "Verify Successsfully!", otpCode });
  }

  return res.status(400).send({ error: "OTP Expired!", otpCode });
};

export { generateOTP, verivyOTP };
