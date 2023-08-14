import dotenv from "dotenv";

dotenv.config();
export const server_port = process.env.SERVER_PORT || 3002;

export const mongodb_url = process.env.LOCAL_URL || process.env.LOCAL_URL;

export const default_image_path = process.env.DEFAULT_USER_IMAGE_PATH;

export const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || erhgewtrwejeihw$634365fsg;
export const jwtAccessTokenKey =
  process.env.JWT_ACCESS_TOKEN_KEY || erhgewtrwejeihw$634365fsg;
export const jwtRefreshTokenKey =
  process.env.JWT_REFRESH_TOKEN_KEY || erhgewtrwejeihw$634365fsg;
export const jwtResetPasswordKey =
  process.env.JWT_RESET_PASSWORD_KEY || erhgewtrwejeihw$634365fsg;

export const smtpUsername = process.env.SMTP_USERNAME || "";
export const smtpPassword = process.env.SMTP_PASSWORD || "";

export const cleint_url = process.env.CLEINT_URL || "";
